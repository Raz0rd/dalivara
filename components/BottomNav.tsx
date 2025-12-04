"use client";

import { Home, FileText, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function BottomNav() {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-4 py-2 text-primary"
          >
            <Home size={24} strokeWidth={2} />
            <span className="text-xs font-medium">Início</span>
          </Link>

          <Link
            href="/pedidos"
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500 hover:text-primary transition-colors"
          >
            <FileText size={24} strokeWidth={2} />
            <span className="text-xs font-medium">Pedidos</span>
          </Link>

          <Link
            href="/carrinho"
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500 hover:text-primary transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart size={24} strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">Carrinho</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
