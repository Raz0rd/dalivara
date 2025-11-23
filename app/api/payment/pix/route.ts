import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { ordersStore } from '@/lib/orders-store';

// Função para gerar email fake baseado no nome
function generateFakeEmail(name: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
  return `${cleanName}@gmail.com`;
}

// Extrair nome do domínio (ex: www.nacionalacai.com -> nacionalacai)
function extractDomainName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    if (parts[0] === 'www' && parts.length > 1) {
      return parts[1];
    }
    return parts[0];
  } catch {
    return 'produto';
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hostname = body?.hostname || 'localhost';
    
    console.log("\n👻 [GhostPay] Iniciando geração de PIX");
    console.log("🌐 [GhostPay] Valor: R$", (body.amount / 100).toFixed(2));
    console.log("📊 [GhostPay] UTMs recebidos no body:", body.utmParams);

    // Auth Basic pré-codificado (SECRET_KEY:COMPANY_ID em base64)
    const authString = 'c2tfbGl2ZV9wU3hlaHA5Y2p3MEtMa3d2ZWhwV29XeU5yYklQRVBnNGdOdmJobjl6RFFjZkxUTEY6NzQxYTcyMzEtMjIyMy00NzViLWJiYzItN2VlYzFhOWZmYTFh';
    console.log("🔐 [GhostPay] Auth configurado");

    const domainName = extractDomainName(`https://${hostname}`);
    const customerEmail = body.email || generateFakeEmail(body.nome);

    // Limpar e validar dados
    const cleanPhone = body.phone.replace(/\D/g, ''); // Remove formatação
    const cleanCPF = body.cpf.replace(/\D/g, ''); // Remove formatação
    const cleanEmail = customerEmail.replace(/[^a-zA-Z0-9@._-]/g, ''); // Remove caracteres inválidos
    
    // Validações
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      throw new Error('Telefone inválido');
    }
    
    if (cleanCPF.length !== 11) {
      throw new Error('CPF inválido');
    }
    
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Email inválido');
    }
    
    console.log("✅ [GhostPay] Dados validados e limpos");
    console.log("📞 Telefone limpo:", cleanPhone);
    console.log("🆔 CPF limpo:", cleanCPF);
    console.log("📧 Email limpo:", cleanEmail);
    
    const ghostPayload = {
      amount: body.amount,
      paymentMethod: 'pix',
      customer: {
        name: body.nome,
        email: cleanEmail,
        phone: cleanPhone,
        document: {
          number: cleanCPF,
          type: 'cpf'
        }
      },
      items: [
        {
          title: `Produto Digital ${domainName}`,
          unitPrice: body.amount,
          quantity: 1,
          tangible: false
        }
      ]
    };
    
    console.log("📤 [GhostPay] Enviando requisição...");
    
    const response = await fetch("https://api.ghostspaysv2.com/functions/v1/transactions", {
      method: "POST",
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ghostPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [GhostPay] ERROR RESPONSE:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      throw new Error(`Erro na API de pagamento: ${response.status}`);
    }

    const data = await response.json();

    // Extrair informações da resposta GhostPay
    const transactionId = data.id || data.transaction_id || data.transactionId;
    const pixCode = data.pix?.qrcode || data.pixCode || data.pix_code || data.code;
    const qrCodeImage = data.qrCode || data.qr_code || data.qr_code_url || data.pix?.qr_code_url;
    
    console.log("✅ [GhostPay] PIX gerado - ID:", transactionId);
    
    // Gerar QR Code base64 se não vier da API
    let qrCodeBase64 = qrCodeImage;
    if (!qrCodeBase64 && pixCode) {
      qrCodeBase64 = await QRCode.toDataURL(pixCode, { errorCorrectionLevel: 'H' });
    }

    // Salvar dados do pedido incluindo UTMs
    ordersStore.set(String(transactionId), {
      hostname,
      productName: body.productTitle || 'Delivara',
      totalAmount: body.amount,
      quantity: body.quantity || 1,
      customer: {
        name: body.nome || null,
        email: customerEmail,
        phone: body.phone || null,
        document: body.cpf || null,
      },
      utmParams: body.utmParams || {}, // Salvar UTMs capturados
      gateway: 'ghostpay',
      createdAt: new Date().toISOString(),
    });

    // Log dos UTMs recebidos
    if (body.utmParams && Object.keys(body.utmParams).length > 0) {
      console.log('📊 UTMs recebidos no pedido:', body.utmParams);
    }

    console.log("🎉 [GhostPay] Pedido criado com sucesso!");

    // Enviar evento waiting_payment ao Utmify
    try {
      console.log("📤 [Utmify] Enviando evento waiting_payment...");
      
      const utmifyPayload = {
        orderId: transactionId,
        status: "pending",
        amount: body.amount,
        customerData: {
          name: body.nome,
          email: customerEmail,
          phone: body.phone,
          document: body.cpf
        },
        productName: body.productTitle || 'Delivara',
        trackingParameters: body.utmParams || {}
      };
      
      // Usar localhost para evitar problemas de SSL em produção
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'http://localhost:3000' 
        : 'http://localhost:3000';
      
      await fetch(`${baseUrl}/api/utmify/conversion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(utmifyPayload)
      });
      
      console.log("✅ [Utmify] Evento waiting_payment enviado");
    } catch (utmifyError) {
      console.error("⚠️ [Utmify] Erro ao enviar waiting_payment:", utmifyError);
      // Não falhar a requisição se Utmify falhar
    }

    return NextResponse.json({
      success: true,
      transactionId: transactionId,
      pixData: {
        code: pixCode,
        qrCode: qrCodeBase64,
      },
    });
  } catch (error: any) {
    console.error('PIX Error:', error?.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao gerar PIX',
        details: error?.response?.data || null,
      },
      { status: 500 }
    );
  }
}
