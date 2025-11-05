"use client";

import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
}

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  highlight?: boolean;
  columns?: 1 | 2;
  promo?: boolean;
}

export default function CategorySection({
  title,
  subtitle,
  products,
  highlight = false,
  columns = 1,
  promo = false,
}: CategorySectionProps) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <h2 className={`text-xl font-bold ${promo ? 'text-primary' : 'text-gray-900'}`}>{title}</h2>
        {subtitle && (
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            promo ? 'bg-primary text-white' : 'text-primary'
          } uppercase`}>
            {subtitle}
          </span>
        )}
      </div>

      <div
        className={`grid gap-4 ${
          columns === 2 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            size={columns === 2 ? "small" : "large"}
          />
        ))}
      </div>
    </section>
  );
}
