import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import QRCode from 'qrcode';

const KEY_NITRO = 'dd3ceZq6igABxvpUxmY1eGgf9bPDJwqRppZTdzvnw9SCrTZpMDOWBB6tLlWj';

// Store temporário (em produção, use Redis ou banco de dados)
const ordersStore = new Map();

function getUmbrelaHeaders() {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hostname = body?.hostname || 'localhost';
    const separa = hostname.split('.')[0].toUpperCase();

    const Payload = {
      amount: body.amount,
      offer_hash: separa,
      payment_method: 'pix',
      customer: {
        name: body.nome,
        email: body.email,
        phone_number: body.phone,
        document: body.cpf,
        street_name: body.address?.street || 'Nome da Rua',
        number: body.address?.number || 'sn',
        complement: body.address?.complement || '',
        neighborhood: body.address?.neighborhood || 'Centro',
        city: body.address?.city || 'Cidade',
        state: body.address?.state || 'Estado',
        zip_code: body.address?.cep?.replace(/\D/g, '') || '00000000',
      },
      cart: [{
        product_hash: separa,
        title: body.productTitle || 'Delivara',
        cover: null,
        price: body.amount, // Preço total em centavos
        quantity: body.quantity || 1,
        operation_type: 1,
        tangible: false,
      }],
      installments: 12,
      expire_in_days: 1,
      postback_url: 'https://enf8p6q9i44zv.x.pipedream.net/',
    };

    const { data } = await axios.post(
      `https://api.nitropagamentos.com/api/public/v1/transactions?api_token=${KEY_NITRO}`,
      Payload,
      {
        headers: getUmbrelaHeaders(),
        timeout: 20000,
      }
    );

    const qrCode = data.pix.pix_qr_code;
    const txId = data.id;
    const qrCodeBase64 = await QRCode.toDataURL(qrCode, { errorCorrectionLevel: 'H' });

    // Salvar dados do pedido incluindo UTMs
    ordersStore.set(String(txId), {
      hostname,
      productName: body.productTitle || 'Delivara',
      totalAmount: body.amount,
      quantity: body.quantity || 1,
      customer: {
        name: body.nome || null,
        email: body.email || null,
        phone: body.phone || null,
        document: body.cpf || null,
      },
      utmParams: body.utmParams || {}, // Salvar UTMs capturados
      createdAt: new Date().toISOString(),
    });

    // Log dos UTMs recebidos
    if (body.utmParams && Object.keys(body.utmParams).length > 0) {
      console.log('📊 UTMs recebidos no pedido:', body.utmParams);
    }

    return NextResponse.json({
      success: true,
      transactionId: data.hash,
      pixData: {
        code: qrCode,
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
