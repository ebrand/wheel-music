import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wheel | Tenacious Power Pop",
  description:
    "Tenacious power pop from Austin, Texas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            opacity: 0.05,
            backgroundImage: "url('/images/psyback.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative z-10">
          <Header />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
