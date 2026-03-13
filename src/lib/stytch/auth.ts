import { cookies } from "next/headers";
import { getStytchClient } from "./server";

const ADMIN_ROLE = "website_admin";

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
    const { user } = await stytch.sessions.authenticate({
      session_token: sessionToken,
    });

    const email = user.emails?.[0]?.email;

    if (!user.roles?.includes(ADMIN_ROLE)) {
      return { authenticated: false };
    }

    return { authenticated: true, email };
  } catch {
    return { authenticated: false };
  }
}
