# Sistema de Templates

Este projeto suporta múltiplos templates/modelos de layout.

## Configuração

No arquivo `.env`, defina qual template usar:

```bash
NEXT_PUBLIC_TEMPLATE=modelo1  # ou modelo2
```

## Modelos Disponíveis

### Modelo 1 (Padrão)
- Layout mobile-first centralizado
- Design moderno com cards
- Fundo cinza com container branco centralizado
- Ideal para delivery moderno

### Modelo 2 (Delivery Food)
- Layout estilo cardápio tradicional
- Full width
- Estilo mais clássico de delivery
- Baseado em template HTML delivery food

## Estrutura de Arquivos

```
app/
├── templates/
│   ├── modelo1/
│   │   └── (componentes específicos do modelo1)
│   └── modelo2/
│       └── (componentes específicos do modelo2)
├── page.tsx (detecta template e renderiza)
└── ...

components/
├── TemplateWrapper.tsx (wrapper que aplica layout baseado no template)
└── ...

public/
├── css/
│   └── modelo2/
│       └── (estilos do modelo2)
└── ...
```

## Como Adicionar um Novo Template

1. Criar pasta em `app/templates/modelo3/`
2. Criar componentes específicos do template
3. Adicionar condição no `TemplateWrapper.tsx`
4. Adicionar CSS em `public/css/modelo3/` se necessário
5. Atualizar `.env.example` com o novo modelo

## Integração com Checkout

Todos os templates usam o **mesmo sistema de checkout**. Os produtos apenas mudam de apresentação visual, mas ao clicar em "Adicionar ao Carrinho" ou "Comprar", todos usam:

- `/carrinho` - Página do carrinho
- `/checkout` - Fluxo de checkout
- `/checkout/endereco` - Endereço de entrega
- `/checkout/resumo` - Resumo do pedido
- `/ifoodpay` - Pagamento PIX

## Exemplo de Uso

### Para Nacional Açaí (Modelo 1):
```bash
NEXT_PUBLIC_TEMPLATE=modelo1
NEXT_PUBLIC_STORE_NAME=NACIONAL AÇAÍ
```

### Para Sertão Açaí (Modelo 2):
```bash
NEXT_PUBLIC_TEMPLATE=modelo2
NEXT_PUBLIC_STORE_NAME=SERTÃO AÇAÍ
```
