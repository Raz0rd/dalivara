"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface ProductInfoProps {
  product: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="bg-white mb-4">
      <div className="relative">
        <div className="relative w-full h-48 bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
        <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg">
          <ChevronDown size={24} color="#D1D1D1" strokeWidth={2} />
        </button>
      </div>

      <div className="px-4 py-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-primary">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
              {product.discount && (
                <span className="bg-secondary text-white text-xs font-semibold px-2 py-1 rounded">
                  {product.discount}%
                </span>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
      </div>
    </div>
  );
}
