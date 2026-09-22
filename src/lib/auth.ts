import "server-only";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/paths";
import { hashPassword, verifyPassword } from "@/lib/user";

const ENV_PASSWORD = process.env.ADMIN_PASSWORD || "greenweave2026";
const COOKIE_NAME = "gw_admin";
const COOKIE_VALUE = "authenticated";
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

async function getStoredHash(): Promise<string | null> {
  try {
    const raw = await fs.readFile(ADMIN_FILE, "utf8");
    const saved = JSON.parse(raw) as { passwordHash?: string };
    return saved.passwordHash ?? null;
  } catch {
    return null;
  }
}

export async function adminPasswordMatches(password: string): Promise<boolean> {
  const stored = await getStoredHash();
  if (stored) return verifyPassword(password, stored);
  return password === ENV_PASSWORD;
}

export async function changeAdminPassword(password: string): Promise<boolean> {
  try {
    const passwordHash = await hashPassword(password);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      ADMIN_FILE,
      JSON.stringify({ passwordHash }, null, 2),
      "utf8"
    );
    return true;
  } catch (err) {
    console.error("[auth] Could not save admin password:", err);
    return false;
  }
}

export async function signIn(password: string): Promise<boolean> {
  if (!(await adminPasswordMatches(password))) return false;
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