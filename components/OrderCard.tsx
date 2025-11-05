"use client";

import { useState } from "react";
import { Clock, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import Image from "next/image";

interface OrderCardProps {
  order: {
    id: string;
    status: "pending" | "confirmed" | "preparing" | "delivering" | "delivered";
    date: string;
    time: string;
    total: number;
    items: any[];
    paymentMethod: string;
    pixCode?: string;
    qrCodeUrl?: string;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const statusConfig = {
    pending: { label: "Aguardando Pagamento", color: "bg-yellow-500", icon: "⏳" },
    confirmed: { label: "Confirmado", color: "bg-blue-500", icon: "✓" },
    preparing: { label: "Preparando", color: "bg-purple-500", icon: "👨‍🍳" },
    delivering: { label: "Saiu para Entrega", color: "bg-orange-500", icon: "🚴" },
    delivered: { label: "Entregue", color: "bg-green-500", icon: "✓" },
  };

  const currentStatus = statusConfig[order.status];

  const handleCopyPix = () => {
    if (order.pixCode) {
      navigator.clipboard.writeText(order.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Header do Card */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentStatus.icon}</span>
            <div>
              <p className="font-bold text-gray-900">Pedido #{order.id}</p>
              <p className="text-xs text-gray-600">{order.date} às {order.time}</p>
            </div>
          </div>
          <div className={`${currentStatus.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {currentStatus.label}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-primary">
            R$ {order.total.toFixed(2).replace(".", ",")}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
          >
            {isExpanded ? "Ver menos" : "Ver detalhes"}
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Detalhes Expandidos */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Itens do Pedido */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Itens do Pedido</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.quantity}x {item.name}</span>
                  <span className="font-semibold text-gray-900">
                    R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code PIX (se pendente) */}
          {order.status === "pending" && order.qrCodeUrl && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-bold text-gray-900 mb-3 text-center">Pague com PIX</h3>
              
              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="relative w-48 h-48 bg-white p-2 rounded-lg border-2 border-gray-200">
                  <Image
                    src={order.qrCodeUrl}
                    alt="QR Code PIX"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Copia e Cola */}
              {order.pixCode && (
                <div>
                  <p className="text-sm text-gray-600 mb-2 text-center">
                    Ou copie o código PIX:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={order.pixCode}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Tempo de Expiração */}
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-yellow-800">
                  <Clock size={16} />
                  <span className="font-semibold">Aguardando pagamento</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  O código PIX expira em 30 minutos
                </p>
              </div>
            </div>
          )}

          {/* Reviews / Provas Sociais */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-bold text-gray-900 mb-3">O que nossos clientes dizem</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="relative aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={`/products/reviews/${num}.webp`}
                    alt={`Review ${num}`}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
