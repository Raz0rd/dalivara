"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  badge?: string | null;
  highlight?: string;
  stock?: number;
}

interface FeaturedCarouselProps {
  products: Product[];
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  return (
    <div className="bg-white mb-2">
      <div className="px-4 py-3">
        <h2 className="text-lg font-bold text-gray-900">Destaque</h2>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className={`flex items-start gap-3 bg-white p-3 rounded-lg hover:shadow-md transition-shadow ${
              product.badge ? "border-2 border-green-600" : "border border-gray-200"
            }`}
          >
            {/* Imagem menor à esquerda */}
            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            </div>

            {/* Informações à direita */}
            <div className="flex-1 min-w-0">
              {/* Badge */}
              {product.badge && (
                <div className="mb-2">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                    {product.badge}
                  </span>
                </div>
              )}
              
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {product.name}
              </h3>
              
              {/* Description */}
              {product.description && (
                <p className="text-xs text-gray-600 mb-2">{product.description}</p>
              )}
              
              {/* Highlight */}
              {product.highlight && (
                <div className="bg-gray-100 text-gray-700 text-xs p-2 rounded mb-2">
                  <p>{product.highlight}</p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-primary">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                    {product.discount && (
                      <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discount}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Stock Alert */}
              {product.stock !== undefined && product.stock <= 5 && (
                <div className="mb-2 text-xs">
                  <span className="text-red-600 font-semibold">
                    🔥 Apenas <span className="bg-red-600 text-white px-1 rounded">{product.stock}</span> combo(s) com esse preço especial
                  </span>
                </div>
              )}

              {/* Indicador de clique */}
              <div className="text-xs text-gray-500 mt-2">
                Toque para ver opções →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
