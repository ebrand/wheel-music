import * as stytch from "stytch";

let client: stytch.Client | null = null;

export function getStytchClient(): stytch.Client {
  if (!client) {
    client = new stytch.Client({
      project_id: process.env.STYTCH_PROJECT_ID || "",
      secret: process.env.STYTCH_SECRET || "",
    });
  }
  return client;
}
