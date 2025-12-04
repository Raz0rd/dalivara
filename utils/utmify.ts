// Utilitário para capturar UTMs e enviar conversões ao Utmify

/**
 * Hash SHA-256 para dados do usuário (Google Ads Enhanced Conversions)
 * @param value - Valor a ser hasheado
 * @returns Promise com o hash em hexadecimal
 */
async function sha256Hash(value: string): Promise<string> {
  if (!value) return '';
  
  // Normalizar: remover espaços, converter para minúsculas
  const normalized = value.trim().toLowerCase();
  
  // Usar Web Crypto API (disponível no browser)
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Captura todos os parâmetros UTM disponíveis
 * O script do Utmify armazena os UTMs em cookies/localStorage
 */
export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const utmParams: Record<string, string> = {};

  // Lista completa de parâmetros UTM e Google Ads
  const utmKeys = [
    'utm_source',
    'gad_source',
    'utm_medium',
    'utm_campaign',
    'utm_campaigndid', // Google Ads campaign ID
    'utm_term',
    'utm_content',
    'utm_id',
    'utm_source_platform',
    'gad_campaignid',
    'utm_creative_format',
    'utm_marketing_tactic',
    'gclid', // Google Click ID
    'fbclid', // Facebook Click ID
    'msclkid', // Microsoft Click ID
  ];

  // 1. Tentar pegar da URL atual
  const urlParams = new URLSearchParams(window.location.search);
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  // 2. Tentar pegar do localStorage (onde o Utmify armazena)
  try {
    const utmifyData = localStorage.getItem('utmify_data');
    if (utmifyData) {
      const parsed = JSON.parse(utmifyData);
      utmKeys.forEach(key => {
        if (parsed[key] && !utmParams[key]) {
          utmParams[key] = parsed[key];
        }
      });
    }
  } catch (e) {
    console.warn('Erro ao ler utmify_data do localStorage:', e);
  }

  // 3. Tentar pegar dos cookies
  try {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (utmKeys.includes(name)) {
        if (!utmParams[name]) {
          utmParams[name] = decodeURIComponent(value);
        }
      }
    });
  } catch (e) {
    console.warn('Erro ao ler cookies:', e);
  }

  // 4. Tentar pegar do sessionStorage
  try {
    utmKeys.forEach(key => {
      const value = sessionStorage.getItem(key);
      if (value && !utmParams[key]) {
        utmParams[key] = value;
      }
    });
  } catch (e) {
    console.warn('Erro ao ler sessionStorage:', e);
  }

  // 5. Tentar pegar dos UTMs salvos anteriormente
  try {
    const savedUtms = localStorage.getItem('saved_utms');
    if (savedUtms) {
      const parsed = JSON.parse(savedUtms);
      utmKeys.forEach(key => {
        if (parsed[key] && !utmParams[key]) {
          utmParams[key] = parsed[key];
        }
      });
    }
  } catch (e) {
    console.warn('Erro ao ler saved_utms:', e);
  }

  // Log detalhado dos UTMs capturados
  const capturedCount = Object.keys(utmParams).length;
  if (capturedCount > 0) {
    console.log(`✅ ${capturedCount} parâmetros UTM capturados:`, utmParams);
  } else {
    console.warn('⚠️ Nenhum parâmetro UTM encontrado');
  }

  return utmParams;
}

/**
 * Normaliza UTMs para enviar ao Utmify
 * Converte utm_campaigndid para utm_campaign se necessário
 */
export function normalizeUtmsForUtmify(utmParams: Record<string, string>): Record<string, string> {
  const normalized = { ...utmParams };
  
  // Se tiver utm_campaigndid mas não tiver utm_campaign, usar o campaigndid
  if (normalized.utm_campaigndid && !normalized.utm_campaign) {
    normalized.utm_campaign = normalized.utm_campaigndid;
    console.log('📝 [Utmify] Usando utm_campaigndid como utm_campaign:', normalized.utm_campaigndid);
  }
  
  // Remover utm_campaigndid do payload do Utmify (ele espera utm_campaign)
  delete normalized.utm_campaigndid;
  
  return normalized;
}

/**
 * Envia conversão para o Google Ads com dados do usuário hasheados (Enhanced Conversions)
 * @param transactionId - ID único da transação
 * @param value - Valor da conversão
 * @param currency - Moeda (padrão: BRL)
 * @param email - Email do cliente (opcional)
 * @param phone - Telefone do cliente (opcional)
 * @param totalValue - Valor total da venda (se fornecido, usa este ao invés de value)
 */
