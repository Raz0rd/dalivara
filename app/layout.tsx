import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { GOOGLE_ADS_CONFIG } from "@/config/googleAds";
import UtmCapture from "@/components/UtmCapture";
import StructuredData from "@/components/StructuredData";
import PageTracking from "@/components/PageTracking";

export const metadata: Metadata = {
  metadataBase: new URL('http://presentedenatalantecipado.shop'),
  title: {
    default: "Sertão Açaíteria - O melhor açaí do mundo! | Delivery",
    template: "%s | Sertão Açaíteria"
  },
  description: "Faça seu pedido online agora mesmo na Sertão Açaíteria! Açaí de qualidade, entrega rápida. Combos, milkshakes, delícias e bebidas. Peça já!",
  keywords: ["açaí", "açai", "delivery", "sertão açaíteria", "açaí delivery", "açai delivery", "milkshake", "açaí online", "pedido açaí", "açaí zero", "açaí tradicional"],
  authors: [{ name: "Sertão Açaíteria" }],
  creator: "Sertão Açaíteria",
  publisher: "Sertão Açaíteria",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Sertão Açaíteria - O melhor açaí do mundo!",
    description: "Faça seu pedido online agora mesmo na Sertão Açaíteria! Açaí de qualidade, entrega rápida.",
    url: "http://presentedenatalantecipado.shop",
    siteName: "Sertão Açaíteria",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nacional Açaí - Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sertão Açaíteria - O melhor açaí do mundo!",
    description: "Faça seu pedido online agora mesmo na Sertão Açaíteria!",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Adicione seu código de verificação do Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google tag (gtag.js) - AW-17719649597 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17719649597"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);};
              gtag('js', new Date());
              gtag('config', 'AW-17719649597');
            `,
          }}
        />

        {/* Utmify Script */}
        <script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck
          data-utmify-prevent-subids
          async
          defer
        ></script>

        {/* Utmify Google Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.googlePixelId = "691e5f8cd0a1fe99b32e1fd8";
              var a = document.createElement("script");
              a.setAttribute("async", "");
              a.setAttribute("defer", "");
              a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel-google.js");
              document.head.appendChild(a);
            `,
          }}
        />
        <StructuredData />
      </head>
      <body>
        <UtmCapture />
        <PageTracking />
        <UserProvider>
          <CartProvider>{children}</CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
