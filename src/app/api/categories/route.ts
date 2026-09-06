import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCategories, insertCategory } from "@/lib/db";
import type { Category } from "@/lib/types";
import { uid, slugify } from "@/lib/format";
import { isAuthenticatedToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Category>;
  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const category: Category = {
    id: uid("c"),
    name,
    slug: slugify(name),
    description: body.description?.trim() || "",
  };

  await insertCategory(category);
  return NextResponse.json({ category }, { status: 201 });
}