import "server-only";
import { cookies } from "next/headers";

const PASSWORD = process.env.ADMIN_PASSWORD || "greenweave2026";
const COOKIE_NAME = "gw_admin";
const COOKIE_VALUE = "authenticated";

export async function signIn(password: string): Promise<boolean> {
  if (password !== PASSWORD) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return true;
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export function isAuthenticatedToken(token: string | undefined): boolean {
  return token === COOKIE_VALUE;
}