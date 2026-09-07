import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticatedToken } from "@/lib/auth";
import { updateContent, DEFAULT_CONTENT, type SiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const patch: SiteContent = {};
  for (const [key, value] of Object.entries(body)) {
    if (key in DEFAULT_CONTENT && typeof value === "string") {
      patch[key] = value;
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { error: "No valid content fields provided." },
      { status: 400 }
    );
  }

  const { saved, pushed } = await updateContent(patch);
  return NextResponse.json({ ok: true, pushed, saved });
}