"use client";

import { MapPin } from "lucide-react";

interface LocationConfirmationModalProps {
  city: string;
  onConfirm: () => void;
  isVisible: boolean;
}

export default function LocationConfirmationModal({
  city,
  onConfirm,
  isVisible,
}: LocationConfirmationModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <MapPin size={32} className="text-primary" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Confirme sua localização
          </h2>

          <p className="text-gray-600 mb-6">
            Detectamos que você está em:
          </p>

          <div className="bg-primary/5 rounded-lg px-4 py-3 mb-6 w-full">
            <p className="text-lg font-bold text-primary">{city}</p>
          </div>

          <button
            onClick={onConfirm}
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Confirmar localização
          </button>
        </div>
      </div>
    </div>
  );
}
