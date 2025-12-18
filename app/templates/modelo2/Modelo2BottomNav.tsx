"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";

export default function Modelo2BottomNav() {
  const pathname = usePathname();
  const { items } = useCart();
  const hasItems = items.length > 0;

  return (
    <div className="bottomBar">
      <div className="contentBar">
        <Link href="/" className={pathname === "/" ? "active" : ""}>
          <div className="icon">
            <i className="fa-solid fa-house"></i>
          </div>
          <span>Cardápio</span>
        </Link>
        <Link href="/carrinho" className={pathname === "/carrinho" ? "active" : ""}>
          <div className="icon">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <span>Carrinho</span>
        </Link>
        {hasItems && (
          <Link href="/endereco" className={pathname === "/endereco" ? "active" : ""}>
            <div className="icon">
              <i className="fa-solid fa-check-circle"></i>
            </div>
            <span>Finalizar pedido</span>
          </Link>
        )}
      </div>
    </div>
  );
}
