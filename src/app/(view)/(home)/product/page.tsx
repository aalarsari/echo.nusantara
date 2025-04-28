"use client";

import React, { useState, useEffect } from "react";
import { ProductController } from "@/controller/noAuth/product";
import {
  BannerItems,
  Benefits,
  CategoryItems,
  ProductItems,
} from "@/components/molecules";

interface BannerItem {
  id: number;
  path: string;
  subtitle: string;
  title: string;
  category: string;
}

interface CategoryItem {
  id: number;
  name: string;
  products: Products[];
  Description: string;
}

interface ProductItem {
  id: number;
  image1: string;
  name: string;
  slug: string;
  weight: number;
  priceIDR: number;
}

export default function Product() {
  const [bannerData, setBannerData] = useState<BannerItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryItem[] | null>(null);
  const [productData, setProductData] = useState<ProductItem[]>([]);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ProductController();
        if (response.ok) {
          const result = await response.json();
          setData(result?.data.data || {});
          setBannerData(result?.data.benner || []);
          setProductData(result?.data.product || []);
          const categoryItems = result?.data.category || [];
          const formattedCategoryData = categoryItems.map((item: any) => ({
            id: item.id,
            name: item.name,
            products: item.Products,
            Description: item.Description,
          }));
          setCategoryData(formattedCategoryData);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Banner */}
      <div className="h-[4rem] w-full" />
      <BannerItems bannerData={bannerData} />
      {/* Product */}
      <ProductItems productData={productData} />
      {/* Category */}
      <Benefits />
      <CategoryItems categoryData={categoryData} />
    </div>
  );
}
