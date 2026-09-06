import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { UserProvider } from "@/components/auth/UserProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Greenweave — Clothes that heal the Earth",
    template: "%s | Greenweave",
  },
  description:
    "Ethical, sustainable clothing made from organic and recycled fibres. Organic cotton, hemp, ocean plastic and more. Pay by scanning a UPI QR code.",
  icons: {
    icon: "/greenweave-logo.jpeg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-ink selection:bg-seafoam selection:text-forest-dark">
        <CartProvider>
          <UserProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}