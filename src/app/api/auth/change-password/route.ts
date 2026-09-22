import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  adminPasswordMatches,
  changeAdminPassword,
  isAuthenticatedToken,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const oldPassword = String(body.oldPassword ?? "");
  const newPassword = String(body.newPassword ?? "");

  if (!oldPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current and new password are both required." },
      { status: 400 }
    );
  }
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }
  if (oldPassword === newPassword) {
    return NextResponse.json(
      { error: "New password must be different from the current one." },
      { status: 400 }
    );
  }

  if (!(await adminPasswordMatches(oldPassword))) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 401 }
    );
  }

  const ok = await changeAdminPassword(newPassword);
  if (!ok) {
    return NextResponse.json(
      { error: "Could not update the password. Try again." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}