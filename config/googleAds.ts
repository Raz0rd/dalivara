// Configuração do Google Ads
// Substitua os valores abaixo pelos seus IDs reais

export const GOOGLE_ADS_CONFIG = {
  // ID da conta do Google Ads (formato: AW-XXXXXXXXXX)
  accountId: 'AW-XXXXXX',
  
  // Label de conversão para compras (formato: XXXXXXXXX/YYYYYYYYYY)
  conversionLabel: 'CONVERSIONLABEL',
  
  // Ativar/desativar tracking (útil para desenvolvimento)
  enabled: true,
};

// Função helper para obter o send_to completo
export function getConversionSendTo(): string {
  return `${GOOGLE_ADS_CONFIG.accountId}/${GOOGLE_ADS_CONFIG.conversionLabel}`;
}
