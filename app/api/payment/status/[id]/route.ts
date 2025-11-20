import { NextRequest, NextResponse } from 'next/server';

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
      console.log('\n========================================')
      console.log('💰 PAGAMENTO CONFIRMADO (PAID)');
      console.log('========================================')
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.log('🆔 Transaction ID:', tx.id || id);
      console.log('💵 Valor:', `R$ ${(tx.amount / 100).toFixed(2)}`);
      console.log('📊 Status GhostPay:', st);
      console.log('🎯 Cliente receberá conversão PAID no Utmify');
      console.log('========================================\n');
    }

    return NextResponse.json({
      success: true,
      status: clientStatus,
      paid: st === 'PAID' || st === 'APPROVED',
      amount: tx.amount,
      transactionId: tx.id || id,
    });
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
