"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Componente para rastrear pageviews em todas as rotas
 * Envia eventos para Google Ads e Utmify
 */
export default function PageTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Garantir que estamos no client-side
    if (typeof window === "undefined") return;

    // Construir URL completa
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    // Enviar pageview para Google Analytics/Ads via gtag
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "page_view", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      });
      console.log("📊 [Google Ads] Pageview enviado:", url);
    }

    // Enviar pageview para Utmify (se disponível)
    if ((window as any).utmify && typeof (window as any).utmify === "function") {
      try {
        (window as any).utmify("pageview", {
          page_path: url,
          page_title: document.title,
          page_location: window.location.href,
          timestamp: new Date().toISOString(),
        });
        console.log("📊 [Utmify] Pageview enviado:", url);
      } catch (error) {
        console.warn("⚠️ [Utmify] Erro ao enviar pageview:", error);
      }
    }

    // Identificar páginas importantes e enviar eventos específicos
    const pageEvents: Record<string, string> = {
      "/": "view_home",
      "/carrinho": "view_cart",
      "/checkout": "begin_checkout",
      "/checkout/endereco": "add_shipping_info",
      "/checkout/resumo": "view_checkout_summary",
      "/ifoodpay": "add_payment_info",
      "/pedidos": "view_orders",
    };

    // Páginas de produto
    if (pathname.startsWith("/product/")) {
      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "view_item", {
          page_path: url,
        });
        console.log("📊 [Google Ads] Evento view_item enviado");
      }
    }

    // Enviar evento específico da página
    const eventName = pageEvents[pathname];
    if (eventName && typeof (window as any).gtag === "function") {
      (window as any).gtag("event", eventName, {
        page_path: url,
      });
      console.log(`📊 [Google Ads] Evento ${eventName} enviado`);
    }
  }, [pathname, searchParams]);

  return null; // Componente invisível
}
