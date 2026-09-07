import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/paths";
import { syncFileToGit } from "@/lib/gitsync";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/content-data";

export { DEFAULT_CONTENT };
export type { SiteContent };

const CONTENT_FILE = path.join(DATA_DIR, "content.json");

async function readContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const saved = JSON.parse(raw) as SiteContent;
    return { ...DEFAULT_CONTENT, ...saved };
  } catch {
    return { ...DEFAULT_CONTENT };
  }
}

export async function getContent(): Promise<SiteContent> {
  return readContent();
}

export async function updateContent(
  patch: SiteContent
): Promise<{ saved: SiteContent; pushed: boolean }> {
  const current = await readContent();
  const next: SiteContent = { ...current, ...patch };
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTENT_FILE, JSON.stringify(next, null, 2), "utf8");
  const pushed = syncFileToGit(
    "data/content.json",
    "Update site content (admin edit)"
  );
  return { saved: next, pushed };
}