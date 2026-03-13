"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStytchSession } from "@stytch/nextjs";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isInitialized } = useStytchSession();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !session) {
      router.replace("/admin/login");
    }
  }, [session, isInitialized, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
