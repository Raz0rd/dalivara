export interface TenantConfigInput {
  domain: string;
  storeName: string;
  logo: string;
  googleAdsConversionId: string;
  googleAdsConversionLabel: string;
  
  // Opcionais com defaults
  tag?: string;
  template?: 'modelo2';
  primaryColor?: string;
  whatsappNumber?: string;
  deliveryFee?: number;
  minOrderValue?: number;
  googleAdsId?: string;
  googleAdsId1?: string;
  googleAdsId2?: string;
  utmifyPixelId?: string;
  ifoodMerchantId?: string;
  ifoodClientId?: string;
  siteDescription?: string;
  ogImage?: string;
  googleVerification?: string;
}

export interface TenantConfig extends Required<Omit<TenantConfigInput, 'tag' | 'template' | 'primaryColor' | 'deliveryFee' | 'minOrderValue' | 'siteDescription' | 'ogImage' | 'whatsappNumber' | 'googleAdsId' | 'googleAdsId1' | 'googleAdsId2' | 'utmifyPixelId' | 'ifoodMerchantId' | 'ifoodClientId' | 'googleVerification'>> {
  tag: string;
  template: 'modelo1' | 'modelo2';
  primaryColor: string;
  deliveryFee: number;
  minOrderValue: number;
  siteDescription: string;
  ogImage: string;
  siteUrl: string;
  whatsappNumber?: string;
  googleAdsId?: string;
  googleAdsId1?: string;
  googleAdsId2?: string;
  utmifyPixelId?: string;
  ifoodMerchantId?: string;
  ifoodClientId?: string;
  googleVerification?: string;
}

// Defaults
const DEFAULT_TEMPLATE = 'modelo2' as const;
const DEFAULT_PRIMARY_COLOR = '#5b0e5c';
const DEFAULT_DELIVERY_FEE = 5.00;
const DEFAULT_MIN_ORDER = 10.00;
const DEFAULT_DESCRIPTION = 'Faça seu pedido de açaí online agora mesmo! Açaí de qualidade, entrega rápida e grátis. Combos e delícias. Peça já!';
const DEFAULT_OG_IMAGE = '/og-image.jpg';

function buildTenant(config: TenantConfigInput): TenantConfig {
  const domain = config.domain;
  const isLocalhost = domain.includes('localhost');
  const protocol = isLocalhost ? 'http://' : 'https://';
  
  return {
    domain: config.domain,
    tag: config.tag || config.domain.split('.')[0].replace(/[^a-z0-9]/gi, ''),
    storeName: config.storeName,
    logo: config.logo,
    template: config.template || DEFAULT_TEMPLATE,
    primaryColor: config.primaryColor || DEFAULT_PRIMARY_COLOR,
    whatsappNumber: config.whatsappNumber,
    deliveryFee: config.deliveryFee ?? DEFAULT_DELIVERY_FEE,
    minOrderValue: config.minOrderValue ?? DEFAULT_MIN_ORDER,
    googleAdsId: config.googleAdsId,
    googleAdsId1: config.googleAdsId1,
    googleAdsId2: config.googleAdsId2,
    googleAdsConversionId: config.googleAdsConversionId,
    googleAdsConversionLabel: config.googleAdsConversionLabel,
    utmifyPixelId: config.utmifyPixelId,
    ifoodMerchantId: config.ifoodMerchantId,
    ifoodClientId: config.ifoodClientId,
    siteDescription: config.siteDescription || DEFAULT_DESCRIPTION,
    ogImage: config.ogImage || DEFAULT_OG_IMAGE,
    googleVerification: config.googleVerification,
    siteUrl: `${protocol}${domain}`
  };
}

const tenantsInput: Record<string, TenantConfigInput> = {
  'acaiautenticodosabor.online': {
    domain: 'acaiautenticodosabor.online',
    storeName: 'Açaí Autêntico do Sabor',
    logo: '/images/modelo2/logorush.png',
    googleAdsConversionId: 'AW-17827600901',
    googleAdsConversionLabel: 'nxhSCMDZr9YbEIW07rRC',
    whatsappNumber: '5534999999999',
    googleAdsId: 'AW-17827600901',
  },
  'localhost:3000': {
    domain: 'localhost:3000',
    storeName: 'Nacional Açaí',
    logo: '/nacional.png',
    googleAdsConversionId: 'AW-17827600901',
    googleAdsConversionLabel: 'nxhSCMDZr9YbEIW07rRC',
    template: 'modelo2',
    whatsappNumber: '5511999999999',
  }
};

export const tenants: Record<string, TenantConfig> = Object.fromEntries(
  Object.entries(tenantsInput).map(([key, config]) => [key, buildTenant(config)])
);

export function getTenantByDomain(domain: string): TenantConfig | null {
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');
  return tenants[normalizedDomain] || null;
}

export function getTenantByTag(tag: string): TenantConfig | null {
  const tenant = Object.values(tenants).find(t => t.tag === tag);
  return tenant || null;
}

export function getDefaultTenant(): TenantConfig {
  return Object.values(tenants)[0];
}
