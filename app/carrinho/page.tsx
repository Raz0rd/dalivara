"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import dynamic from "next/dynamic";

// Importar modelo2 dinamicamente
const Modelo2CartPage = dynamic(() => import("@/app/templates/modelo2/Modelo2CartPage"), {
  ssr: false,
});

export default function CarrinhoPage() {
  // Hooks devem ser chamados antes de qualquer return condicional
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice, addItem } = useCart();
  const { toast, showToast, hideToast } = useToast();
  const [hasBlockedCart, setHasBlockedCart] = useState(false);
  
  // Detectar qual template usar
  const template = process.env.NEXT_PUBLIC_TEMPLATE || 'modelo1';
  const hasItems = items.length > 0;

  // Verificar se há pedido pendente (bloqueia edição)
  useEffect(() => {
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      const order = JSON.parse(pendingOrder);
      const now = Date.now();
      
      if (now < order.expiresAt) {
        setHasBlockedCart(true);
      }
    }
  }, []);
  
  // Se for modelo2, renderizar componente específico
  if (template === 'modelo2') {
    return <Modelo2CartPage />;
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      showToast("Item removido com sucesso!", "success");
    }
    updateQuantity(id, quantity);
  };

  const popularProducts = [
    {
      id: "1",
      name: "Combo 1 Kg",
      price: 38.99,
      image: "/products/combo-1kg.jpg",
    },
    {
      id: "2",
      name: "Copo 300ml",
      price: 12.99,
      image: "/products/combo-300g.jpg",
    },
    {
      id: "3",
      name: "Copo 500ml",
      price: 18.99,
      image: "/products/combo-500g.jpg",
    },
    {
      id: "4",
      name: "Copo 700ml",
      price: 24.99,
      image: "/products/combo-500g.jpg",
    },
    {
      id: "6",
      name: "Açaí Fit",
      price: 33.99,
      image: "/products/caixa1L.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
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
            <h1 className="text-lg font-semibold text-gray-900">Carrinho</h1>
          </div>
        </div>
      </header>

      {/* Container centralizado para desktop */}
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">

      {/* Aviso de Carrinho Bloqueado */}
      {hasBlockedCart && (
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mx-4 mt-4 rounded">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-bold text-orange-800">Carrinho Bloqueado</p>
              <p className="text-sm text-orange-700">
                Você tem um pagamento pendente. Finalize ou cancele para editar o carrinho.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Carrinho vazio ou com itens */}
      {!hasItems ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart size={40} color="#999" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Adicione produtos ao carrinho e faça o pedido
          </p>
        </div>
      ) : (
        <div className="pb-32">
          {/* Itens do carrinho */}
          <div className="bg-white">
            {items.map((item) => (
              <div key={item.id} className="border-b border-gray-200 p-4">
                <div className="flex gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {item.quantity}x {item.name}
                        </span>
                        <p className="text-base font-bold text-primary">
                          R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => !hasBlockedCart && handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={hasBlockedCart}
                          className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 ${
                            hasBlockedCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Minus size={16} color="#666" />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => !hasBlockedCart && handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={hasBlockedCart}
                          className={`w-8 h-8 flex items-center justify-center rounded-full bg-primary ${
                            hasBlockedCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
                          }`}
                        >
                          <Plus size={16} color="white" />
                        </button>
                      </div>
                    </div>
                    {/* Customizações */}
                    {item.customizations && (
                      <div className="text-xs text-gray-600 space-y-1">
                        {item.customizations.acaiCremes && item.customizations.acaiCremes.length > 0 && (
                          <div>
                            <span className="font-semibold">Açaí e Cremes</span>
                            <p>{item.customizations.acaiCremes.join(", ")}</p>
                          </div>
                        )}
                        {item.customizations.adicionais && item.customizations.adicionais.length > 0 && (
                          <div>
                            <span className="font-semibold">Adicionais</span>
                            <p>{item.customizations.adicionais.join(", ")}</p>
                          </div>
                        )}
                        {item.customizations.coberturas && item.customizations.coberturas.length > 0 && (
                          <div>
                            <span className="font-semibold">Coberturas</span>
                            <p>{item.customizations.coberturas.join(", ")}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Observações */}
                    {item.observations && (
                      <div className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-200">
                        <span className="font-semibold text-gray-700">💬 Observações:</span>
                        <p className="mt-1 italic">{item.observations}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mais populares */}
      <div className="bg-gray-200 px-4 py-3">
        <h3 className="text-base font-bold text-gray-900">Mais populares</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 bg-white">
        {popularProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="block bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="relative w-full h-40 bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h4>
              <p className="text-base font-bold text-primary">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Botão fixo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        {hasItems ? (
          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 border-2 border-primary text-primary font-bold text-base rounded-lg hover:bg-primary/5 transition-colors"
            >
              Adicionar mais produtos
            </button>
            <button
              onClick={() => router.push("/checkout/endereco")}
              className="w-full py-4 bg-primary text-white font-bold text-base rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-between px-6"
            >
              <span>Avançar</span>
              <span>R$ {getTotalPrice().toFixed(2).replace(".", ",")}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 bg-primary text-white font-bold text-base rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ver cardápio
          </button>
        )}
      </div>
      </div>
    </main>
  );
}
