import { redirect } from "next/navigation";

export const metadata = { title: "Merch | Wheel" };

export default function MerchPage() {
  redirect("https://wheel-band.myshopify.com");
}
