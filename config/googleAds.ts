// Configuração do Google Ads
export const GOOGLE_ADS_CONFIG = {
  // ID da conta do Google Ads (formato: AW-XXXXXXXXXX)
  accountId: 'AW-XXXXXX',
  
  // Label de conversão para compras (formato: XXXXXXXXX/YYYYYYYYYY)
  conversionLabel: 'CONVERSIONLABEL',
  
  // Ativar/desativar tracking (útil para desenvolvimento)
  enabled: false, // Desabilitado - usando apenas a nova conta
  
  // Nova conta Google Ads para conversões
  newAccountId: 'AW-17707310232',
  newConversionLabel: 'mmHKCLi41robEJi5wPtB',
};

// Função helper para obter o send_to completo
export function getConversionSendTo(): string {
  return `${GOOGLE_ADS_CONFIG.accountId}/${GOOGLE_ADS_CONFIG.conversionLabel}`;
}

// Função para reportar conversão (nova conta)
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
    'send_to': `${GOOGLE_ADS_CONFIG.newAccountId}/${GOOGLE_ADS_CONFIG.newConversionLabel}`,
    'value': value,
    'currency': 'BRL',
    'transaction_id': transactionId,
    'event_callback': callback
  });

  return false;
}
