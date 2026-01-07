"use client";

import { useState, useEffect } from "react";
import { Instagram, Info, Coins, Bike, MapPin, Star, Circle, Clock } from "lucide-react";
import CompanyInfoModal from "./CompanyInfoModal";
import { useTenant } from "@/contexts/TenantContext";

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
  deliveryTime = "10-20",
  activeTab = "combos",
  onTabChange 
}: StoreInfoProps) {
  const tenant = useTenant();
  const [storeStatus, setStoreStatus] = useState({
    isOpen: true,
    closingTime: "",
    showClosingTime: false,
  });
  const [showInfoModal, setShowInfoModal] = useState(false);

  const tabs = [
    { id: "combos", label: "Combos", icon: "🥡" },
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
          <h1 className="text-xl font-bold text-gray-900">{process.env.NEXT_PUBLIC_STORE_NAME || 'Nacional Açaí'}</h1>
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
              onClick={() => setShowInfoModal(true)}
              className="text-gray-600 hover:text-primary transition-colors"
              aria-label="Informações"
            >
              <Info size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Modal de Informações */}
        <CompanyInfoModal
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />

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
        <div className="rounded-lg px-4 py-3 text-center" style={{
          backgroundColor: `${tenant.primaryColor}10`,
          border: `2px solid ${tenant.primaryColor}`
        }}>
          <p className="text-sm" style={{ color: tenant.primaryColor }}>
            Aproveite nossa <strong>promoção com preços irresistíveis</strong> igual Açaí 💜
          </p>
        </div>
      </div>

      {/* Menu de navegação horizontal */}
      <div className="bg-white overflow-x-auto border-t border-gray-200">
        <div className="flex gap-2 px-2 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 transform"
              style={activeTab === tab.id ? {
                background: `linear-gradient(to right, ${tenant.primaryColor}, ${tenant.primaryColor}dd)`,
                color: 'white',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transform: 'scale(1.05)'
              } : {
                backgroundColor: '#f3f4f6',
                color: '#374151'
              }}
            >
              <span className={`text-lg ${activeTab === tab.id ? "animate-bounce" : ""}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
