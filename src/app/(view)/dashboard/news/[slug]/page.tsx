import { BlogDetail } from "@/components";
export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params.slug || typeof params.slug !== "string") {
    return <div>Error: Invalid User slug</div>;
  }
  return <BlogDetail slug={params.slug} />;
}
