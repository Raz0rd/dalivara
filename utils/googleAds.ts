import { GOOGLE_ADS_CONFIG, getConversionSendTo } from '@/config/googleAds';

// Função para disparar conversão do Google Ads
export function reportConversion(
  value: number,
  transactionId: string
) {
  // Verificar se tracking está habilitado
  if (!GOOGLE_ADS_CONFIG.enabled) {
    console.log('Google Ads tracking disabled');
    return;
  }

  // Verificar se gtag está disponível
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'conversion', {
      'send_to': getConversionSendTo(),
      'value': value,
      'currency': 'BRL',
      'transaction_id': transactionId,
    });
    
    console.log('✅ Google Ads Conversion tracked:', {
      value: `R$ ${value.toFixed(2)}`,
      transactionId,
      send_to: getConversionSendTo()
    });
  } else {
    console.warn('⚠️ Google Ads gtag not available');
  }
}
