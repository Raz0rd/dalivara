"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  onGoToCart: () => void;
  productName: string;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onObservationsChange?: (obs: string) => void;
}

export default function AddToCartModal({
  isOpen,
  onClose,
  onContinue,
  onGoToCart,
  productName,
  quantity,
  onQuantityChange,
  onObservationsChange,
}: AddToCartModalProps) {
  const [observations, setObservations] = useState("");

  const handleObservationsChange = (value: string) => {
    setObservations(value);
    if (onObservationsChange) {
      onObservationsChange(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Imagem MultiOpcao */}
          <div className="flex justify-center mb-4">
            <Image
              src="/products/MultiOpcao.png"
              alt="Produto adicionado"
              width={200}
              height={200}
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Título */}
          <h4 className="text-xl font-bold text-gray-900 text-center mb-6">
            {productName} adicionado ao carrinho!
          </h4>

          {/* Contador de Quantidade */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Quantidade
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={20} color={quantity <= 1 ? "#808080" : "#666"} strokeWidth={3} />
              </button>
              <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-colors"
              >
                <Plus size={20} color="white" strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Observações */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Observações
            </label>
            <textarea
              value={observations}
              onChange={(e) => handleObservationsChange(e.target.value)}
              placeholder="Ex.: Tirar cebola, ovo, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              rows={5}
              maxLength={200}
            />
          </div>

          {/* Botões */}
          <div className="space-y-3">
            <button
              onClick={onContinue}
              className="w-full py-4 border-2 border-primary text-primary font-bold text-base rounded-lg hover:bg-primary/5 transition-colors"
            >
              Continuar comprando
            </button>
            <button
              onClick={onGoToCart}
              className="w-full py-4 bg-primary text-white font-bold text-base rounded-lg hover:bg-primary/90 transition-colors"
            >
              Avançar para o carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
