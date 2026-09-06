import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { uid } from "@/lib/format";
import { isAuthenticatedToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isAuthenticatedToken(request.cookies.get("gw_admin")?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const dataUrl = String(body.dataUrl ?? "");
  if (!dataUrl.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "Provide a valid image data URL" },
      { status: 400 }
    );
  }

  const match = dataUrl.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json(
      { error: "Invalid image data" },
      { status: 400 }
    );
  }

  const mime = match[1];
  const ext = mime.includes("png") ? "png" : mime.includes("svg") ? "svg" : "jpg";
  const filename = `${uid("img")}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "data", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(
    path.join(uploadsDir, filename),
    Buffer.from(match[2], "base64")
  );

  return NextResponse.json({ url: `/uploads/${filename}` });
}