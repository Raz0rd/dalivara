import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Sertão Açaíteria",
  description: "Finalize seu pedido na Sertão Açaíteria",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
