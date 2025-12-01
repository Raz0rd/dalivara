# 🗺️ Sitemap e SEO - Nacional Açaí

## ✅ Arquivos Criados

### 1. **Sitemap Dinâmico** (`app/sitemap.ts`)
- Gera automaticamente o sitemap XML
- Inclui todas as páginas principais
- Inclui todos os produtos (80+ URLs)
- Configurado com prioridades e frequências de atualização

### 2. **Robots.txt** (`app/robots.ts`)
- Permite indexação do Google
- Bloqueia rotas de API
- Referencia o sitemap

### 3. **Metadados SEO** (`app/layout.tsx`)
- Meta tags otimizadas
- Open Graph para redes sociais
- Twitter Cards
- Keywords relevantes
- Verificação do Google Search Console

### 4. **Dados Estruturados** (`components/StructuredData.tsx`)
- Schema.org JSON-LD
- FoodEstablishment
- BreadcrumbList
- Organization
- Menu structure

## 🔍 Como Verificar

### 1. Acessar o Sitemap
Após o deploy, acesse:
```
https://www.nacionalacai.com/sitemap.xml
```

### 2. Acessar o Robots.txt
```
https://www.nacionalacai.com/robots.txt
```

### 3. Testar Dados Estruturados
Use o Google Rich Results Test:
```
https://search.google.com/test/rich-results
```

## 📊 Submeter ao Google

### Google Search Console
1. Acesse: https://search.google.com/search-console
2. Adicione a propriedade: `https://www.nacionalacai.com`
3. Verifique a propriedade usando a meta tag no `layout.tsx`
4. Vá em **Sitemaps** → Adicionar sitemap
5. Digite: `sitemap.xml`
6. Clique em **Enviar**

### Google Ads
1. O sitemap ajuda o Google Ads a rastrear melhor suas páginas
2. Melhora o Quality Score dos anúncios
3. Permite remarketing dinâmico de produtos

## 🎯 URLs Incluídas no Sitemap

### Páginas Principais (Prioridade Alta)
- `/` - Homepage (1.0)
- `/ifoodpay` - Checkout (0.9)
- `/checkout` - Checkout (0.9)
- `/carrinho` - Carrinho (0.8)

### Produtos (Prioridade Média-Alta)
- `/product/destaque-1` até `/product/destaque-8` (0.8)
- `/product/combo-1` até `/product/combo-8` (0.8)
- `/product/delicias-1` até `/product/delicias-8` (0.8)
- `/product/milkshake-1` até `/product/milkshake-8` (0.8)
- `/product/bebidas-1` até `/product/bebidas-8` (0.8)

### Outras Páginas
- `/pedidos` - Pedidos (0.7)
- `/checkout/endereco` - Endereço (0.7)

## 📈 Benefícios para Google Ads

1. **Melhor Rastreamento**: Google indexa todas as páginas de produtos
2. **Quality Score**: Páginas bem estruturadas melhoram o score
3. **Remarketing Dinâmico**: Permite criar anúncios dinâmicos de produtos
4. **Conversões**: Melhor tracking de conversões por produto
5. **Landing Pages**: Todas as páginas otimizadas para anúncios

## 🔧 Manutenção

### Adicionar Novos Produtos
Edite `app/sitemap.ts` e adicione os IDs na array `productIds`:
```typescript
const productIds = [
  // ... produtos existentes
  'novo-produto-1',
  'novo-produto-2',
]
```

### Atualizar Metadados
Edite `app/layout.tsx` para atualizar:
- Título
- Descrição
- Keywords
- Código de verificação do Google

### Atualizar Dados Estruturados
Edite `components/StructuredData.tsx` para:
- Atualizar informações de contato
- Adicionar novas seções de menu
- Atualizar horários de funcionamento
- Atualizar avaliações

## ✨ Próximos Passos

1. ✅ Deploy do site
2. ✅ Verificar sitemap em produção
3. ✅ Submeter ao Google Search Console
4. ✅ Testar dados estruturados
5. ✅ Configurar Google Analytics 4
6. ✅ Configurar Google Ads Enhanced Conversions
