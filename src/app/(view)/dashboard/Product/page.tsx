"use client";

import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/atoms";
import { useEffect, useState } from "react";
import { ListProductAdmin, DeleteProduct } from "@/controller/admin/product";
import { Products } from "@prisma/client";
import { Assets } from "@/assets";
import Image from "next/image";
import moment from "moment";

export default function Product() {
  const router = useRouter();
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("name");
  const [orderDirection, setOrderDirection] = useState<string>("asc");

  const handleAddProduct = () => {
    router.push("/dashboard/product/create");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ListProductAdmin(
          page,
          pageSize,
          searchQuery,
          orderDirection,
          orderBy,
        );
        const result = await response.json();
        const { products, productTotal } = result.data;
        setProducts(products);
        setTotalPages(Math.ceil(productTotal / pageSize));
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize, searchQuery, orderBy, orderDirection]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOrderBy = (field: string) => {
    if (orderBy === field) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrderDirection("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(page - Math.floor(maxPageNumbersToShow / 2), 1);
    let endPage = startPage + maxPageNumbersToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`h-10 w-10 rounded-full ${
            page === i
              ? "bg-[#B69B7C]/[12%] text-[#C1AE94]"
              : "bg-white text-[#C1AE94]"
          }`}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  const handleDelete = async (slug: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (confirmed) {
      try {
        const response = await DeleteProduct(slug);
        if (response.ok) {
          setProducts(products.filter((product) => product.slug !== slug));
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        alert("An error occurred while deleting the product");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="flex h-full w-full flex-col gap-2">
      <div className="relative mb-2 flex w-full items-center justify-between">
        <span className="w-full font-domaine text-[20px] text-[#252525]">
          All Products
        </span>
        <div className="relative flex w-full items-end justify-end gap-2">
          <div className="relative w-[60%]">
            <input
              type="text"
              placeholder="Search . . . "
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full appearance-none rounded-md border-[1px] border-gray-200 bg-[white]/[1%] px-4 py-2 pl-10 font-josefins font-thin text-[#231F20] outline-none focus:border-[1px] focus:border-[#CDB698]"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 transform">
              <Image
                src={Assets.IconSearch}
                alt="Search"
                style={{ width: "20px", height: "20px" }}
              />
            </div>
          </div>
          <ButtonPrimary
            width="w-[9rem]"
            height="h-[2.5rem]"
            text="Add Product"
            onClick={handleAddProduct}
          />
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-[#B69B7C]/[12%]">
            <tr>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                No
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]"
                onClick={() => handleOrderBy("name")}
              >
                Item Name{" "}
                {orderBy === "name"
                  ? orderDirection === "asc"
                    ? "↑"
                    : "↓"
                  : "↑↓"}
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]"
                onClick={() => handleOrderBy("priceIDR")}
              >
                Price{" "}
                {orderBy === "priceIDR"
                  ? orderDirection === "asc"
                    ? "↑"
                    : "↓"
                  : "↑↓"}
              </th>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Stock
              </th>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Size
              </th>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Category
              </th>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Latest Update
              </th>
              <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 bg-white">
            {products.map((product, i) => (
              <tr key={product.id}>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {(page - 1) * pageSize + i + 1}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {product.name}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {product.priceIDR}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {product.size}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {product.categoryId}
                </td>
                <td className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900">
                  {moment(product.updateAt).format("DD MMM YYYY")}
                </td>
                <td className="flex justify-center space-x-2 px-6 py-4 text-center text-sm font-medium">
                  <button
                    className="text-[#B69B7C]"
                    onClick={() =>
                      router.push(`/dashboard/product/${product.slug}`)
                    }
                  >
                    <Image
                      src={Assets.IconEye}
                      alt="Edit"
                      width={20}
                      height={20}
                    />
                  </button>
                  <button
                    className="text-[#B69B7C]"
                    onClick={() => handleDelete(product.slug)}
                  >
                    <Image
                      src={Assets.IconTrash}
                      alt="Delete"
                      width={20}
                      height={20}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="rounded-md bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-8 py-2 text-white"
        >
          Prev
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-md bg-gradient-to-t from-[#B69B78] to-[#CDB698] px-8 py-2 text-white"
        >
          Next
        </button>
      </div>
    </main>
  );
}
