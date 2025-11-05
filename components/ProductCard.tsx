"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
  };
  size?: "small" | "large";
}

export default function ProductCard({ product, size = "large" }: ProductCardProps) {
  const isSmall = size === "small";

  return (
    <Link
      href={`/product/${product.id}`}
      className="block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className={`relative ${isSmall ? "h-32" : "h-40"} bg-gray-100`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes={isSmall ? "150px" : "300px"}
        />
      </div>

      <div className="p-3">
        <h3 className={`font-semibold text-gray-900 mb-1 ${isSmall ? "text-sm" : "text-base"}`}>
          {product.name}
        </h3>

        {product.description && !isSmall && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center gap-2">
          <span className={`font-bold text-primary ${isSmall ? "text-base" : "text-lg"}`}>
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>

          {product.originalPrice && (
            <>
              <span className="text-xs text-gray-500 line-through">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
              {product.discount && (
                <span className="bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded">
                  {product.discount}%
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
