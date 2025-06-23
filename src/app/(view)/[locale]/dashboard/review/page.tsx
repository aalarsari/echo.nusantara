"use client";

import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/atoms";
import { useEffect, useState } from "react";
import { GetListReview } from "@/controller/admin/review";
import { Assets } from "@/assets";
import Image from "next/image";
import { Review as ReviewUser } from "@prisma/client";
import StarRatings from "react-star-ratings";

export default function Review() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddReview = () => {
    router.push("/dashboard/review/create");
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await GetListReview("desc");
        const result = await response.json();
        const review = result.data.review;
        setReviews(review);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <main className="flex h-full w-full flex-col gap-2">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-domaine text-[20px] text-[#252525]">All Review</h2>
        <div className="flex items-center gap-2">
          <ButtonPrimary
            width="w-[9.5rem]"
            height="h-[2.5rem]"
            text="Add Review"
            onClick={handleAddReview}
          />
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-[#B69B7C]/[12%]">
            <tr>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                No
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Name
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Title
              </th>
              <th className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Rate
              </th>
              {/* <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                View
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {reviews.map((review, index) => (
              <tr key={review.id}>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {review.name}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {review.title}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  <StarRatings
                    rating={review.rate || 0}
                    starRatedColor="orange"
                    starEmptyColor="lightgray"
                    numberOfStars={5}
                    name="rating"
                    starDimension="24px"
                    starSpacing="5px"
                  />
                </td>
                {/* <td className="flex max-w-xs items-center justify-center gap-6 overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  <button
                    className="relative h-6 w-6"
                    onClick={() =>
                      router.push(`/dashboard/review/${review.id}`)
                    }
                  >
                    <Image
                      src={Assets.IconEye}
                      alt="View"
                      fill
                      style={{ position: "absolute" }}
                    />
                  </button>
                  <button className="relative h-6 w-6">
                    <Image
                      src={Assets.IconTrash}
                      alt="Delete"
                      fill
                      style={{ position: "absolute" }}
                    />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
