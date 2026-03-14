import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createPublicServerClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wheel | Tenacious Power Pop",
  description:
    "Tenacious power pop from Austin, Texas.",
};

const backgrounds = [
  "/images/psyback.jpeg",
  "/images/backgrounds/back1.jpg",
  "/images/backgrounds/back2.jpeg",
  "/images/backgrounds/back3.jpg",
  "/images/backgrounds/back4.jpg",
  "/images/backgrounds/back5.jpg",
  "/images/backgrounds/back6.jpg",
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createPublicServerClient();
  const { data } = await supabase
    .from("band_info")
    .select("value")
    .eq("key", "show_background")
    .single();

  const showBackground = data?.value !== "false";
  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {showBackground && (
          <div
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              opacity: 0.05,
              backgroundImage: `url('${bg}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
        <div className="relative z-10">
          <Header />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
