import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint para logar conversões do Utmify no backend
 * Chamado pelo frontend após enviar conversão
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      event,
      transaction_id,
      value,
      currency,
      email,
      phone,
      utmParams,
      success,
      timestamp
    } = body;

    console.log('\n========================================');
    console.log('📤 PAID ENVIADO PRO UTMIFY - Açaí >');
    console.log('========================================');
    console.log('⏰ Timestamp:', timestamp || new Date().toISOString());
    console.log('🎯 Evento:', event || 'paid');
    console.log('🆔 Transaction ID:', transaction_id);
    console.log('💵 Valor:', `R$ ${value?.toFixed(2)}`);
    console.log('💰 Moeda:', currency || 'BRL');
    
    if (email) console.log('📧 Email:', email);
    if (phone) console.log('📱 Telefone:', phone);
    
    console.log('\n📊 UTMs CAPTURADOS:');
    if (utmParams && Object.keys(utmParams).length > 0) {
      Object.entries(utmParams).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
      console.log(`   Total: ${Object.keys(utmParams).length} parâmetros`);
    } else {
      console.log('   ⚠️ Nenhum UTM capturado');
    }
    
    console.log('\n✅ Status:', success ? 'Enviado com sucesso' : 'Falha no envio');
    console.log('========================================\n');

    return NextResponse.json({
      success: true,
      message: 'Log registrado no backend',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Erro ao logar conversão do Utmify:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao registrar log',
        error: error.message
      },
      { status: 500 }
    );
  }
}
