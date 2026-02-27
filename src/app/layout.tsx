import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { LoadingScreen } from "@/components/ui-custom/loading-screen";

export const metadata: Metadata = {
  title: "Adalagi | Luxury Perfume House",
  description: "Discover the art of perfumery with Adalagi. Crafting timeless elegance since 2020. Premium niche fragrances for the discerning connoisseur.",
  keywords: ["luxury perfume", "niche fragrance", "oud perfume", "designer perfume", "premium fragrance"],
  authors: [{ name: "Adalagi" }],
  openGraph: {
    title: "Adalagi | Luxury Perfume House",
    description: "Discover the art of perfumery with Adalagi",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <LoadingScreen />
        <main className="min-h-screen">
          {children}
        </main>
        <CartDrawer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
