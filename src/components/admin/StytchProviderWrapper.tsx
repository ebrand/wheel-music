"use client";

import { StytchProvider, createStytchClient } from "@stytch/nextjs";

const stytch = createStytchClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ""
);

export function StytchProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StytchProvider stytch={stytch}>{children}</StytchProvider>;
}
