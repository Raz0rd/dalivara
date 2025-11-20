// Store temporário compartilhado para pedidos
// Em produção, use Redis ou banco de dados
export const ordersStore = new Map<string, any>();
