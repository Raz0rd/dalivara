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
    // Verificar se telefone foi enviado
    if (!body.phone || body.phone.trim() === '') {
      console.error('❌ Telefone não foi enviado no body:', body.phone);
      throw new Error('Telefone é obrigatório');
    }
    
    // Telefone: remover (, ), espaços, - e qualquer caractere não numérico
    const cleanPhone = body.phone.replace(/[\(\)\s\-]/g, '').replace(/\D/g, '');
    const cleanCPF = body.cpf.replace(/\D/g, ''); // Remove formatação
    const cleanEmail = customerEmail.replace(/[^a-zA-Z0-9@._-]/g, ''); // Remove caracteres inválidos
    
    console.log('📞 [Validação] Telefone recebido:', body.phone);
    console.log('📞 [Validação] Telefone após limpeza:', cleanPhone);
    console.log('📞 [Validação] Tamanho:', cleanPhone.length);
    
    // Validações
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      console.error('❌ Telefone inválido após limpeza:', cleanPhone, 'Length:', cleanPhone.length);
      console.error('❌ Telefone original recebido:', body.phone);
      throw new Error('Telefone inválido - deve ter 10 ou 11 dígitos (formato: 11999999999)');
    }
    
    if (cleanCPF.length !== 11) {
      throw new Error('CPF inválido');
    }
    
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      throw new Error('Email inválido');
    }
    
    // Validar valor mínimo (R$ 1,00 = 100 centavos)
    if (body.amount < 100) {
      console.error('❌ Valor abaixo do mínimo:', body.amount, 'centavos');
      throw new Error('Valor mínimo para PIX é R$ 1,00');
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
      
      // Tentar extrair mensagem de erro específica do GhostPay
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.refusedReason?.description) {
          throw new Error(errorData.refusedReason.description);
        }
      } catch (parseError) {
        // Se não conseguir parsear, usar erro genérico
      }
      
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

    // Enviar pedido PENDING para backend do Açaí
    try {
      console.log("📤 [AÇAÍ API] Enviando pedido PENDING...");
      
      const acaiPayload = {
        transactionId: transactionId,
        customer: {
          name: body.nome,
          email: customerEmail,
          phone: cleanPhone,
          cpf: cleanCPF,
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0',
          city: body.cidade || '',
          state: body.estado || '',
          country: 'BR'
        },
        amount: body.amount,
        status: "pending",
        gateway: "ghost",
        pixCode: pixCode,
        items: [
          {
            id: "acai-delivery",
            name: body.productTitle || "Açaí Delivery",
            quantity: 1,
            price: body.amount
          }
        ],
        utms: {
          utm_source: body.utmParams?.utm_source || null,
          utm_medium: body.utmParams?.utm_medium || null,
          utm_campaign: body.utmParams?.utm_campaign || null,
          utm_content: body.utmParams?.utm_content || null,
          utm_term: body.utmParams?.utm_term || null
        },
        metadata: {
          hostname: hostname,
          delivery_address: body.endereco || ''
        }
      };
      
      const acaiResponse = await fetch('https://tokioroll.shop/api/acai/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'acai_secret_key_12345'
        },
        body: JSON.stringify(acaiPayload)
      });
      
      if (acaiResponse.ok) {
        const acaiResult = await acaiResponse.json();
        console.log("✅ [AÇAÍ API] Pedido PENDING enviado com sucesso:", acaiResult);
      } else {
        const errorText = await acaiResponse.text();
        console.error("⚠️ [AÇAÍ API] Erro ao enviar pedido:", acaiResponse.status, errorText);
      }
    } catch (acaiError) {
      console.error("❌ [AÇAÍ API] Erro ao enviar pedido:", acaiError);
      // Não falhar a requisição se API do Açaí falhar
    }

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
      
      // Obter a URL base do próprio request (hostname correto via Nginx)
      const protocol = req.headers.get('x-forwarded-proto');
      const host = req.headers.get('host');
      
      if (!protocol || !host) {
        throw new Error('Headers x-forwarded-proto ou host não encontrados');
      }
      
      const baseUrl = `${protocol}://${host}`;
      
      console.log("🔗 [Utmify] Headers recebidos:");
      console.log("  - x-forwarded-proto:", protocol);
      console.log("  - host:", host);
      console.log("🔗 [Utmify] Usando baseUrl do próprio processo:", baseUrl);
      
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
    
    // Retornar mensagem de erro específica
    let errorMessage = 'Erro ao gerar PIX';
    
    if (error.message) {
      if (error.message.includes('CPF inválido')) {
        errorMessage = 'CPF inválido';
      } else if (error.message.includes('Telefone inválido')) {
        errorMessage = 'Telefone inválido';
      } else if (error.message.includes('Email inválido')) {
        errorMessage = 'Email inválido';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        details: error?.response?.data || null,
      },
      { status: 400 }
    );
  }
}
