import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook para receber notificações do Utmify
 * Loga todas as conversões recebidas e salva no Google Sheets quando PAID
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const status = body?.status || body?.transaction?.status;
    
    console.log('\n========================================');
    console.log('🎯 WEBHOOK UTMIFY RECEBIDO');
    console.log('========================================');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📊 Status:', status);
    console.log('📦 Payload completo:', JSON.stringify(body, null, 2));
    console.log('========================================\n');

    // Se o status for PAID, salvar no Google Sheets e enviar para API
    if (status === 'PAID' || status === 'paid') {
      // Extrair dados do webhook
      const transactionData = body?.transaction || body;
      const orderData = body?.order || {};
      const trackingParameters = body?.trackingParameters || orderData?.trackingParameters || {};
      
      // Extrair nome do domínio para usar como projeto
      const host = req.headers.get('host') || '';
      const domain = host || process.env.NEXT_PUBLIC_DOMAIN || 'acai.shop';
      const projectName = domain.replace(/^www\./, '').split('.')[0];
      
      // 1. Enviar para API de Açaí
      try {
        const { sendToAcaiAPI, buildAcaiPayload } = await import('@/lib/acai-api');
        
        const acaiPayload = buildAcaiPayload(
          (transactionData?.id || transactionData?.transactionId || body?.transactionId || '').toString(),
          'paid',
          orderData,
          transactionData,
          domain,
          transactionData?.pixCode || orderData?.pixCode,
          'ghost'
        );
        
        console.log(`📤 [ACAI API] Enviando para API centralizada...`);
        const apiSuccess = await sendToAcaiAPI(acaiPayload);
        
        if (apiSuccess) {
          console.log(`✅ [ACAI API] Pedido enviado com sucesso`);
        } else {
          console.log(`⚠️ [ACAI API] Falha ao enviar pedido (continuando...)`);
        }
      } catch (apiError) {
        console.error(`❌ [ACAI API] Erro ao enviar:`, apiError);
      }
      
      // 2. Salvar no Google Sheets
      try {
        const { saveToGoogleSheets } = await import('@/lib/google-sheets');
        
        console.log(`🏷️ [SHEETS] Host recebido: ${host}`);
        console.log(`🏷️ [SHEETS] Domain extraído: ${domain}`);
        console.log(`🏷️ [SHEETS] Nome do projeto: ${projectName}`);
        
        // Calcular valor em reais
        const valorEmReais = (() => {
          if (transactionData?.amount) {
            return parseFloat((transactionData.amount / 100).toFixed(2));
          } else if (orderData?.amount) {
            return parseFloat((orderData.amount >= 100 ? orderData.amount / 100 : orderData.amount).toFixed(2));
          }
          return 0;
        })();
        
        console.log(`💰 [SHEETS] Valor calculado: R$ ${valorEmReais}`);
        
        // Montar payload para Google Sheets
        const sheetsPayload = {
          projeto: projectName || 'acai',
          createdAt: transactionData?.createdAt || orderData?.timestamp || new Date().toISOString(),
          paidAt: transactionData?.paidAt || new Date().toISOString(),
          transactionId: (transactionData?.id || transactionData?.transactionId || body?.transactionId || '')?.toString(),
          email: transactionData?.customer?.email || orderData?.customer?.email || '',
          phone: transactionData?.customer?.phone || orderData?.customer?.phone || '',
          nomeCliente: transactionData?.customer?.name || orderData?.customer?.name || '',
          cpf: transactionData?.customer?.document || orderData?.customer?.document || '',
          valorConvertido: valorEmReais,
          productName: orderData?.products?.[0]?.name || transactionData?.productName || 'Açaí',
          gateway: 'ghostpay',
          pais: orderData?.customer?.country || transactionData?.customer?.country || 'BR',
          cidade: orderData?.customer?.city || transactionData?.customer?.city || '',
          ip: transactionData?.ip || orderData?.customer?.ip || trackingParameters?.ip || '',
          gclid: trackingParameters?.gclid || '',
          gbraid: trackingParameters?.gbraid || '',
          wbraid: trackingParameters?.wbraid || '',
          utm_source: trackingParameters?.utm_source || '',
          utm_campaign: trackingParameters?.utm_campaign || '',
          utm_medium: trackingParameters?.utm_medium || '',
          utm_content: trackingParameters?.utm_content || '',
          utm_term: trackingParameters?.utm_term || '',
          fbclid: trackingParameters?.fbclid || '',
          keyword: trackingParameters?.keyword || '',
          device: trackingParameters?.device || '',
          network: trackingParameters?.network || '',
          gad_source: trackingParameters?.src || trackingParameters?.gad_source || '',
          gad_campaignid: trackingParameters?.sck || trackingParameters?.gad_campaignid || '',
          cupons: ''
        };
        
        console.log(`📊 [GOOGLE SHEETS] Enviando dados para planilha...`);
        console.log(`   - Projeto: ${sheetsPayload.projeto}`);
        console.log(`   - Transaction ID: ${sheetsPayload.transactionId}`);
        console.log(`   - Email: ${sheetsPayload.email}`);
        console.log(`   - Telefone: ${sheetsPayload.phone}`);
        console.log(`   - Valor: R$ ${sheetsPayload.valorConvertido}`);
        console.log(`   - IP: ${sheetsPayload.ip}`);
        console.log(`   - GCLID: ${sheetsPayload.gclid}`);
        console.log(`   - GBRAID: ${sheetsPayload.gbraid}`);
        
        // Salvar usando Google Sheets API
        const sheetsResult = await saveToGoogleSheets(sheetsPayload);
        
        console.log(`✅ [GOOGLE SHEETS] Cliente salvo na planilha: ${sheetsPayload.email}`);
        console.log(`   - Aba: ${sheetsResult.sheet}`);
        console.log(`   - Linhas adicionadas: ${sheetsResult.rows}`);
      } catch (sheetsError) {
        console.error(`❌ [GOOGLE SHEETS] Erro ao enviar:`, sheetsError);
      }
    } else {
      console.log(`ℹ️ [Webhook] Status recebido: ${status} (não é PAID)`);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook recebido com sucesso',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Erro ao processar webhook do Utmify:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao processar webhook',
        error: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para testar se o webhook está funcionando
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook Utmify está funcionando',
    timestamp: new Date().toISOString()
  });
}
