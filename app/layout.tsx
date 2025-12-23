import type { Metadata } from "next";
import "./globals.css";
import "./social-proof.css";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { GOOGLE_ADS_CONFIG } from "@/config/googleAds";
import UtmCapture from "@/components/UtmCapture";
import StructuredData from "@/components/StructuredData";
import PageTracking from "@/components/PageTracking";
import SocialProofNotifications from "@/components/SocialProofNotifications";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Nacional Açaí';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || `Faça seu pedido de açaí online agora mesmo na ${storeName}! Açaí de qualidade, entrega rápida e grátis. Combos e delícias. Peça já!`;
const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || '/og-image.jpg';
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${storeName} - O melhor açaí do mundo! | Delivery`,
    template: `%s | ${storeName}`
  },
  description: siteDescription,
  keywords: ["açaí", "açai", "delivery açaí", "delivery açai", storeName.toLowerCase(), "açaí delivery", "açai delivery", "açaí online", "pedido açaí", "açaí zero", "açaí tradicional", "açaí perto de mim", "delivery de açaí"],
  authors: [{ name: storeName }],
  creator: storeName,
  publisher: storeName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: `${storeName} - O melhor açaí do mundo!`,
    description: siteDescription,
    url: siteUrl,
    siteName: storeName,
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${storeName} - Delivery`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${storeName} - O melhor açaí do mundo!`,
    description: siteDescription,
    images: [ogImage],
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
  ...(googleVerification && {
    verification: {
      google: googleVerification,
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Coletar todas as tags do Google Ads do .env
  const googleAdsTags: string[] = [];
  let index = 1;
  
  // Verificar NEXT_PUBLIC_GOOGLE_ADS_ACCOUNT_ID (sem número - tag principal)
  const mainTag = process.env.NEXT_PUBLIC_GOOGLE_ADS_ACCOUNT_ID;
  if (mainTag) {
    googleAdsTags.push(mainTag);
  }
  
  // Verificar NEXT_PUBLIC_GOOGLE_ADS_ACCOUNT_ID1, ID2, ID3, etc
  while (true) {
    const tagKey = `NEXT_PUBLIC_GOOGLE_ADS_ACCOUNT_ID${index}`;
    const tag = process.env[tagKey as keyof typeof process.env];
    if (!tag) break;
    googleAdsTags.push(tag);
    index++;
  }
  
  // Se não encontrou nenhuma tag, não adicionar nenhuma (deve estar configurado no .env.local)
  if (googleAdsTags.length === 0) {
    console.warn('⚠️ [Google Ads] Nenhuma tag configurada no .env.local');
  }
  
  const firstTag = googleAdsTags[0];
  
  return (
    <html lang="pt-BR">
      <head>
        {/* Google tag (gtag.js) - Múltiplas tags do Google Ads */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${firstTag}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);};
              gtag('js', new Date());
              
              // Configurar todas as tags do Google Ads do .env
              ${googleAdsTags.map(tag => `gtag('config', '${tag}');`).join('\n              ')}
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
        <SocialProofNotifications />
        <UserProvider>
          <CartProvider>{children}</CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
