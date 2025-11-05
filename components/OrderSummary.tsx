"use client";

import { useState } from "react";
import { ChevronRight, Minus, Plus } from "lucide-react";
import Image from "next/image";

interface OrderSummaryProps {
  items: any[];
  totalPrice: number;
  deliveryData: any;
  onConfirm: () => void;
  onRemoveItem?: (id: string) => void;
  onTipChange?: (tip: number) => void;
}

export default function OrderSummary({ items, totalPrice, deliveryData, onConfirm, onRemoveItem, onTipChange }: OrderSummaryProps) {
  const [tip, setTip] = useState(0);

  const handleIncreaseTip = () => {
    if (tip < 10) {
      const newTip = tip + 1;
      setTip(newTip);
      onTipChange?.(newTip);
    }
  };

  const handleDecreaseTip = () => {
    if (tip > 0) {
      const newTip = tip - 1;
      setTip(newTip);
      onTipChange?.(newTip);
    }
  };

  const finalTotal = totalPrice + tip;
  return (
    <div className="border border-gray-200 p-4 md:p-7 bg-white rounded-lg max-sm:rounded-none">
      <h2 className="text-lg font-medium text-slate-900 mb-5">
        Resumo do Pedido
      </h2>

      {/* Lista de Produtos */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-start">
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
              <h3 className="text-sm font-semibold text-slate-900 truncate">
                {item.quantity}x {item.name}
              </h3>
              <p className="text-sm text-slate-600">
                R$ {item.price.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="text-right flex items-center gap-2">
              <p className="text-base font-bold text-slate-900">
                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
              </p>
              {onRemoveItem && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  title="Remover item"
                >
                  <span className="text-sm font-bold">×</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Informações de Entrega */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <h3 className="font-semibold text-sm text-slate-900 mb-3">Entrega</h3>
        {deliveryData?.type === "immediate" ? (
          <p className="text-sm text-slate-600">
            ⚡ Entrega Imediata - Em até 30 minutos
          </p>
        ) : (
          <div className="text-sm text-slate-600">
            <p>📅 Entrega Agendada</p>
            <p className="mt-1">Data: {deliveryData?.date}</p>
            <p>Horário: {deliveryData?.time}</p>
          </div>
        )}
      </div>

      {/* Taxa de Entrega */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏍️</span>
            <span className="text-sm font-medium text-slate-900">Entrega</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 line-through">R$ 5,00</span>
            <span className="text-sm font-bold text-green-600">Grátis!</span>
          </div>
        </div>
      </div>

      {/* Gorjeta */}
      <div className="border-t border-gray-200 pt-3 mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-700">Gorjeta</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecreaseTip}
              disabled={tip === 0}
              className={`w-6 h-6 flex items-center justify-center rounded-full border transition-colors ${
                tip === 0 
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                  : 'border-[#f02f2f] text-[#f02f2f] hover:bg-[#f02f2f] hover:text-white'
              }`}
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="text-sm font-semibold text-slate-900 min-w-[60px] text-center">
              R$ {tip.toFixed(2).replace('.', ',')}
            </span>
            <button
              type="button"
              onClick={handleIncreaseTip}
              disabled={tip === 10}
              className={`w-6 h-6 flex items-center justify-center rounded-full border transition-colors ${
                tip === 10
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-[#f02f2f] bg-[#f02f2f] text-white hover:bg-[#d02626]'
              }`}
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-right">Mín. R$ 0,00 • Máx. R$ 10,00</p>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-[#f02f2f]">
            R$ {finalTotal.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Botão Confirmar */}
      <button
        type="button"
        onClick={onConfirm}
        className="w-full h-14 flex justify-center items-center rounded-lg bg-[#f02f2f] text-white font-bold text-base hover:bg-[#f02f2f]/90 transition-colors"
      >
        Confirmar Pedido
        <ChevronRight className="w-5 h-5 ml-1" />
      </button>
    </div>
  );
}
