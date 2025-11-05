"use client";

import { Home, FileText, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-2xl mx-auto">
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
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500 hover:text-primary transition-colors"
          >
            <ShoppingCart size={24} strokeWidth={2} />
            <span className="text-xs font-medium">Carrinho</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
