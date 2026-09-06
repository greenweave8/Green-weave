import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  findUserByEmail,
  sanitizeUser,
  verifyPassword,
  signSession,
  sessionCookieOptions,
  COOKIE_NAME,
} from "@/lib/user";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  const store = await cookies();
  store.set(COOKIE_NAME, signSession(user.id), sessionCookieOptions());
  return NextResponse.json({ user: sanitizeUser(user) });
}