# 🔥 Sistema de Notificações de Prova Social

## 📋 Descrição

Sistema de notificações que mostra em tempo real quando outros usuários estão comprando, aumentando a confiança e urgência dos visitantes.

## ✅ O que foi implementado

### 1. **Componente SocialProofNotifications**
- Exibe notificações automáticas no canto inferior esquerdo
- 10 mensagens diferentes rotativas
- Intervalo aleatório entre 15-30 segundos
- Animações suaves de entrada/saída
- Pausa ao passar o mouse

### 2. **Mensagens Incluídas**
- 🔥 "Nas últimas 2 horas, 37 pessoas compraram nossos combos de açaí!"
- ⚡ "Maria de São Paulo acabou de fazer um pedido!"
- 🎉 "João do Rio de Janeiro comprou 2 açaís de 1L!"
- 💜 "Ana de Belo Horizonte acabou de pedir um combo!"
- 🔥 "15 pessoas estão vendo este produto agora!"
- ⭐ "Carlos de Brasília deu 5 estrelas para nosso açaí!"
- 🚀 "Últimas 24h: 127 pedidos realizados!"
- 💚 "Paula de Curitiba acabou de fazer um pedido!"
- 🎊 "Pedro de Salvador comprou o combo promocional!"
- ⚡ "Juliana de Fortaleza acabou de pedir açaí zero!"

### 3. **Estilos Customizados**
- Design responsivo (mobile e desktop)
- Cores e tamanhos otimizados
- Animações suaves
- Barra de progresso do timer

## 🚀 Como Instalar

### 1. Instalar dependência
```bash
npm install sweetalert2
```

### 2. Arquivos criados
- ✅ `components/SocialProofNotifications.tsx` - Componente principal
- ✅ `app/social-proof.css` - Estilos customizados
- ✅ Integrado em `app/layout.tsx`

### 3. Já está funcionando!
O componente já está integrado no layout principal e começará a exibir notificações automaticamente após 5 segundos da página carregar.

## 🎨 Personalização

### Alterar mensagens
Edite o array `notifications` em `components/SocialProofNotifications.tsx`:

```typescript
const notifications: Notification[] = [
  { message: "Sua mensagem aqui!", icon: "success" },
  { message: "Outra mensagem!", icon: "info" },
];
```

### Alterar intervalo
Modifique a linha do `nextDelay`:

```typescript
// Padrão: 15-30 segundos
const nextDelay = Math.random() * 15000 + 15000;

// Exemplo: 10-20 segundos
const nextDelay = Math.random() * 10000 + 10000;
```

### Alterar posição
Modifique a propriedade `position` no `Swal.fire()`:

```typescript
position: "bottom-left",  // Padrão
// Opções: "top", "top-start", "top-end", "center", "center-start", 
//         "center-end", "bottom", "bottom-start", "bottom-end"
```

### Alterar duração
Modifique a propriedade `timer`:

```typescript
timer: 5000, // 5 segundos (padrão)
```

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Desktop**: Notificações no canto inferior esquerdo
- **Mobile**: Notificações adaptadas à largura da tela

## 🎯 Benefícios

- ✅ **Aumenta conversões**: Prova social gera confiança
- ✅ **Cria urgência**: Mostra que outros estão comprando
- ✅ **Não intrusivo**: Aparece discretamente no canto
- ✅ **Customizável**: Fácil de personalizar mensagens e comportamento
- ✅ **Performance**: Carregamento assíncrono do SweetAlert2

## 🔧 Desabilitar (se necessário)

Para desabilitar temporariamente, comente a linha no `app/layout.tsx`:

```typescript
// <SocialProofNotifications />
```

## 📊 Estatísticas Sugeridas

Para tornar as notificações mais realistas, você pode:

1. **Integrar com analytics** para mostrar números reais
2. **Usar dados do banco** para nomes e cidades reais
3. **Randomizar números** para parecer mais natural

## 🎨 Ícones Disponíveis

- `success` - ✅ Verde (pedidos concluídos)
- `info` - ℹ️ Azul (informações gerais)
- `warning` - ⚠️ Amarelo (alertas)
- `error` - ❌ Vermelho (erros)
- `question` - ❓ Roxo (perguntas)

## 📝 Notas

- As notificações começam após 5 segundos do carregamento da página
- Cada notificação dura 5 segundos
- O intervalo entre notificações é aleatório (15-30s)
- Ao passar o mouse, o timer pausa
- As mensagens rotacionam em loop infinito
