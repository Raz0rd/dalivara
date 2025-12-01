import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nacional-acai.click'
  
  // URLs estáticas principais
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/carrinho`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ifoodpay`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/checkout/endereco`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pedidos`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ]

  // IDs dos produtos (baseado na estrutura do código)
  const productIds = [
    // Destaques
    'destaque-1',
    'destaque-2',
    'destaque-3',
    'destaque-4',
    'destaque-5',
    'destaque-6',
    'destaque-7',
    'destaque-8',
    
    // Combos (Marmitas)
    'combo-marmita-gourmet-p',
    'combo-marmita-600g',
    'combo-marmita-350g',
    'combo-marmita-p',
    'combo-marmita-p2',
    
    // Delícias
    'delicias-1',
    'delicias-2',
    'delicias-3',
    'delicias-4',
    'delicias-5',
    'delicias-6',
    'delicias-7',
    'delicias-8',
    
    // Milkshakes
    'milkshake-1',
    'milkshake-2',
    'milkshake-3',
    'milkshake-4',
    'milkshake-5',
    'milkshake-6',
    'milkshake-7',
    'milkshake-8',
    
    // Bebidas
    'bebidas-1',
    'bebidas-2',
    'bebidas-3',
    'bebidas-4',
    'bebidas-5',
    'bebidas-6',
    'bebidas-7',
    'bebidas-8',
  ]

  // Gerar URLs de produtos
  const productRoutes = productIds.map((id) => ({
    url: `${baseUrl}/product/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...productRoutes]
}