export async function sendGoogleAdsConversion(
  transactionId: string,
  value: number,
  currency: string = 'BRL',
  email?: string,
  phone?: string,
  totalValue?: number
): Promise<void> {
  if (typeof window === 'undefined' || typeof (window as any).gtag !== 'function') {
    console.warn('⚠️ [Google Ads] gtag não disponível');
    return;
  }

  try {
    console.log('📊 [Google Ads] Enviando conversão...');
    console.log('🆔 Transaction ID:', transactionId);
    console.log('💰 Valor:', value);
    console.log('💵 Moeda:', currency);
    console.log('📧 Email:', email ? 'fornecido' : 'não fornecido');
    console.log('📱 Telefone:', phone ? 'fornecido' : 'não fornecido');

    // Usar o valor total da venda (não calcular porcentagem)
    const conversionValue = totalValue || value;
    console.log('💵 Valor de conversão:', conversionValue);

    // Preparar user_data hasheado para Enhanced Conversions
    const userData: any = {};
    
    if (email) {
      // Hashear email (normalizado: minúsculas, sem espaços)
      userData.email = await sha256Hash(email);
      console.log('📧 Email hasheado:', userData.email.substring(0, 10) + '...');
    }
    
    if (phone) {
      // Normalizar telefone: remover tudo exceto números, adicionar código do país
      let cleanPhone = phone.replace(/\D/g, '');
      
      // Se não começar com código do país, adicionar +55 (Brasil)
      if (!cleanPhone.startsWith('55') && cleanPhone.length <= 11) {
        cleanPhone = '55' + cleanPhone;
      }
      
      // Hashear telefone no formato E.164
      userData.phone_number = await sha256Hash('+' + cleanPhone);
      console.log('📱 Telefone hasheado:', userData.phone_number.substring(0, 10) + '...');
    }

    // Enviar user_data via 'set' antes da conversão (Enhanced Conversions)
    if (Object.keys(userData).length > 0) {
      (window as any).gtag('set', 'user_data', userData);
      console.log('👤 [Google Ads] Enhanced Conversions: user_data enviado via set');
      console.log('📦 User data:', {
        has_email: !!userData.email,
        has_phone: !!userData.phone_number
      });
    }

    // Enviar evento de conversão
    const conversionData: any = {
      'send_to': 'AW-17675710408/xbFICNyQo8obEMjft-xB',
      'value': conversionValue,
      'currency': currency,
      'transaction_id': transactionId
    };

    (window as any).gtag('event', 'conversion', conversionData);

    console.log('✅ [Google Ads] Conversão enviada com sucesso');
    console.log('📦 Dados enviados:', {
      send_to: conversionData.send_to,
      value: conversionData.value,
      currency: conversionData.currency,
      transaction_id: conversionData.transaction_id,
      has_user_data: !!conversionData.user_data
    });
  } catch (error) {
    console.error('❌ [Google Ads] Erro ao enviar conversão:', error);
  }
}

/**
 * Envia conversão 'paid' para o Utmify com todos os UTMs
 * @param transactionId - ID único da transação
 * @param value - Valor da conversão em reais
 * @param email - Email do cliente (opcional)
 * @param phone - Telefone do cliente (opcional)
 */
export async function sendUtmifyConversion(
  transactionId: string,
  value: number,
  email?: string,
  phone?: string
) {
  // Garantir execução apenas no client-side
  if (typeof window === 'undefined') {
    console.warn('⚠️ sendUtmifyConversion chamado no servidor, ignorando');
    return null;
  }

  try {
    // Capturar todos os UTMs disponíveis
    const utmParams = getUtmParams();

    console.log('📊 UTMs capturados para conversão:', utmParams);

    // Preparar payload completo para o Utmify
    // Incluir todos os UTMs mesmo que alguns estejam vazios
    const payload: Record<string, any> = {
      event: 'paid', // Evento de conversão paga
      transaction_id: transactionId,
      value: value,
      currency: 'BRL',
      timestamp: new Date().toISOString(),
    };

    // Adicionar email e phone se disponíveis
    if (email) payload.email = email;
    if (phone) payload.phone = phone;

    // Adicionar todos os UTMs ao payload
    Object.keys(utmParams).forEach(key => {
      if (utmParams[key]) {
        payload[key] = utmParams[key];
      }
    });

    console.log('📤 Enviando conversão PAID ao Utmify:', payload);
    console.log('📋 Total de UTMs enviados:', Object.keys(utmParams).length);

    // Nota: A conversão é enviada via API do backend (/api/utmify/conversion)
    // O script do Utmify no frontend é apenas para tracking adicional
    
    // Tentar enviar via API global do Utmify (opcional)
    if ((window as any).utmify && typeof (window as any).utmify === 'function') {
      try {
        (window as any).utmify('paid', payload);
        console.log('✅ Conversão PAID enviada ao Utmify via API global (tracking adicional)');
      } catch (err) {
        console.warn('⚠️ Erro ao enviar via API global do Utmify:', err);
      }
    }

    // Enviar log ao backend para depuração
    try {
      await fetch('/api/utmify/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'paid',
          transaction_id: transactionId,
          value: value,
          currency: 'BRL',
          email: email,
          phone: phone,
          utmParams: utmParams,
          success: true, // Sempre true pois a conversão é enviada via backend
          timestamp: payload.timestamp
        })
      });
    } catch (logError) {
      console.warn('⚠️ Erro ao enviar log ao backend:', logError);
    }

    return { success: true, utmParams, payload };
  } catch (error) {
    console.error('❌ Erro ao enviar conversão ao Utmify:', error);
    
    // Tentar enviar log de erro ao backend
    try {
      await fetch('/api/utmify/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'paid',
          transaction_id: transactionId,
          value: value,
          success: false,
          error: String(error),
          timestamp: new Date().toISOString()
        })
      });
    } catch (logError) {
      // Ignorar erro de log
    }
    
    return { success: false, error };
  }
}

/**
 * Salva os UTMs no localStorage para uso posterior
 */
export function saveUtmsToStorage() {
  if (typeof window === 'undefined') return;

  const utmParams = getUtmParams();
  
  if (Object.keys(utmParams).length > 0) {
    try {
      localStorage.setItem('saved_utms', JSON.stringify(utmParams));
      console.log('✅ UTMs salvos no localStorage:', utmParams);
    } catch (e) {
      console.warn('Erro ao salvar UTMs:', e);
    }
  }
}

/**
 * Recupera os UTMs salvos do localStorage
 */
export function getSavedUtms(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  try {
    const saved = localStorage.getItem('saved_utms');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Erro ao recuperar UTMs salvos:', e);
  }

  return {};
}
