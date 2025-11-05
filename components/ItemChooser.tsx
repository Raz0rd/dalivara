"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";

interface ItemChooserProps {
  item: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
  };
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxReached?: boolean;
}

export default function ItemChooser({
  item,
  quantity,
  onQuantityChange,
  maxReached = false,
}: ItemChooserProps) {
  const handleIncrement = () => {
    if (!maxReached) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
        {item.description && (
          <p className="text-xs text-gray-500 truncate">{item.description}</p>
        )}
        {item.price > 0 && (
          <p className="text-sm font-semibold text-primary mt-1">
            + R$ {item.price.toFixed(2).replace(".", ",")}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {quantity > 0 && (
          <>
            <button
              onClick={handleDecrement}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus size={20} color="#808080" strokeWidth={3} />
            </button>
            <span className="text-sm font-semibold text-gray-900 w-6 text-center">
              {quantity}
            </span>
          </>
        )}
        <button
          onClick={handleIncrement}
          disabled={maxReached && quantity === 0}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            maxReached && quantity === 0
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-primary/10 hover:bg-primary/20"
          }`}
          aria-label="Aumentar quantidade"
        >
          <Plus
            size={20}
            color={maxReached && quantity === 0 ? "#808080" : "#8C14FF"}
            strokeWidth={3}
          />
        </button>
      </div>
    </div>
  );
}
