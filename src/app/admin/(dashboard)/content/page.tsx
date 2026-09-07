import { getContent } from "@/lib/content";
import ContentManager from "@/components/admin/ContentManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Site content",
};

export default async function AdminContentPage() {
  const content = await getContent();
  return <ContentManager content={content} />;
}