# Nacional Acai - Cardápio Digital

Aplicação Next.js moderna para pedidos online de açaí.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Lucide React** - Ícones modernos

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar em produção
npm start
```

## 🎨 Funcionalidades

- ✅ Visualização de produtos com imagens
- ✅ Seleção de incrementos (açaí, cremes, adicionais, coberturas)
- ✅ Validação de quantidade mínima/máxima
- ✅ Sistema de busca de itens
- ✅ Design responsivo e moderno
- ✅ Animações suaves

## 📱 Estrutura

```
app/
  ├── layout.tsx       # Layout principal
  ├── page.tsx         # Página inicial (produto)
  └── globals.css      # Estilos globais

components/
  ├── Header.tsx              # Cabeçalho com navegação
  ├── ProductInfo.tsx         # Informações do produto
  ├── AdditionalSelector.tsx  # Seletor de incrementos
  ├── ItemChooser.tsx         # Item individual com contador
  └── CartButton.tsx          # Botão de adicionar ao carrinho
```

## 🎯 Próximos Passos

- [ ] Página de carrinho
- [ ] Integração com API
- [ ] Sistema de pagamento
- [ ] Histórico de pedidos
- [ ] Autenticação de usuário
