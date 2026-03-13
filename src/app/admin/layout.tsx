import { Metadata } from "next";
import { StytchProviderWrapper } from "@/components/admin/StytchProviderWrapper";

export const metadata: Metadata = {
  title: "Admin | Wheel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StytchProviderWrapper>{children}</StytchProviderWrapper>;
}
