"use client";

import { useState, useEffect } from "react";
import { Instagram, Info, Coins, Bike, MapPin, Star, Circle, Clock } from "lucide-react";

interface StoreInfoProps {
  city?: string;
  state?: string;
  deliveryTime?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function StoreInfo({ 
  city = "Sua cidade", 
  state = "",
  deliveryTime = "30-50",
  activeTab = "combos",
  onTabChange 
}: StoreInfoProps) {
  const [storeStatus, setStoreStatus] = useState({
    isOpen: true,
    closingTime: "",
    showClosingTime: false,
  });

  const tabs = [
    { id: "combos", label: "Combos", icon: "🍨" },
    { id: "delicias", label: "Delícias na Caixa 1L", icon: "🍦" },
    { id: "milkshake", label: "Milk-Shake", icon: "🥤" },
    { id: "bebidas", label: "Bebidas", icon: "💧" },
  ];

  useEffect(() => {
    const updateStoreStatus = () => {
      const now = new Date();
      const hours = now.getHours();

      if (hours >= 0 && hours < 2) {
        setStoreStatus({
          isOpen: true,
          closingTime: "até 02:00",
          showClosingTime: true,
        });
      } else if (hours >= 8 && hours < 23) {
        setStoreStatus({
          isOpen: true,
          closingTime: "",
          showClosingTime: false,
        });
      } else {
        setStoreStatus({
          isOpen: true,
          closingTime: "",
          showClosingTime: false,
        });
      }
    };

    updateStoreStatus();
    const interval = setInterval(updateStoreStatus, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-4 text-center">
        {/* Nome e Ícones */}
        <div className="flex items-center justify-center gap-3 mb-3 relative">
          <h1 className="text-xl font-bold text-gray-900">Nacional Açaí</h1>
          <div className="absolute right-0 flex items-center gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={22} strokeWidth={2} />
            </a>
            <button
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="Informações"
            >
              <Info size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Pedido Mínimo e Entrega */}
        <div className="flex items-center justify-center gap-4 mb-2 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <Coins size={16} className="text-gray-500" />
            <span>Pedido Mínimo</span>
            <strong>R$ 10,00</strong>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-3 text-sm text-gray-700">
          <Bike size={16} className="text-gray-500" />
          <strong>{deliveryTime}</strong>
          <span>min</span>
          <span>•</span>
          <span className="text-green-600 font-semibold">Grátis</span>
        </div>

        {/* Localização */}
        <div className="flex items-center justify-center gap-1 mb-2 text-sm text-gray-700">
          <MapPin size={16} className="text-gray-500" />
          <span>{city}</span>
          <span>-</span>
          <span>{state}</span>
          <span>•</span>
          <span>1,6km de você</span>
        </div>

        {/* Avaliação */}
        <div className="flex items-center justify-center gap-1 mb-3 text-sm text-gray-700">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          <strong>4,8</strong>
          <span>(136 avaliações)</span>
        </div>

        {/* Status da Loja */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <Circle
            size={10}
            className={`${
              storeStatus.isOpen ? "text-green-500 fill-green-500 animate-pulse" : "text-red-500 fill-red-500"
            }`}
          />
          <span className={`font-bold ${storeStatus.isOpen ? "text-green-600" : "text-red-600"}`}>
            {storeStatus.isOpen ? "ABERTO" : "FECHADO"}
          </span>
          {storeStatus.showClosingTime && (
            <>
              <Clock size={14} className="text-gray-500" />
              <span className="text-gray-600">{storeStatus.closingTime}</span>
            </>
          )}
        </div>
      </div>

      {/* Banners de Alerta */}
      <div className="px-4 py-3 space-y-2">
        {/* Banner Entrega Grátis */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">
          <p className="text-sm text-green-800">
            <strong>Entrega Grátis</strong> para <strong>{city}</strong>!
          </p>
        </div>

        {/* Banner Promoção */}
        <div className="bg-purple-50 border-2 border-purple-500 rounded-lg px-4 py-3 text-center">
          <p className="text-sm text-purple-700">
            Aproveite nossa <strong>promoção com preços irresistíveis</strong> igual Açaí 💜
          </p>
        </div>
      </div>

      {/* Menu de navegação horizontal */}
      <div className="bg-white overflow-x-auto border-t border-gray-200">
        <div className="flex gap-1 px-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
