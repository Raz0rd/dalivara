"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Modelo2BottomNav() {
  const pathname = usePathname();

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
        <Link href="#">
          <div className="icon">
            <i className="fa-solid fa-right-to-bracket"></i>
          </div>
          <span>Entrar</span>
        </Link>
      </div>
    </div>
  );
}
