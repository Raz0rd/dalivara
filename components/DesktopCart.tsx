"use client";

import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function DesktopCart() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();
  const hasItems = items.length > 0;

  return (
    <div className="hidden lg:block fixed right-8 top-20 w-[380px] xl:w-[420px] xl:right-12 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[calc(100vh-120px)] overflow-hidden z-40">
      {/* Header do Carrinho */}
      <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={20} />
          <h3 className="font-bold">Seu Carrinho</h3>
        </div>
        {hasItems && (
          <span className="bg-white text-primary px-2 py-1 rounded-full text-xs font-bold">
            {items.length}
          </span>
        )}
      </div>

      {/* Conteúdo do Carrinho */}
      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-center text-sm">
              Seu carrinho está vazio
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-primary text-sm font-semibold hover:underline"
            >
              Ver cardápio
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  {/* Imagem */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-primary font-bold text-sm mt-1">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>

                    {/* Customizações */}
                    {item.customizations && (
                      <div className="mt-2 space-y-1">
                        {item.customizations.acaiCremes && item.customizations.acaiCremes.length > 0 && (
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold">Açaí/Cremes:</span>{" "}
                            {item.customizations.acaiCremes.join(", ")}
                          </p>
                        )}
                        {item.customizations.adicionais && item.customizations.adicionais.length > 0 && (
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold">Adicionais:</span>{" "}
                            {item.customizations.adicionais.join(", ")}
                          </p>
                        )}
                        {item.customizations.coberturas && item.customizations.coberturas.length > 0 && (
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold">Coberturas:</span>{" "}
                            {item.customizations.coberturas.join(", ")}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Observações */}
                    {item.observations && (
                      <div className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-200">
                        <span className="font-semibold">💬 Obs:</span>
                        <p className="mt-1 italic">{item.observations}</p>
                      </div>
                    )}

                    {/* Controles de Quantidade */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer com Total e Botão */}
      {hasItems && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-xl font-bold text-primary">
              R$ {getTotalPrice().toFixed(2).replace(".", ",")}
            </span>
          </div>
          <button
            onClick={() => router.push("/checkout/endereco")}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Finalizar Pedido
          </button>
        </div>
      )}
    </div>
  );
}
