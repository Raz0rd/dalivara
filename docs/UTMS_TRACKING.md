# Rastreamento de UTMs e Conversões

## Visão Geral

O sistema captura **100% dos parâmetros UTM** disponíveis e envia para o Utmify, que gerencia as conversões do Google Ads:
- **Utmify** (rastreamento completo de UTMs e conversões)
- **Utmify Google Pixel** (ID: 691e5f8cd0a1fe99b32e1fd8) - Integração com Google Ads (AW-17719649597)
- **Google Ads Tag** - Carregada para tracking, mas conversões gerenciadas pelo Utmify

## Parâmetros UTM Capturados

O sistema captura todos os parâmetros UTM padrão e estendidos:

### Parâmetros Básicos
- `utm_source` - Origem do tráfego (ex: google, facebook, instagram)
- `utm_medium` - Meio de marketing (ex: cpc, email, social)
- `utm_campaign` - Nome da campanha
- `utm_term` - Termos de pesquisa (palavras-chave)
- `utm_content` - Conteúdo específico do anúncio

### Parâmetros Estendidos (Google Ads)
- `utm_id` - ID da campanha
- `utm_source_platform` - Plataforma de origem
- `utm_creative_format` - Formato do criativo
- `utm_marketing_tactic` - Tática de marketing

## Como Funciona

### 1. Captura Inicial (Entrada do Usuário)
Quando o usuário acessa o site com UTMs na URL:
```
https://seusite.com/?utm_source=google&utm_medium=cpc&utm_campaign=black_friday
```

O script do **Utmify** (`https://cdn.utmify.com.br/scripts/utms/latest.js`) automaticamente:
- Captura os UTMs da URL
- Armazena em cookies/localStorage
- Mantém os UTMs durante toda a sessão

### 2. Salvamento Local
Na página de checkout (`/ifoodpay`), o sistema:
- Captura UTMs de múltiplas fontes:
  - URL atual
  - localStorage (dados do Utmify)
  - Cookies
  - sessionStorage
- Salva no localStorage para uso posterior
- Exibe no console para debug

```typescript
// Exemplo de log no console
📊 UTMs capturados na página: {
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "black_friday",
  utm_term: "acai+delivery",
  utm_content: "ad_variant_1"
}
```

### 3. Envio com o Pedido
Ao criar o pedido, os UTMs são:
- Incluídos no payload da API de pagamento
- Salvos junto com os dados do pedido
- Logados no servidor para auditoria

### 4. Conversão (Pagamento Confirmado - Status PAID)
Quando o pagamento é confirmado (status `paid`), o sistema dispara conversão para o Utmify no **client-side**:

#### Utmify - Evento 'paid' (com todos os UTMs)
```typescript
const conversionResult = await sendUtmifyConversion(
  transactionId,
  totalValue,
  email,
  phone
);
```

**Características importantes:**
- ✅ Executado apenas no client-side (navegador)
- ✅ Captura UTMs de 5 fontes diferentes (URL, localStorage, cookies, sessionStorage, saved_utms)
- ✅ Envia evento `paid` para o Utmify
- ✅ Inclui todos os parâmetros UTM sem erro
- ✅ Log detalhado de todos os UTMs capturados e enviados

O **Utmify Google Pixel** automaticamente captura e envia os dados para o Google Ads (AW-17719649597), eliminando a necessidade de conversões diretas via `gtag`.

O payload enviado ao Utmify inclui:
```json
{
  "event": "paid",
  "transaction_id": "abc123",
  "value": 45.90,
  "currency": "BRL",
  "timestamp": "2024-11-19T22:00:00.000Z",
  "email": "cliente@email.com",
  "phone": "11999999999",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "black_friday",
  "utm_term": "acai+delivery",
  "utm_content": "ad_variant_1",
  "utm_id": "campaign_123",
  "utm_source_platform": "google_ads",
  "utm_creative_format": "display",
  "utm_marketing_tactic": "remarketing"
}
```

## Arquivos Principais

