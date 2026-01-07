"use client";

import { useTenant } from "@/contexts/TenantContext";

export default function StructuredData() {
  const tenant = useTenant();
  const storeName = tenant.storeName;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": storeName,
    "description": "Açaí de qualidade com entrega rápida. Combos, milkshakes, delícias e bebidas.",
    "url": "http://presentedenatalantecipado.shop",
    "logo": "http://presentedenatalantecipado.shop/logo.png",
    "image": "http://presentedenatalantecipado.shop/og-image.jpg",
    "telephone": "+55-34-99999-9999",
    "priceRange": "$$",
    "servesCuisine": "Açaí",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressLocality": "Brasil"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -19.9167,
      "longitude": -43.9345
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "10:00",
        "closes": "22:00"
      }
    ],
    "hasMenu": {
      "@type": "Menu",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Combos",
          "description": "Combos de açaí com diversos tamanhos e complementos"
        },
        {
          "@type": "MenuSection",
          "name": "Delícias",
          "description": "Sobremesas e delícias especiais"
        },
        {
          "@type": "MenuSection",
          "name": "Milkshakes",
          "description": "Milkshakes de diversos sabores"
        },
        {
          "@type": "MenuSection",
          "name": "Bebidas",
          "description": "Bebidas variadas"
        }
      ]
    },
    "potentialAction": {
      "@type": "OrderAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "http://presentedenatalantecipado.shop",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "deliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModeDirectDownload"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "250",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "http://presentedenatalantecipado.shop"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Produtos",
        "item": "http://presentedenatalantecipado.shop/#produtos"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Carrinho",
        "item": "http://presentedenatalantecipado.shop/carrinho"
      }
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": storeName,
    "url": "http://presentedenatalantecipado.shop",
    "logo": "http://presentedenatalantecipado.shop/logo.png",
    "description": "Delivery de açaí de qualidade",
    "sameAs": [
      "https://www.instagram.com/nacionalacai",
      "https://www.facebook.com/nacionalacai"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-34-99999-9999",
      "contactType": "customer service",
      "availableLanguage": ["Portuguese"]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
}
