# Google Ads Conversion Tracking - Sistema Multitenant

Sistema de rastreamento de conversões do Google Ads integrado ao sistema multitenant. Cada tenant pode ter sua própria configuração de conversão.

## 🎯 Como Funciona

O sistema injeta automaticamente:
1. **Tag do Google Ads** (gtag.js) em todas as páginas
2. **Snippet de conversão** que fica disponível globalmente
3. **Hook React** para disparar conversões facilmente

Tudo é configurado por tenant, então cada domínio tem seu próprio tracking sem expor o sistema multitenant.

## 📝 Configuração do Tenant

Em `config/tenants.ts`, adicione os campos de conversão:

```typescript
'seudominio.com.br': {
  // ... outras configs ...
  googleAdsId: 'AW-17827600901',
  googleAdsConversionId: 'AW-17827600901',
  googleAdsConversionLabel: 'nxhSCMDZr9YbEIW07rRC',
}
```

### Como Obter os Valores

1. Acesse o Google Ads
2. Vá em **Ferramentas e Configurações** > **Medição** > **Conversões**
3. Clique na conversão desejada
4. Copie o código do snippet:

```html
<script>
gtag('event', 'conversion', {
    'send_to': 'AW-17827600901/nxhSCMDZr9YbEIW07rRC'
});
</script>
```

- `AW-17827600901` = **googleAdsConversionId**
- `nxhSCMDZr9YbEIW07rRC` = **googleAdsConversionLabel**

## 💻 Como Usar no Código

### Opção 1: Hook React (Recomendado)

```typescript
'use client';

import { useGoogleAdsConversion } from '@/components/GoogleAdsConversion';

export default function CheckoutPage() {
  const { reportConversion } = useGoogleAdsConversion();

  const handlePaymentSuccess = async (orderId: string, orderValue: number) => {
    // Disparar conversão
    reportConversion({
      value: orderValue,
      transactionId: orderId
    });

    // Redirecionar para página de sucesso
    router.push('/pedido-confirmado');
  };

  return (
    <button onClick={() => handlePaymentSuccess('12345', 49.90)}>
      Finalizar Pedido
    </button>
  );
}
```

### Opção 2: Função Global (JavaScript Puro)

```typescript
// Disponível globalmente após o carregamento da página
(window as any).gtag_report_conversion(
  undefined,        // url (opcional)
  49.90,           // value
  'ORDER-12345'    // transaction_id
);
```

## 🛒 Exemplo Completo: Checkout com iFood Pay

```typescript
'use client';

import { useGoogleAdsConversion } from '@/components/GoogleAdsConversion';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { reportConversion } = useGoogleAdsConversion();
  const router = useRouter();

  const handleIfoodPayment = async () => {
    try {
      // Processar pagamento...
      const response = await processPayment();
      
      if (response.status === 'paid') {
        // Disparar conversão do Google Ads
        reportConversion({
          value: response.amount,
          transactionId: response.orderId
        });

        // Redirecionar
        router.push(`/pedido/${response.orderId}`);
      }
    } catch (error) {
      console.error('Erro no pagamento:', error);
    }
  };

  return (
    <button onClick={handleIfoodPayment}>
      Pagar com iFood
    </button>
  );
}
```

## 📊 Parâmetros da Conversão

| Parâmetro | Tipo | Descrição | Obrigatório |
|-----------|------|-----------|-------------|
| `value` | number | Valor da conversão em BRL | Não (padrão: 1.0) |
| `transactionId` | string | ID único da transação | Não |
| `url` | string | URL para redirecionar após conversão | Não |

## 🔍 Verificando se Está Funcionando

### 1. Console do Navegador

Abra o DevTools (F12) e veja se há erros. Deve aparecer:
```
gtag('event', 'conversion', {...})
```

### 2. Google Tag Assistant

1. Instale a extensão [Tag Assistant](https://tagassistant.google.com/)
2. Acesse seu site
3. Dispare uma conversão
4. Verifique se o evento foi capturado

### 3. Google Ads

1. Acesse **Ferramentas e Configurações** > **Medição** > **Conversões**
2. Clique na conversão configurada
3. Aguarde até 24h para ver os dados (pode levar algumas horas)

## ⚠️ Notas Importantes

1. **Tag Principal**: O `googleAdsId` deve estar configurado para que o gtag.js seja carregado
2. **Conversão Única**: Cada conversão deve ter um `transactionId` único para evitar duplicatas
3. **Valor em BRL**: O valor é sempre em Reais (BRL)
4. **Delay**: Conversões podem levar até 24h para aparecer no Google Ads
5. **Teste em Produção**: Use o Tag Assistant para testar em ambiente real

## 🐛 Troubleshooting

### Conversão não dispara

**Verifique:**
- `googleAdsId` está configurado no tenant
- `googleAdsConversionId` e `googleAdsConversionLabel` estão corretos
- Console do navegador não mostra erros
- Função `gtag` está disponível: `console.log(window.gtag)`

### Conversões duplicadas

**Solução:**
- Sempre use `transactionId` único
- Não chame `reportConversion` múltiplas vezes para o mesmo pedido

### Conversões não aparecem no Google Ads

**Possíveis causas:**
- Aguarde até 24h
- Verifique se a conversão está ativa no Google Ads
- Confirme que o ID e Label estão corretos
- Use o Tag Assistant para verificar se o evento está sendo enviado

## 📱 Exemplo: Modelo 2 (Template Roxo)

```typescript
'use client';

import { useGoogleAdsConversion } from '@/components/GoogleAdsConversion';
import { useCart } from '@/contexts/CartContext';

export default function Modelo2CheckoutButton() {
  const { reportConversion } = useGoogleAdsConversion();
  const { items, getTotalPrice } = useCart();

  const handleFinalizarPedido = () => {
    const orderId = `ORDER-${Date.now()}`;
    const totalValue = getTotalPrice();

    // Disparar conversão
    reportConversion({
      value: totalValue,
      transactionId: orderId
    });

    // Continuar com o fluxo normal...
  };

  return (
    <button onClick={handleFinalizarPedido}>
      Finalizar Pedido
    </button>
  );
}
```

## ✅ Checklist de Implementação

- [ ] Configurar `googleAdsId` no tenant
- [ ] Configurar `googleAdsConversionId` no tenant
- [ ] Configurar `googleAdsConversionLabel` no tenant
- [ ] Importar `useGoogleAdsConversion` no componente de checkout
- [ ] Chamar `reportConversion` quando pagamento for confirmado
- [ ] Passar `value` e `transactionId` corretos
- [ ] Testar com Tag Assistant
- [ ] Verificar no Google Ads após 24h
