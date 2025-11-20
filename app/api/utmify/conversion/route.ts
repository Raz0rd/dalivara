import { NextRequest, NextResponse } from 'next/server';

// Função para obter timestamp em UTC ISO 8601
function getUTCTimestamp(): string {
  return new Date().toISOString();
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    const utcTimestamp = getUTCTimestamp();
    console.log(`\n[UTC Timestamp] ${utcTimestamp}`);
    console.log("📊 [UTMify API] Status:", orderData.status);
    console.log("💰 [UTMify API] Valor:", orderData.amount);
    
    // VALIDAÇÃO: Garantir que temos valor obrigatório
    let amountInCents = 0;
    
    if (orderData.amount) {
      // Se amount > 1000, assumir que já está em centavos
      // Se amount <= 1000, assumir que está em reais e converter
      amountInCents = orderData.amount > 1000 ? orderData.amount : Math.round(orderData.amount * 100);
    } else if (orderData.products?.[0]?.priceInCents) {
      amountInCents = orderData.products[0].priceInCents;
    }
    
    if (!amountInCents || amountInCents <= 0) {
      throw new Error("Amount é obrigatório e deve ser maior que 0");
    }
    
    console.log("💰 [UTMify API] Amount original:", orderData.amount);
    console.log("💰 [UTMify API] Amount em centavos:", amountInCents);
    
    // VALIDAÇÃO: Garantir que temos parâmetros UTM
    if (!orderData.trackingParameters || Object.keys(orderData.trackingParameters).length === 0) {
      console.warn("⚠️ [UTMify API] ATENÇÃO: Nenhum parâmetro UTM encontrado!");
      console.warn("⚠️ [UTMify API] Isso pode afetar o tracking. Verifique se os UTMs estão sendo capturados.");
    }

    // Normalizar UTMs (utm_campaigndid -> utm_campaign)
    const trackingParams = orderData.trackingParameters || {};
    const normalizedParams: Record<string, any> = { ...trackingParams };
    
    // Se tiver utm_campaigndid mas não tiver utm_campaign, usar o campaigndid
    if (normalizedParams.utm_campaigndid && !normalizedParams.utm_campaign) {
      normalizedParams.utm_campaign = normalizedParams.utm_campaigndid;
      console.log('📝 [Utmify] Usando utm_campaigndid como utm_campaign:', normalizedParams.utm_campaigndid);
    }
    
    console.log('📊 [Utmify] Parâmetros normalizados:', normalizedParams);

    // Preparar dados para UTMify no formato correto da documentação
    const utmifyPayload = {
      orderId: orderData.orderId,
      platform: "Nacional Açaí", // Nome da plataforma
      paymentMethod: "pix",
      status: orderData.status === "pending" ? "waiting_payment" : "paid",
      createdAt: utcTimestamp,
      approvedDate: orderData.status === "paid" ? utcTimestamp : null,
      refundedAt: null,
      customer: {
        name: orderData.customerData?.name || "",
        email: orderData.customerData?.email || "",
        phone: orderData.customerData?.phone || "",
        document: orderData.customerData?.document || "",
        country: "BR",
        ip: "unknown"
      },
      products: [
        {
          id: "acai-delivery",
          name: orderData.productName || "Açaí Delivery",
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents: amountInCents
        }
      ],
      trackingParameters: {
        src: normalizedParams.src || null,
        sck: normalizedParams.sck || null,
        utm_source: normalizedParams.utm_source || null,
        utm_campaign: normalizedParams.utm_campaign || null, // Já normalizado de utm_campaigndid
        utm_medium: normalizedParams.utm_medium || null,
        utm_content: normalizedParams.utm_content || null,
        utm_term: normalizedParams.utm_term || null,
        gclid: normalizedParams.gclid || null,
        fbclid: normalizedParams.fbclid || null,
        msclkid: normalizedParams.msclkid || null,
        xcod: normalizedParams.xcod || null,
        keyword: normalizedParams.keyword || null,
        device: normalizedParams.device || null,
        network: normalizedParams.network || null,
        gad_source: normalizedParams.gad_source || null,
        gbraid: normalizedParams.gbraid || null
      },
      commission: {
        totalPriceInCents: amountInCents,
        gatewayFeeInCents: amountInCents,
        userCommissionInCents: amountInCents
      },
      isTest: false
    };

    console.log("🎯 [UTMify API] Enviando dados para UTMify...");
    console.log("📊 [UTMify API] Status:", utmifyPayload.status);
    console.log("💰 [UTMify API] Valor em centavos:", utmifyPayload.commission.totalPriceInCents);

    // Token hardcoded
    const UTMIFY_API_TOKEN = 'LWfOv5LaL6ey76RTcCNCfgiKN1A2nDIwf57T';
    
    // URL da whitepage (usar o domínio do site)
    const whitepageUrl = 'https://nacionalacai.com.br';
    
    // Preparar headers com Referer da whitepage
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-api-token": UTMIFY_API_TOKEN,
      "Referer": whitepageUrl
    };
    
    console.log("🔗 [UTMify API] Usando Referer:", whitepageUrl);

    // Enviar para UTMify
    const utmifyResponse = await fetch("https://api.utmify.com.br/api-credentials/orders", {
      method: "POST",
      headers,
      body: JSON.stringify(utmifyPayload),
    });

    const data = await utmifyResponse.json();
    
    if (utmifyResponse.ok) {
      console.log("✅ [UTMify API] Dados enviados com sucesso");
      console.log("📦 [UTMify API] Resposta:", data);
    } else {
      console.error("❌ [UTMify API] Erro ao enviar dados:", utmifyResponse.status);
      console.error("📦 [UTMify API] Resposta de erro:", data);
    }

    return NextResponse.json({
      success: utmifyResponse.ok,
      message: utmifyResponse.ok ? "Dados enviados para UTMify" : "Erro ao enviar para UTMify",
      data: data
    });
  } catch (error) {
    console.error("💥 [UTMify API] EXCEPTION:", error);
    console.error("🔍 [UTMify API] Error details:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      success: false,
      error: "Erro ao enviar dados para UTMify",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
