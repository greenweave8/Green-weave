import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  updateCategory,
  deleteCategory,
} from "@/lib/db";
import type { Category } from "@/lib/types";
import { isAuthenticatedToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/categories/[id]">) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await request.json()) as Partial<Category>;
  const existing = await updateCategory(id, body);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ category: existing });
}

export async function DELETE(request: NextRequest, ctx: RouteContext<"/api/categories/[id]">) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const deleted = await deleteCategory(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Category has products or was not found" },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true });
}