import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { UPLOADS_DIR } from "@/lib/paths";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ file: string[] }> }
) {
  const { file } = await ctx.params;
  const filename = Array.isArray(file) ? file.join("/") : file;
  const safe = path.basename(filename);

  const ext = path.extname(safe).toLowerCase();
  const mime =
    ext === ".png"
      ? "image/png"
      : ext === ".svg"
      ? "image/svg+xml"
      : ext === ".webp"
      ? "image/webp"
      : "image/jpeg";

  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, safe));
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}