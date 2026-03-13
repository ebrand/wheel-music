"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStytchSession, StytchLogin } from "@stytch/nextjs";
import { Products } from "@stytch/vanilla-js";
import { Container } from "@/components/ui/Container";

export default function AdminLoginPage() {
  const { session, isInitialized } = useStytchSession();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && session) {
      router.replace("/admin");
    }
  }, [session, isInitialized, router]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <section className="py-16">
      <Container className="max-w-md">
        <h1 className="mb-8 text-center text-2xl font-bold">Admin Login</h1>
        <StytchLogin
          config={{
            products: [Products.emailMagicLinks],
            emailMagicLinksOptions: {
              loginRedirectURL: `${siteUrl}/admin/authenticate`,
              signupRedirectURL: `${siteUrl}/admin/authenticate`,
            },
          }}
          presentation={{
            theme: {
              "color-scheme": "dark",
              background: "#141414",
              foreground: "#ededed",
              primary: "#e63946",
              "primary-foreground": "#ffffff",
              border: "#2a2a2a",
              input: "#2a2a2a",
            },
          }}
        />
      </Container>
    </section>
  );
}
