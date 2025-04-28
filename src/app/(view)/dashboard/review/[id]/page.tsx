"use client";

import React, { useEffect, useState } from "react";
import { Review } from "@prisma/client";
import { GetDetailReview } from "@/controller/admin/review";

export default function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [reviewDetail, setReviewDetail] = useState<Review | null>(null);

  useEffect(() => {
    const fetchReview = async (id: string) => {
      try {
        const res = await GetDetailReview(parseInt(params.id));
        const body = await res.json();
        setReviewDetail(body.data);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };
    fetchReview(params.id);
    return () => {};
  }, [params.id]);

  return <main className="h-full w-full px-4 pt-16 lg:px-12 lg:py-20">1</main>;
}
