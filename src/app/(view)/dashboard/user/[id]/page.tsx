import { UserDetail } from "@/components";
import prisma from "@/database/prisma";

// export async function generateStaticParams() {
//   var user = await prisma.user.findMany({
//     select: {
//       id: true,
//     },
//   });
//   return user.map((user) => ({
//     id: user.id.toString(),
//   }));
// }

export default function UserDetailPage({ params }: { params: { id: string } }) {
  if (!params.id || typeof params.id !== "string") {
    return <div>Error: Invalid User id</div>;
  }
  return <UserDetail id={parseInt(params.id)} />;
}
