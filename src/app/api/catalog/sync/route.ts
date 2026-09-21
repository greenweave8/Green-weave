import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticatedToken } from "@/lib/auth";
import { getCatalogSyncStatus, syncCatalogToGit } from "@/lib/gitsync";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getCatalogSyncStatus());
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pushed = syncCatalogToGit();
  const { pending } = getCatalogSyncStatus();
  return NextResponse.json({ pushed, pending });
}