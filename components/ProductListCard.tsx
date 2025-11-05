"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

interface ProductListCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    image: string;
  };
}

export default function ProductListCard({ product }: ProductListCardProps) {
  const router = useRouter();
  const { addItem } = useCart();

  // IDs que têm página de customização (combos e copos)
  const hasCustomizationPage = ["1", "2", "3", "4", "destaque-1", "destaque-2", "destaque-3"].includes(product.id);

  const handleClick = (e: React.MouseEvent) => {
    // Se não tem página de customização, adiciona direto ao carrinho
    if (!hasCustomizationPage) {
      e.preventDefault();
      addItem({
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      router.push("/carrinho");
    }
  };

  return (
    <Link
      href={hasCustomizationPage ? `/product/${product.id}` : "#"}
      onClick={handleClick}
      className="flex items-center gap-3 bg-white p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>

        {product.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center gap-2">
          <span className="font-bold text-primary text-base">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>

          {product.originalPrice && (
            <>
              <span className="text-xs text-gray-500 line-through">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
              {product.discount && (
                <span className="bg-primary text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                  {product.discount}%
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
    </Link>
  );
}
