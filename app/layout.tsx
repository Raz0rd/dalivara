import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { GOOGLE_ADS_CONFIG } from "@/config/googleAds";

export const metadata: Metadata = {
  title: "Nacional Açaí - O melhor açaí do mundo!",
  description: "Faça seu pedido online agora mesmo no Nacional Açaí!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Ads Global Tag */}
        {GOOGLE_ADS_CONFIG.enabled && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_CONFIG.accountId}`}
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GOOGLE_ADS_CONFIG.accountId}');
                `,
              }}
            />
          </>
        )}

        {/* Google tag (gtag.js) - AW-17719649597 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17719649597"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17719649597');
            `,
          }}
        />

        {/* Utmify Script */}
        <script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-key="LWfOv5LaL6ey76RTcCNCfgiKN1A2nDIwf57T"
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
      </head>
      <body>
        <UserProvider>
          <CartProvider>{children}</CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
