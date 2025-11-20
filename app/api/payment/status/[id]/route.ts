import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const KEY_NITRO = 'dd3ceZq6igABxvpUxmY1eGgf9bPDJwqRppZTdzvnw9SCrTZpMDOWBB6tLlWj';

function getUmbrelaHeaders() {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Consulta status na Nitro
    const { data } = await axios.get(
      `https://api.nitropagamentos.com/api/public/v1/transactions/${id}?api_token=${KEY_NITRO}`,
      {
        headers: getUmbrelaHeaders(),
        timeout: 15000,
      }
    );

    if (!data.payment_status) {
      throw new Error(data.message || 'Erro ao consultar transação');
    }

    const tx = data;
    const st = String(tx?.payment_status || '').toUpperCase();

    // Mapeia status
    const statusMap: Record<string, string> = {
      PAID: 'paid',
      WAITING_PAYMENT: 'waiting_payment',
      PROCESSING: 'processing',
      AUTHORIZED: 'processing',
      REFUSED: 'refused',
      CANCELED: 'canceled',
      REFUNDED: 'refunded',
      CHARGEDBACK: 'chargedback',
    };

    const clientStatus = statusMap[st] || 'unknown';

    // Log detalhado quando pagamento for confirmado
    if (st === 'PAID') {
      console.log('\n========================================');
      console.log('💰 PAGAMENTO CONFIRMADO (PAID)');
      console.log('========================================');
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.log('🆔 Transaction ID:', tx.hash);
      console.log('💵 Valor:', `R$ ${(tx.amount / 100).toFixed(2)}`);
      console.log('📊 Status Nitro:', st);
      console.log('🎯 Cliente receberá conversão PAID no Utmify');
      console.log('========================================\n');
    }

    return NextResponse.json({
      success: true,
      status: clientStatus,
      paid: st === 'PAID',
      amount: tx.amount,
      transactionId: tx.hash,
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
