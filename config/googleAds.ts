// Configuração do Google Ads
export const GOOGLE_ADS_CONFIG = {
  // ID da conta do Google Ads (formato: AW-XXXXXXXXXX)
  accountId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ACCOUNT_ID || 'AW-17719649597',
  
  // Label de conversão para compras (formato: l1AvCJCdmr4bEL3KsYFC)
  conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || 'l1AvCJCdmr4bEL3KsYFC',
  
  // Ativar/desativar tracking
  enabled: true,
};

// Função helper para obter o send_to completo
export function getConversionSendTo(): string {
  return `${GOOGLE_ADS_CONFIG.accountId}/${GOOGLE_ADS_CONFIG.conversionLabel}`;
}

// Função para reportar conversão
export function gtag_report_conversion(value: number, transactionId: string, url?: string): boolean {
  if (typeof window === 'undefined' || !(window as any).gtag) {
    console.warn('Google Ads gtag não está carregado');
    return false;
  }

  const callback = function () {
    if (typeof url !== 'undefined') {
      window.location.href = url;
    }
  };

  (window as any).gtag('event', 'conversion', {
    'send_to': `${GOOGLE_ADS_CONFIG.accountId}/${GOOGLE_ADS_CONFIG.conversionLabel}`,
    'value': value,
    'currency': 'BRL',
    'transaction_id': transactionId,
    'event_callback': callback
  });

  return false;
}
