import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createUser, sanitizeUser, signSession, sessionCookieOptions, COOKIE_NAME } from "@/lib/user";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  try {
    const user = await createUser({ name, email, password });
    const store = await cookies();
    store.set(COOKIE_NAME, signSession(user.id), sessionCookieOptions());
    return NextResponse.json({ user: sanitizeUser(user) }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not create your account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}