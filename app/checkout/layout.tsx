import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Nacional Açaí",
  description: "Finalize seu pedido no Nacional Açaí",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
