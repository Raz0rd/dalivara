"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShoppingBag, ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import BottomNav from "@/components/BottomNav";
import DeliveryProgressBar from "@/components/DeliveryProgressBar";
import Image from "next/image";

interface PaidOrder {
  transactionId: string;
  pixCode: string;
  amount: number;
  items: any[];
  status: 'paid' | 'preparing' | 'delivering' | 'delivered';
  paidAt: number;
}

export default function PedidosPage() {
  const router = useRouter();
  const { items: cartItems, getTotalPrice } = useCart();
  const [paidOrders, setPaidOrders] = useState<PaidOrder[]>([]);
  const [hasSavedCart, setHasSavedCart] = useState(false);
  const [hasPendingOrder, setHasPendingOrder] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);

  useEffect(() => {
    // Verificar se tem pedido pendente (PIX gerado mas não pago)
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      const order = JSON.parse(pendingOrder);
      const now = Date.now();
      
      // Verificar se ainda não expirou
      if (now < order.expiresAt) {
        setHasPendingOrder(true);
        setPendingOrderData(order);
      } else {
        localStorage.removeItem('pendingOrder');
      }
    }

    // Verificar se tem carrinho salvo (só se não tiver pedido pendente)
    if (!pendingOrder) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        setHasSavedCart(cart.length > 0);
      }
    }

    // Buscar pedidos pagos
    const savedPaidOrders = localStorage.getItem('paidOrders');
    if (savedPaidOrders) {
      setPaidOrders(JSON.parse(savedPaidOrders));
    }
  }, []);

  const handleRecoverCart = () => {
    router.push('/carrinho');
  };

  const handleContinuePendingOrder = () => {
    router.push('/ifoodpay');
  };

  const totalOrders = paidOrders.length + (hasSavedCart ? 1 : 0) + (hasPendingOrder ? 1 : 0);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white z-50 shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 px-4 py-4">
            <button
              onClick={() => router.push("/")}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Voltar"
            >
              <ChevronLeft size={24} color="#333" strokeWidth={2} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Meus Pedidos</h1>
          </div>
        </div>
      </header>

      {/* Container centralizado para desktop */}
      <div className="max-w-md mx-auto w-full bg-white shadow-lg min-h-screen">
      {/* Conteúdo */}
      {totalOrders === 0 ? (
        /* Estado Vazio */
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="text-gray-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
            Você ainda não tem pedidos
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6 max-w-sm">
            Quando você fizer um pedido, ele aparecerá aqui para você acompanhar
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ver Cardápio
          </button>
        </div>
      ) : (
        /* Lista de Pedidos */
        <div className="flex-1 px-4 py-4 space-y-4">
          {/* Pedido Pendente (PIX gerado mas não pago) */}
          {hasPendingOrder && (
            <div className="bg-white rounded-lg border-2 border-orange-400 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Pagamento Pendente</h3>
                      <p className="text-sm text-gray-600">
                        Aguardando pagamento PIX
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status com dot piscando laranja */}
                <div className="flex items-center gap-2 mb-3 p-3 bg-orange-50 rounded-lg">
                  <div className="relative">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-semibold text-orange-800">
                    Aguardando Pagamento
                  </span>
                </div>

                <button
                  onClick={handleContinuePendingOrder}
                  className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Continuar Pagamento
                </button>
              </div>
            </div>
          )}

          {/* Carrinho Salvo */}
          {hasSavedCart && (
            <div className="bg-white rounded-lg border-2 border-yellow-400 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="text-yellow-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Carrinho Salvo</h3>
                      <p className="text-sm text-gray-600">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <button
                  onClick={handleRecoverCart}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Recuperar Carrinho
                </button>
              </div>
            </div>
          )}

          {/* Pedidos Pagos */}
          {paidOrders.map((order) => (
            <div key={order.transactionId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                {/* Barra de Progresso */}
                <DeliveryProgressBar isPaid={true} />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Pedido #{order.transactionId.slice(-6)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.paidAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    R$ {(order.amount / 100).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Itens do pedido */}
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className="text-gray-600">{item.quantity}x</span>
                      <span className="text-gray-900">{item.name}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500">
                      +{order.items.length - 2} {order.items.length - 2 === 1 ? 'item' : 'itens'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      <BottomNav />
    </main>
  );
}
