import type { Metadata } from "next";
import "./globals.css";
import "./social-proof.css";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { getCurrentTenant } from "@/lib/tenant";
import { GOOGLE_ADS_CONFIG } from "@/config/googleAds";
import UtmCapture from "@/components/UtmCapture";
import StructuredData from "@/components/StructuredData";
import PageTracking from "@/components/PageTracking";
import SocialProofNotifications from "@/components/SocialProofNotifications";
import { GoogleAdsConversionScript } from "@/components/GoogleAdsConversion";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getCurrentTenant();
  
  return {
    metadataBase: new URL(tenant.siteUrl),
    title: {
      default: `${tenant.storeName} - O melhor açaí do mundo! | Delivery`,
      template: `%s | ${tenant.storeName}`
    },
    description: tenant.siteDescription,
    keywords: ["açaí", "açai", "delivery açaí", "delivery açai", tenant.storeName.toLowerCase(), "açaí delivery", "açai delivery", "açaí online", "pedido açaí", "açaí zero", "açaí tradicional", "açaí perto de mim", "delivery de açaí"],
    authors: [{ name: tenant.storeName }],
    creator: tenant.storeName,
    publisher: tenant.storeName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: `${tenant.storeName} - O melhor açaí do mundo!`,
      description: tenant.siteDescription,
      url: tenant.siteUrl,
      siteName: tenant.storeName,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: tenant.ogImage,
          width: 1200,
          height: 630,
          alt: `${tenant.storeName} - Delivery`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tenant.storeName} - O melhor açaí do mundo!`,
      description: tenant.siteDescription,
      images: [tenant.ogImage],
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
    ...(tenant.googleVerification && {
      verification: {
        google: tenant.googleVerification,
      },
    }),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tenant = await getCurrentTenant();
  
  // Coletar todas as tags do Google Ads do tenant
  const googleAdsTags: string[] = [];
  
  if (tenant.googleAdsId) {
    googleAdsTags.push(tenant.googleAdsId);
  }
  if (tenant.googleAdsId1) {
    googleAdsTags.push(tenant.googleAdsId1);
  }
  if (tenant.googleAdsId2) {
    googleAdsTags.push(tenant.googleAdsId2);
  }
  
  const firstTag = googleAdsTags[0];
  const utmifyPixelId = tenant.utmifyPixelId || "691e5f8cd0a1fe99b32e1fd8";
  
  return (
    <html lang="pt-BR">
      <head>
        {/* Google tag (gtag.js) - Múltiplas tags do Google Ads */}
        {firstTag && (
          <>
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
                  
                  // Configurar todas as tags do Google Ads
                  ${googleAdsTags.map(tag => `gtag('config', '${tag}');`).join('\n                  ')}
                `,
              }}
            />
          </>
        )}

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
              window.googlePixelId = "${utmifyPixelId}";
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
        <TenantProvider tenant={tenant}>
          <GoogleAdsConversionScript />
          <UserProvider>
            <CartProvider>{children}</CartProvider>
          </UserProvider>
        </TenantProvider>
      </body>
    </html>
  );
}
