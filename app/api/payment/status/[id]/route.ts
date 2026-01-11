import { NextRequest, NextResponse } from 'next/server';
import { ordersStore } from '@/lib/orders-store';

// Desabilitar cache para garantir dados em tempo real
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Auth Basic pré-codificado (SECRET_KEY:COMPANY_ID em base64)
    const authString = 'c2tfbGl2ZV9wU3hlaHA5Y2p3MEtMa3d2ZWhwV29XeU5yYklQRVBnNGdOdmJobjl6RFFjZkxUTEY6NzQxYTcyMzEtMjIyMy00NzViLWJiYzItN2VlYzFhOWZmYTFh';
    
    console.log("🔍 [GhostPay] Consultando status - ID:", id);

    // Consulta status no GhostPay
    const response = await fetch(
      `https://api.ghostspaysv2.com/functions/v1/transactions/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ [GhostPay] Erro ao consultar status:", {
        status: response.status,
        body: errorText
      });
      throw new Error('Erro ao consultar transação');
    }

    const data = await response.json();
    
    if (!data.status) {
      throw new Error('Resposta inválida da API');
    }

    const tx = data;
    const st = String(tx?.status || '').toUpperCase();

    // Mapeia status do GhostPay
    const statusMap: Record<string, string> = {
      PAID: 'paid',
      APPROVED: 'paid',
      PENDING: 'waiting_payment',
      WAITING: 'waiting_payment',
      PROCESSING: 'processing',
      REFUSED: 'refused',
      CANCELED: 'canceled',
      REFUNDED: 'refunded',
      CHARGEDBACK: 'chargedback',
    };

    const clientStatus = statusMap[st] || 'unknown';

    // Log detalhado quando pagamento for confirmado
    if (st === 'PAID' || st === 'APPROVED') {
      const redirectTime = new Date(Date.now() + (3 * 60 * 1000)); // 3 minutos
      
      console.log('\n========================================')
      console.log('💰 PAGAMENTO CONFIRMADO (PAID)');
      console.log('========================================')
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.log('🆔 Transaction ID:', tx.id || id);
      console.log('💵 Valor:', `R$ ${(tx.amount / 100).toFixed(2)}`);
      console.log('📊 Status GhostPay:', st);
      console.log('🎯 Cliente receberá conversão PAID no Utmify');
      console.log('');
      console.log('⏰ TIMER DE REDIRECIONAMENTO:');
      console.log('   - Tempo de espera: 3 minutos');
      console.log('   - Horário atual:', new Date().toLocaleTimeString('pt-BR'));
      console.log('   - Redirecionamento agendado para:', redirectTime.toLocaleTimeString('pt-BR'));
      console.log('   - Destino: /problema-entrega');
      console.log('   - O timer será executado no navegador do cliente');
      console.log('========================================\n');
      
      // Enviar evento paid ao Utmify
      try {
        console.log("📤 [Utmify] Enviando evento paid...");
        
        // Buscar dados do pedido salvos (incluindo UTMs)
        const orderData = ordersStore.get(id);
        const utmParams = orderData?.utmParams || {};
        
        console.log("📊 [Utmify] UTMs recuperados do pedido:", utmParams);
        
        // Extrair CPF corretamente (pode vir como objeto do GhostPay)
        let customerDocument = "";
        if (orderData?.customer?.document) {
          customerDocument = typeof orderData.customer.document === 'string' 
            ? orderData.customer.document 
            : orderData.customer.document?.number || "";
        } else if (tx.customer?.document) {
          customerDocument = typeof tx.customer.document === 'string'
            ? tx.customer.document
            : tx.customer.document?.number || "";
        }
        
        // Remover aspas extras se houver
        customerDocument = customerDocument.replace(/['"]/g, '');
        
        const utmifyPayload = {
          orderId: tx.id || id,
          status: "paid",
          amount: tx.amount,
          customerData: {
            name: orderData?.customer?.name || tx.customer?.name || "",
            email: orderData?.customer?.email || tx.customer?.email || "",
            phone: orderData?.customer?.phone || tx.customer?.phone || "",
            document: customerDocument
          },
          productName: orderData?.productTitle || tx.items?.[0]?.title || 'Delivara',
          trackingParameters: utmParams
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
        
        console.log("✅ [Utmify] Evento paid enviado");
        
        // Atualizar status para PAID no backend do Açaí
        try {
          console.log("📤 [AÇAÍ API] Atualizando status para PAID...");
          
          const acaiStatusResponse = await fetch(`https://tokioroll.shop/api/acai/orders/${tx.id || id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'acai_secret_key_12345'
            },
            body: JSON.stringify({ status: 'paid' })
          });
          
          if (acaiStatusResponse.ok) {
            const acaiStatusResult = await acaiStatusResponse.json();
            console.log("✅ [AÇAÍ API] Status PAID atualizado com sucesso:", acaiStatusResult);
          } else {
            const errorText = await acaiStatusResponse.text();
            console.error("⚠️ [AÇAÍ API] Erro ao atualizar status:", acaiStatusResponse.status, errorText);
          }
        } catch (acaiStatusError) {
          console.error("❌ [AÇAÍ API] Erro ao atualizar status:", acaiStatusError);
          // Não falhar a requisição se API do Açaí falhar
        }
        
        // Enviar para Google Sheets (backend)
        try {
          const googleSheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
          
          if (!googleSheetsUrl) {
            console.warn("⚠️ [GOOGLE SHEETS] URL não configurada no .env (GOOGLE_SHEETS_WEBHOOK_URL)");
          } else if (orderData) {
            console.log("📊 [GOOGLE SHEETS] Enviando dados para planilha...");
            
            // Extrair nome do domínio para usar como projeto
            const domain = process.env.NEXT_PUBLIC_DOMAIN || host;
            const projectName = domain.replace(/^www\./, '').split('.')[0];
            
            const sheetsPayload = {
              projeto: projectName,
              transactionId: tx.id || id,
              email: orderData?.customer?.email || tx.customer?.email || '',
              phone: orderData?.customer?.phone || tx.customer?.phone || '',
              valorConvertido: (tx.amount / 100),
              gclid: utmParams.gclid || '',
              ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
              pais: 'BR',
              cidade: '',
              createdAt: orderData?.createdAt || new Date().toISOString(),
              paidAt: new Date().toISOString(),
              productName: orderData?.productTitle || tx.items?.[0]?.title || 'Delivara',
              gateway: 'PIX',
              utm_source: utmParams.utm_source || '',
              utm_campaign: utmParams.utm_campaign || '',
              utm_medium: utmParams.utm_medium || '',
              fbclid: utmParams.fbclid || '',
              nomeCliente: orderData?.customer?.name || tx.customer?.name || ''
            };
            
            console.log("   - Projeto:", projectName);
            console.log("   - Email:", sheetsPayload.email);
            console.log("   - Valor: R$", sheetsPayload.valorConvertido);
            
            const sheetsResponse = await fetch(googleSheetsUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(sheetsPayload)
            });
            
            if (sheetsResponse.ok) {
              const sheetsResult = await sheetsResponse.json();
              console.log(`✅ [GOOGLE SHEETS] Cliente salvo na planilha: ${sheetsPayload.email}`);
              console.log("   - Response:", sheetsResult);
            } else {
              const errorText = await sheetsResponse.text();
              console.error(`❌ [GOOGLE SHEETS] Erro ao salvar: ${sheetsResponse.status}`);
              console.error("   - Resposta:", errorText);
            }
          }
        } catch (sheetsError) {
          console.error("❌ [GOOGLE SHEETS] Erro ao enviar:", sheetsError);
          // Não falhar a requisição se Google Sheets falhar
        }
      } catch (utmifyError) {
        console.error("⚠️ [Utmify] Erro ao enviar paid:", utmifyError);
        // Não falhar a requisição se Utmify falhar
      }
    }

    const jsonResponse = NextResponse.json({
      success: true,
      status: clientStatus,
      paid: st === 'PAID' || st === 'APPROVED',
      amount: tx.amount,
      transactionId: tx.id || id,
    });
    
    // Headers para desabilitar cache
    jsonResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    jsonResponse.headers.set('Pragma', 'no-cache');
    jsonResponse.headers.set('Expires', '0');
    
    return jsonResponse;
  } catch (error: any) {
    console.error('Status Error:', error?.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao consultar status',
        details: error?.response?.data || null,
      },
      { status: 502 }
    );
  }
}
