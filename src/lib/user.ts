import "server-only";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { NextRequest } from "next/server";
import { uid } from "@/lib/format";
import { DATA_DIR } from "@/lib/paths";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const USERS_FILE = path.join(DATA_DIR, "users.json");
const COOKIE_NAME = "gw_user";
const SESSION_SECRET =
  process.env.USER_SESSION_SECRET || "greenweave-user-session-secret";
const SESSION_DAYS = 30;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(raw) as User[];
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), "utf8");
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function scryptHash(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const hash = await scryptHash(password, salt);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const hash = await scryptHash(password, salt);
  const expected = Buffer.from(hashHex, "hex");
  return (
    hash.length === expected.length && crypto.timingSafeEqual(hash, expected)
  );
}

export function sanitizeUser(user: User): PublicUser {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await readUsers();
  const normalized = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalized);
  return user ? clone(user) : null;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const users = await readUsers();
  const normalized = input.email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) {
    throw new Error("An account with this email already exists.");
  }
  const user: User = {
    id: uid("USR"),
    name: input.name.trim(),
    email: normalized,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeUsers(users);
  return clone(user);
}

function b64url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function unb64url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function signSession(userId: string): string {
  const payload = b64url(
    JSON.stringify({ uid: userId, exp: Date.now() + SESSION_DAYS * 86400_000 })
  );
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(unb64url(payload)) as { uid?: string; exp?: number };
    if (!data.uid || typeof data.exp !== "number" || data.exp < Date.now()) {
      return null;
    }
    return data.uid;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<{ token: string; user: PublicUser } | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const userId = verifySession(token);
  if (!userId || !token) return null;
  const users = await readUsers();
  const user = users.find((u) => u.id === userId);
  return user ? { token, user: sanitizeUser(user) } : null;
}

export async function getSessionUserFromRequest(
  request: NextRequest
): Promise<PublicUser | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const userId = verifySession(token);
  if (!userId) return null;
  const users = await readUsers();
  const user = users.find((u) => u.id === userId);
  return user ? sanitizeUser(user) : null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export { COOKIE_NAME };