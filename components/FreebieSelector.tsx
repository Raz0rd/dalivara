"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface FreebieOption {
  id: string;
  name: string;
  quantity: number;
}

interface FreebieSelectorProps {
  onSelect: (selectedId: string | null) => void;
}

export default function FreebieSelector({ onSelect }: FreebieSelectorProps) {
  const [selectedFreebie, setSelectedFreebie] = useState<string | null>(null);

  const freebies: FreebieOption[] = [
    { id: "bis", name: "Bis (3 un)", quantity: 3 },
    { id: "chantilly", name: "Chantilly", quantity: 1 },
    { id: "nutella", name: "Nutella", quantity: 1 },
    { id: "bola-sorvete", name: "01 bola de sorvete de creme", quantity: 1 },
    { id: "creme-ninho", name: "Creme de Ninho", quantity: 1 },
    { id: "creme-oreo", name: "Creme de Oreo", quantity: 1 },
    { id: "kitkat", name: "KitKat", quantity: 1 },
  ];

  const handleSelect = (id: string) => {
    const newSelection = selectedFreebie === id ? null : id;
    setSelectedFreebie(newSelection);
    onSelect(newSelection);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Turbine seu açaí:</h3>
            <p className="text-sm text-gray-600">Escolha até 1 opção</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
              {selectedFreebie ? "1" : "0"}/1
            </span>
            {selectedFreebie && (
              <div className="bg-green-500 rounded-full p-1">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Brindes */}
      <div className="divide-y divide-gray-200">
        {freebies.map((freebie) => (
          <div
            key={freebie.id}
            className={`flex items-center justify-between px-4 py-3 transition-colors ${
              selectedFreebie === freebie.id ? "bg-green-50" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {freebie.name}
                {freebie.quantity > 1 && ` (${freebie.quantity} un)`}
              </p>
              <p className="text-sm font-semibold text-green-600">
                Grátis no 1º pedido
              </p>
            </div>

            {/* Botão de Seleção */}
            <button
              onClick={() => handleSelect(freebie.id)}
              className={`min-w-[100px] px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                selectedFreebie === freebie.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {selectedFreebie === freebie.id ? (
                <span className="flex items-center justify-center gap-1">
                  <Check size={16} strokeWidth={3} />
                  Selecionado
                </span>
              ) : (
                "Selecionar"
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Rodapé Informativo */}
      <div className="bg-green-50 px-4 py-3 border-t border-green-200">
        <p className="text-xs text-green-800 text-center">
          🎁 <strong>Brinde exclusivo</strong> para o primeiro pedido! Escolha sua opção favorita.
        </p>
      </div>
    </div>
  );
}
