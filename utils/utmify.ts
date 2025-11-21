// Utilitário para capturar UTMs e enviar conversões ao Utmify

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
 * Envia conversão para o Google Ads
 * Usado como fallback quando não há UTMs capturados
 */
export function sendGoogleAdsConversion(
  transactionId: string,
  value: number,
  currency: string = 'BRL'
): void {
  if (typeof window === 'undefined' || typeof (window as any).gtag !== 'function') {
    console.warn('⚠️ [Google Ads] gtag não disponível');
    return;
  }

  try {
    console.log('📊 [Google Ads] Enviando conversão...');
    console.log('🆔 Transaction ID:', transactionId);
    console.log('💰 Valor:', value);
    console.log('💵 Moeda:', currency);

    (window as any).gtag('event', 'conversion', {
      'send_to': 'AW-17719649597/l1AvCJCdmr4bEL3KsYFC',
      'value': value,
      'currency': currency,
      'transaction_id': transactionId
    });

    console.log('✅ [Google Ads] Conversão enviada com sucesso');
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

    // Verificar se existe a função global do Utmify
    let conversionSuccess = false;
    
    if ((window as any).utmify && typeof (window as any).utmify === 'function') {
      // Enviar evento 'paid' com todos os dados
      (window as any).utmify('paid', payload);
      console.log('✅ Conversão PAID enviada ao Utmify via API global');
      conversionSuccess = true;
    } else {
      console.warn('⚠️ API global do Utmify não encontrada');
      console.log('💡 Verifique se o script do Utmify foi carregado corretamente');
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
          success: conversionSuccess,
          timestamp: payload.timestamp
        })
      });
    } catch (logError) {
      console.warn('⚠️ Erro ao enviar log ao backend:', logError);
    }

    return { success: conversionSuccess, utmParams, payload };
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
