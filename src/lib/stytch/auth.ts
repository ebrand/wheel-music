import { cookies } from "next/headers";
import { getStytchClient } from "./server";

const ADMIN_EMAILS = [
  "eric.d.brand@gmail.com",
  "mccarthy.kevin66@gmail.com",
  "hobratschk@gmail.com"
];

export async function validateAdminSession(): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("stytch_session")?.value;

    if (!sessionToken) {
      return { authenticated: false };
    }

    const stytch = getStytchClient();
    const { session } = await stytch.sessions.authenticate({
      session_token: sessionToken,
    });

    const email =
      session.authentication_factors?.[0]?.email_factor?.email_address;

    if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
      return { authenticated: false };
    }

    return { authenticated: true, email };
  } catch {
    return { authenticated: false };
  }
}
