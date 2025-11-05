"use client";

import { Clock } from "lucide-react";

interface DeliveryBannerProps {
  city: string;
  deliveryTime: string;
}

export default function DeliveryBanner({ city, deliveryTime }: DeliveryBannerProps) {
  return (
    <div className="bg-green-600 text-white py-2 px-4">
      <div className="flex items-center justify-center gap-2 text-xs">
        <Clock size={14} strokeWidth={2.5} />
        <span className="font-medium">
          Entrega pra <strong>{city}</strong>: Tempo aproximado de até{" "}
          <strong>{deliveryTime}</strong> minutos
        </span>
      </div>
    </div>
  );
}
