import { ProductDetail } from "@/components";
import prisma from "@/database/prisma";

export async function generateStaticParams() {
  var product = await prisma.products.findMany({
    select: {
      slug: true,
    },
  });
  return product.map((product) => ({
    slug: product.slug.toString(),
  }));
}

export default function TugasDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params.slug || typeof params.slug !== "string") {
    return <div>Error: Invalid User slug</div>;
  }
  return <ProductDetail slug={params.slug} />;
}
