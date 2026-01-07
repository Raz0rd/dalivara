# Sistema Multitenant - Dalivara

Sistema multitenant baseado em domínio que permite múltiplas lojas usando a mesma base de código, sem necessidade de rebuild ou restart do PM2.

## 🎯 Como Funciona

O sistema detecta automaticamente o domínio da requisição e carrega as configurações específicas do tenant (loja) correspondente. Tudo é renderizado no backend (SSR), então as mudanças são instantâneas.

## 📁 Arquivos Principais

### 1. `config/tenants.ts`
Arquivo central com todas as configurações dos tenants. **É aqui que você adiciona novas lojas!**

```typescript
export const tenants: Record<string, TenantConfig> = {
  'acaiautenticodosabor.online': {
    domain: 'acaiautenticodosabor.online',
    tag: 'acaiautenticodosabor',
    storeName: 'Açaí Autêntico do Sabor',
    logo: '/images/modelo2/logorush.png',
    template: 'modelo2',
    primaryColor: '#5b0e5c',
    whatsappNumber: '5534999999999',
    deliveryFee: 5.00,
    minOrderValue: 10.00,
    googleAdsId: 'AW-XXXXXXXXXX',
    siteDescription: 'Faça seu pedido de açaí online...',
    ogImage: '/og-image.jpg',
    siteUrl: 'https://acaiautenticodosabor.online'
  },
  // Adicione mais tenants aqui...
};
```

### 2. `lib/tenant.ts`
Funções helper para obter o tenant atual no servidor.

### 3. `contexts/TenantContext.tsx`
Context React para acessar configurações do tenant nos componentes client-side.

### 4. `middleware.ts`
Middleware Next.js que captura o domínio da requisição.

## 🚀 Como Adicionar uma Nova Loja

### Passo 1: Adicionar configuração em `config/tenants.ts`

```typescript
export const tenants: Record<string, TenantConfig> = {
  // ... tenants existentes ...
  
  'minhaloja.com.br': {
    domain: 'minhaloja.com.br',
    tag: 'minhaloja',
    storeName: 'Minha Loja de Açaí',
    logo: '/logos/minhaloja.png',
    template: 'modelo1', // ou 'modelo2'
    primaryColor: '#ff0000',
    whatsappNumber: '5511999999999',
    deliveryFee: 5.00,
    minOrderValue: 15.00,
    googleAdsId: 'AW-123456789',
    googleAdsId1: 'AW-987654321', // opcional
    utmifyPixelId: 'seu-pixel-id', // opcional
    siteDescription: 'Descrição da loja...',
    ogImage: '/og-image.jpg',
    siteUrl: 'https://minhaloja.com.br'
  }
};
```

### Passo 2: Adicionar logo da loja

Coloque o arquivo de logo em `public/logos/minhaloja.png` (ou o caminho que você definiu).

### Passo 3: Configurar DNS

Aponte o domínio `minhaloja.com.br` para o servidor onde o dalivara está rodando.

### Passo 4: Testar

Acesse `https://minhaloja.com.br` - o sistema vai automaticamente carregar as configurações corretas!

## 💻 Como Usar nos Componentes

### Server Components (Recomendado)

```typescript
import { getCurrentTenant } from '@/lib/tenant';

export default async function MeuComponente() {
  const tenant = await getCurrentTenant();
  
  return (
    <div>
      <h1>{tenant.storeName}</h1>
      <img src={tenant.logo} alt={tenant.storeName} />
      <p style={{ color: tenant.primaryColor }}>
        Entrega: R$ {tenant.deliveryFee.toFixed(2)}
      </p>
    </div>
  );
}
```

### Client Components

```typescript
'use client';

import { useTenant } from '@/contexts/TenantContext';

export default function MeuComponenteClient() {
  const tenant = useTenant();
  
  return (
    <div>
      <h1>{tenant.storeName}</h1>
      <img src={tenant.logo} alt={tenant.storeName} />
      <a href={`https://wa.me/${tenant.whatsappNumber}`}>
        WhatsApp
      </a>
    </div>
  );
}
```

## 🔧 Configurações Disponíveis

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `domain` | string | Domínio da loja (ex: 'minhaloja.com.br') |
| `tag` | string | Identificador único da loja |
| `storeName` | string | Nome da loja |
| `logo` | string | Caminho do logo |
| `template` | 'modelo1' \| 'modelo2' | Template visual |
| `primaryColor` | string | Cor primária (hex) |
| `whatsappNumber` | string | Número WhatsApp com DDI |
| `deliveryFee` | number | Taxa de entrega |
| `minOrderValue` | number | Valor mínimo do pedido |
| `googleAdsId` | string | ID do Google Ads principal |
| `googleAdsId1` | string | ID adicional do Google Ads |
| `googleAdsId2` | string | ID adicional do Google Ads |
| `utmifyPixelId` | string | ID do pixel Utmify |
| `ifoodMerchantId` | string | ID do merchant iFood |
| `ifoodClientId` | string | ID do cliente iFood |
| `siteDescription` | string | Descrição para SEO |
| `ogImage` | string | Imagem Open Graph |
| `googleVerification` | string | Código verificação Google |
| `siteUrl` | string | URL completa do site |

## ✅ Vantagens

- ✨ **Sem rebuild**: Adicione lojas editando apenas `config/tenants.ts`
- 🚀 **Sem restart**: Mudanças são aplicadas instantaneamente
- 🎨 **Personalização total**: Cada loja tem suas próprias cores, logo, etc
- 📊 **Tracking separado**: Google Ads e pixels diferentes por loja
- 🔒 **Isolamento**: Cada domínio carrega apenas suas configurações

## 🧪 Testando Localmente

Para testar múltiplos domínios localmente, edite seu arquivo `hosts`:

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
**Linux/Mac**: `/etc/hosts`

Adicione:
```
127.0.0.1 minhaloja.local
127.0.0.1 outraloja.local
```

Depois adicione essas configurações em `config/tenants.ts`:

```typescript
'minhaloja.local:3000': {
  domain: 'minhaloja.local:3000',
  tag: 'minhaloja-local',
  // ... resto das configs
}
```

Acesse `http://minhaloja.local:3000` no navegador.

## 📝 Notas Importantes

1. **Domínio com www**: O sistema remove automaticamente o `www.` do domínio
2. **Porta no domínio**: Para localhost, inclua a porta (ex: `localhost:3000`)
3. **Tenant padrão**: Se o domínio não for encontrado, usa o primeiro tenant da lista
4. **Case insensitive**: Domínios são normalizados para lowercase

## 🐛 Troubleshooting

### Tenant não encontrado
- Verifique se o domínio em `config/tenants.ts` está exatamente igual ao domínio acessado
- Lembre-se de incluir a porta se estiver testando localmente

### Logo não aparece
- Verifique se o arquivo existe em `public/` no caminho especificado
- Caminhos devem começar com `/` (ex: `/logos/logo.png`)

### Mudanças não aparecem
- Como é SSR, mudanças em `config/tenants.ts` são aplicadas na próxima requisição
- Limpe o cache do navegador se necessário (Ctrl+Shift+R)