### Frontend
- **`utils/utmify.ts`** - Funções de captura e envio de UTMs
  - `getUtmParams()` - Captura UTMs de todas as fontes
  - `sendUtmifyConversion()` - Envia conversão ao Utmify
  - `saveUtmsToStorage()` - Salva UTMs no localStorage
  - `getSavedUtms()` - Recupera UTMs salvos

- **`app/ifoodpay/page.tsx`** - Página de checkout
  - Captura UTMs ao carregar
  - Envia UTMs com o pedido
  - Dispara conversões após pagamento

- **`app/layout.tsx`** - Layout principal
  - Script do Utmify carregado globalmente
  - Google Ads tag configurada
  - Utmify Google Pixel configurado (ID: 691e5f8cd0a1fe99b32e1fd8)

### Backend
- **`app/api/payment/pix/route.ts`** - API de criação de PIX
  - Recebe UTMs no payload
  - Salva UTMs junto com o pedido
  - Loga UTMs para auditoria

## Verificação e Debug

### Console do Navegador
O sistema loga todas as etapas:
```
📊 UTMs capturados na página: {...}
📤 Enviando conversão ao Utmify: {...}
✅ Conversão enviada ao Utmify via API global
✅ Conversões disparadas com sucesso!
```

### Verificar UTMs Salvos
No console do navegador:
```javascript
// Ver UTMs salvos
JSON.parse(localStorage.getItem('saved_utms'))

// Ver dados do Utmify
JSON.parse(localStorage.getItem('utmify_data'))
```

### Verificar Cookies
```javascript
document.cookie.split(';').filter(c => c.includes('utm'))
```

## Google Pixel do Utmify

O **Utmify Google Pixel** (ID: `691e5f8cd0a1fe99b32e1fd8`) é carregado em todas as páginas e funciona como uma ponte entre o Google Ads e o Utmify.

### Como Funciona
1. O pixel é carregado automaticamente no `<head>` de todas as páginas
2. Ele captura eventos de conversão do Google Ads
3. Envia os dados para o Utmify junto com os UTMs
4. Permite rastreamento completo no painel do Utmify

### Configuração
```javascript
window.googlePixelId = "691e5f8cd0a1fe99b32e1fd8";
// Script carregado dinamicamente
```

Este pixel trabalha em conjunto com:
- Script de UTMs do Utmify
- Tag do Google Ads (AW-17719649597)
- Sistema de conversões customizado

## Integração com Utmify

O sistema está preparado para integração com a API do Utmify. Atualmente usa:
1. **API Global** - Se disponível: `window.utmify('conversion', payload)`
2. **Fallback HTTP** - Pode ser configurado para enviar via fetch

Para configurar endpoint HTTP do Utmify, edite `utils/utmify.ts`:
```typescript
await fetch('https://api.utmify.com.br/v1/conversions', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SEU_TOKEN_AQUI'
  },
  body: JSON.stringify(payload)
});
```

## Testes

### Testar Captura de UTMs
1. Acesse com UTMs: `http://localhost:3000/?utm_source=test&utm_medium=test&utm_campaign=test`
2. Abra o console do navegador
3. Verifique os logs de captura

### Testar Conversão
1. Complete um pedido
2. Aguarde confirmação de pagamento
3. Verifique logs no console:
   - Conversão Google Ads
   - Conversão Utmify
   - UTMs enviados

## Observações Importantes

1. **Persistência**: UTMs são mantidos durante toda a sessão do usuário
2. **Múltiplas Fontes**: Sistema busca UTMs em 4 locais diferentes (URL, localStorage, cookies, sessionStorage)
3. **Fallback**: Se não houver UTMs, o sistema continua funcionando normalmente
4. **Privacy**: Dados são armazenados apenas localmente no navegador do usuário
5. **Debug**: Todos os passos são logados no console para facilitar debug

## Próximos Passos

- [ ] Configurar endpoint HTTP do Utmify (se necessário)
- [ ] Adicionar token de autenticação do Utmify
- [ ] Testar integração completa em produção
- [ ] Monitorar conversões no painel do Utmify
- [ ] Validar dados recebidos no Utmify
