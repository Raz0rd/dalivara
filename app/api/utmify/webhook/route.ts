import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook para receber notificações do Utmify
 * Loga todas as conversões recebidas
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('\n========================================');
    console.log('🎯 WEBHOOK UTMIFY RECEBIDO');
    console.log('========================================');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📦 Payload completo:', JSON.stringify(body, null, 2));
    console.log('========================================\n');

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
