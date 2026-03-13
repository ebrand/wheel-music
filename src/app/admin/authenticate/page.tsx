"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStytch, useStytchSession } from "@stytch/nextjs";
import { Container } from "@/components/ui/Container";

export default function AuthenticatePage() {
  const stytch = useStytch();
  const { session } = useStytchSession();
  const router = useRouter();
  const attempted = useRef(false);

  useEffect(() => {
    if (session) {
      router.replace("/admin");
      return;
    }

    if (attempted.current) return;
    attempted.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const type = params.get("stytch_token_type");

    if (token && type === "magic_links") {
      stytch.magicLinks
        .authenticate(token, {
          session_duration_minutes: 60 * 24,
        })
        .then(() => {
          router.replace("/admin");
        })
        .catch(() => {
          router.replace("/admin/login");
        });
    } else {
      router.replace("/admin/login");
    }
  }, [stytch, session, router]);

  return (
    <section className="py-16">
      <Container className="text-center">
        <p className="text-muted">Authenticating...</p>
      </Container>
    </section>
  );
}
