import { BannerDetail } from "@/components/organisms/BannerDetail";

export default function BannerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id || typeof params.id !== "string") {
    return <div>Error: Invalid User id</div>;
  }
  return <BannerDetail id={params.id} />;
}
