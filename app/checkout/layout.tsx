import type { Metadata } from "next";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Nacional Açaí';

export const metadata: Metadata = {
  title: `Checkout - ${storeName}`,
  description: `Finalize seu pedido na ${storeName}`,
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
