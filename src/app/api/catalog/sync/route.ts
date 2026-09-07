import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticatedToken } from "@/lib/auth";
import { getSyncStatus, syncCatalogToGit } from "@/lib/gitsync";

export const dynamic = "force-dynamic";

const CATALOG_PATH = "data/catalog.json";

export async function GET(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getSyncStatus(CATALOG_PATH));
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pushed = syncCatalogToGit();
  const { pending } = getSyncStatus(CATALOG_PATH);
  return NextResponse.json({ pushed, pending });
}