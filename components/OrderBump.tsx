"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Check } from "lucide-react";

interface OrderBumpProps {
  onAddToCart: (product: { id: string; name: string; price: number; image: string }) => void;
}

export default function OrderBump({ onAddToCart }: OrderBumpProps) {
  const [showWaterOptions, setShowWaterOptions] = useState(false);
  const [selectedWater, setSelectedWater] = useState<string | null>(null);

  const waterOptions = [
    {
      id: "agua-sem-gas",
      name: "Água mineral sem gás 500ml",
      price: 2.50,
      image: "/products/agua-sem-gas.jpg",
      type: "sem-gas",
    },
    {
      id: "agua-com-gas",
      name: "Água mineral com gás 500ml",
      price: 3.00,
      image: "/products/agua-com-gas.jpg",
      type: "com-gas",
    },
  ];

  const handleWaterClick = () => {
    setShowWaterOptions(true);
  };

  const handleSelectWater = (water: typeof waterOptions[0]) => {
    setSelectedWater(water.id);
    onAddToCart(water);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 p-4 shadow-md">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            OFERTA ESPECIAL
          </span>
          <span className="text-blue-600 text-xs font-semibold">
            Aproveite agora!
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Que tal adicionar uma água?
        </h3>
        <p className="text-sm text-gray-600">
          Mantenha-se hidratado! Adicione água ao seu pedido
        </p>
      </div>

      {/* Opção inicial - Água */}
      {!showWaterOptions ? (
        <button
          onClick={handleWaterClick}
          className="w-full bg-white rounded-lg border-2 border-blue-300 p-4 hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 bg-blue-50 rounded-lg flex-shrink-0 overflow-hidden">
              <Image
                src="/products/agua-sem-gas.jpg"
                alt="Água Mineral"
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-gray-900 text-base">Água Mineral 500ml</h4>
              <p className="text-sm text-gray-600">Escolha com ou sem gás</p>
              <p className="text-blue-600 font-bold text-sm mt-1">
                A partir de R$ 2,50
              </p>
            </div>
            <Plus size={24} className="text-blue-600" strokeWidth={2.5} />
          </div>
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">
            Escolha sua preferência:
          </p>
          
          {waterOptions.map((water) => (
            <button
              key={water.id}
              onClick={() => handleSelectWater(water)}
              className={`w-full bg-white rounded-lg border-2 p-3 transition-all ${
                selectedWater === water.id
                  ? "border-green-500 bg-green-50"
                  : "border-blue-200 hover:border-blue-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={water.image}
                    alt={water.name}
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {water.type === "sem-gas" ? "Sem Gás" : "Com Gás"}
                  </h4>
                  <p className="text-xs text-gray-600">{water.name}</p>
                  <p className="text-blue-600 font-bold text-sm">
                    R$ {water.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                {selectedWater === water.id ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={20} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <Plus size={24} className="text-blue-600" strokeWidth={2.5} />
                )}
              </div>
            </button>
          ))}

          <button
            onClick={() => setShowWaterOptions(false)}
            className="w-full text-sm text-gray-600 hover:text-gray-900 py-2"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Badge de economia */}
      <div className="mt-3 text-center">
        <p className="text-xs text-blue-700 font-semibold">
          ⚡ Adicione agora e economize no frete!
        </p>
      </div>
    </div>
  );
}
