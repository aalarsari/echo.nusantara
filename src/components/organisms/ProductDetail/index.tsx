"use client";

import { Assets } from "@/assets";
import { ButtonPrimary, InputField, Notifications } from "@/components/atoms";
import { GetCategory } from "@/controller/admin/category";
import {
  AddDiscountProduct,
  DeleteDiscountProduct,
  DetailShopAdmin,
  UpdateProduct,
} from "@/controller/admin/product";
import { ProductUpadateValidation } from "@/lib/zod-schema/product";
import { Listbox, Transition } from "@headlessui/react";
import {
  BuildingStorefrontIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { z } from "zod";
import dynamic from "next/dynamic";
import moment from "moment-timezone";
import { DateRangePicker } from "rsuite";
import { DateRange } from "rsuite/esm/DateRangePicker";
import "rsuite/dist/rsuite.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { DiscountValidation } from "@/lib/zod-schema/discount";

interface ProductDetailProps {
  slug: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ slug }) => {
  const [previewUrls, setPreviewUrls] = useState<{
    image1: string | null;
    imaga2: string | null;
    image3: string | null;
    image4: string | null;
    image5: string | null;
  }>({
    image1: null,
    imaga2: null,
    image3: null,
    image4: null,
    image5: null,
  });
  const [selectedFiles, setSelectedFiles] = useState<{
    image1: File | null;
    image2: File | null;
    image3: File | null;
    image4: File | null;
    image5: File | null;
  }>({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });

  type Discounts = z.infer<typeof DiscountValidation>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<Products>({});

  const {
    register: discountRegister,
    handleSubmit: handleDiscountSubmit,
    formState: { errors: discountErrors },
  } = useForm<Discounts>({});

  const [productDetails, setProductDetails] = useState<Products | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [startDate, setStartDate] = useState<string>(
    moment().startOf("year").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(
    moment().endOf("day").format("YYYY-MM-DD"),
  );
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: "", type, visible: false });
    }, 3000);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await DetailShopAdmin(slug);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const product = await response.json();

        if (product?.data) {
          setProductDetails(product.data);
        } else {
          console.warn("Product data is undefined or null!");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetCategory();
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);

      setSelectedFiles((prevState) => ({ ...prevState, [key]: file }));
      setPreviewUrls((prevState) => ({ ...prevState, [key]: fileURL }));
    }
  };

  useEffect(() => {
    if (productDetails?.descriptions) {
      setValue("descriptions", productDetails.descriptions);
    }
    if (productDetails?.subDescriptions) {
      setValue("subDescriptions", productDetails.subDescriptions);
    }
  }, [productDetails, setValue]);

  const onSubmitUpdateProduct = async (formData: Products) => {
    const productData = {
      name: formData.name,
      categoryId: formData.categoryId,
      descriptions: formData.descriptions,
      subDescriptions: formData.subDescriptions,
      stock: formData.stock,
      weight: formData.weight,
      size: formData.size,
      priceIDR: formData.priceIDR,
      image1: selectedFiles.image1 as any,
      image2: selectedFiles.image2 as any,
      image3: selectedFiles.image3 as any,
      image4: selectedFiles.image4 as any,
      image5: selectedFiles.image5 as any,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const updateResponse = await UpdateProduct(productData, slug);

      if (updateResponse.status === 200) {
        showNotification("Product updated successfully!", "success");
        setTimeout(() => {
          router.push("/dashboard/product");
        }, 1000);
      } else {
        const updateMessage = await updateResponse.json();
        showNotification(
          `Error updating product: ${updateMessage.message}`,
          "error",
        );
      }
    } catch (error) {
      showNotification("Failed to update product.", "error");
    }
  };

  const onSubmitCreateDiscount = async (formData: Discounts) => {
    const dateFormats = [
      "DD-MM-YYYY",
      "DD-MM-YY",
      "DD/MM/YYYY",
      "DD MM YYYY",
      "DD MM YY",
    ];

    const discountData = {
      discount: parseInt(formData.discount.toString()) ?? null,
      subject: formData.subject ?? null,
      startDate: startDate,
      endDate: endDate,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const discountResponse = await AddDiscountProduct(discountData, slug);

      if (discountResponse.status === 200) {
        showNotification("Discount created successfully!", "success");
        window.location.reload();
      } else {
        const discountMessage = await discountResponse.json();
        showNotification(
          `Error creating discount: ${discountMessage.message}`,
          "error",
        );
      }
    } catch (error) {
      showNotification("Failed to create discount.", "error");
    }
  };

  const handleClickDelete = async (id: number, slug: string) => {
    setLoading(true);

    try {
      const response = await DeleteDiscountProduct(id, slug);
      if (response.ok) {
        showNotification("Discount deleted successfully!", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showNotification(
          `Failed to delete discount. Status: ${response.status}`,
          "error",
        );
      }
    } catch (error) {
      showNotification(
        "An error occurred while deleting the discount",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative h-full w-full overflow-auto">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="flex flex-row items-center gap-2 pb-4">
        <BuildingStorefrontIcon className="h-8 w-8 text-[#252525]" />
        <div className="">
          <h2 className="text-lg text-[#252525]">Update Product</h2>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <form
          onSubmit={handleSubmit(onSubmitUpdateProduct)}
          className="flex w-full flex-col"
        >
          <div className="flex w-full items-start justify-between gap-8">
            <div className="relative flex h-[90vh] w-[65%] flex-col gap-8">
              <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll rounded-md bg-gray-50 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#252525]">
                    General Information
                  </h2>
                </div>
                <InputField
                  type="text"
                  label="Name Product"
                  placeholder={productDetails?.name || "Name"}
                  register={register}
                  width="w-[350px] md:w-full"
                  color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                  inputProps={{
                    name: "name",
                    autoComplete: "name",
                  }}
                  error={errors.name?.message}
                />
                <InputField
                  type="text"
                  label="Sub Description Product"
                  placeholder={
                    productDetails?.subDescriptions || "Sub Description"
                  }
                  register={register}
                  width="w-[350px] md:w-full"
                  color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                  inputProps={{
                    name: "subDescriptions",
                    autoComplete: "subDescriptions",
                  }}
                  error={errors.subDescriptions?.message}
                />
                <div className="flex w-full flex-col gap-2">
                  <label className="font-josefins text-[16px] text-[#ADADAD]">
                    Description Product
                  </label>
                  <div className="w-full">
                    <Controller
                      name="descriptions"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill
                          {...field}
                          value={field.value || ""}
                          theme="snow"
                          placeholder="Write product description..."
                        />
                      )}
                    />
                  </div>
                  {errors.descriptions && (
                    <p className="text-sm text-red-500">
                      {errors.descriptions.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-between gap-2">
                  <InputField
                    type="text"
                    label="Size"
                    placeholder={productDetails?.size || "Size"}
                    width="w-full"
                    register={register}
                    color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                    inputProps={{
                      name: "size",
                      autoComplete: "size",
                    }}
                    error={errors.size?.message}
                  />
                  <InputField
                    type="text"
                    label="Weight"
                    placeholder={productDetails?.weight?.toString() || "Weight"}
                    width="w-full"
                    register={register}
                    color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                    inputProps={{
                      name: "weight",
                      autoComplete: "weight",
                    }}
                    error={errors.weight?.message}
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <InputField
                    type="text"
                    label="Rupiah"
                    placeholder={
                      productDetails?.priceIDR?.toString() || "Rupiah"
                    }
                    width="w-full"
                    register={register}
                    color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                    inputProps={{
                      name: "priceIDR",
                      autoComplete: "rupiah",
                    }}
                    error={errors.priceIDR?.message}
                  />
                </div>
                <div className="flex justify-between gap-2">
                  <InputField
                    type="text"
                    label="Stock"
                    placeholder={productDetails?.stock?.toString() || "Stock"}
                    width="w-full"
                    register={register}
                    color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                    inputProps={{
                      name: "stock",
                      autoComplete: "stock",
                    }}
                    error={errors.stock?.message}
                  />
                  <InputField
                    type="text"
                    label="Max Order"
                    placeholder={
                      productDetails?.maxOrder?.toString() || "Max Order"
                    }
                    width="w-full"
                    register={register}
                    color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                    inputProps={{
                      name: "maxOrder",
                      autoComplete: "maxOrder",
                    }}
                    error={errors.maxOrder?.message}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-[35%] flex-col gap-3">
              <div className="flex flex-col gap-4 rounded-md bg-gray-50 p-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#252525]">
                    Category
                  </h2>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="category" className="text-md text-[#252525]">
                    Product Category
                  </label>
                  <Controller
                    control={control}
                    name="categoryId"
                    rules={{ required: "Please select an option" }}
                    render={({ field }) => (
                      <Listbox
                        as="div"
                        value={selectedCategory}
                        onChange={(selectedCategory) => {
                          setSelectedCategory(selectedCategory);
                          field.onChange(selectedCategory?.id || null);
                        }}
                      >
                        {({ open }) => (
                          <>
                            <div className="relative">
                              <Listbox.Button className="flex w-full cursor-pointer items-center justify-between rounded-md bg-white px-4 py-3 text-left text-gray-400 ring-1 ring-gray-100 focus:ring-1 focus:ring-[#C1AE94] sm:text-sm">
                                <span>
                                  {selectedCategory
                                    ? selectedCategory.name.toUpperCase()
                                    : productDetails?.categoryId?.toString() ||
                                      "Category"}
                                </span>
                                <ChevronDownIcon
                                  className={`h-5 w-5 transform transition-all duration-300 ${open ? "rotate-180" : ""}`}
                                  aria-hidden="true"
                                />
                              </Listbox.Button>
                              <Transition
                                as="div"
                                show={open}
                                enter="transition duration-300 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-300 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                              >
                                <Listbox.Options
                                  as="ul"
                                  className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                  style={{ display: open ? "block" : "none" }}
                                >
                                  {categories.map((category) => (
                                    <Listbox.Option
                                      as="li"
                                      key={category.id}
                                      value={category}
                                      className={({ active }) =>
                                        `${active ? "bg-[#C1AE94] text-white" : "text-gray-900"} relative cursor-pointer select-none py-2 pl-3 pr-9`
                                      }
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`${selected ? "text-gray-300" : "text-black"} block truncate`}
                                          >
                                            {category.name.toUpperCase()}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={`${active ? "text-white" : "text-[#C1AE94]/50"} absolute inset-y-0 right-0 flex items-center pr-4`}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    )}
                  />
                  {errors.categoryId && (
                    <p className="text-sm text-red-500">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="group relative h-[15rem] w-full overflow-hidden rounded-md">
                  <Image
                    src={
                      previewUrls.image1 ||
                      productDetails?.image1 ||
                      Assets.DefaultProduct
                    }
                    alt="Product Image"
                    fill
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "contain" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:bg-opacity-70 group-hover:opacity-100">
                    <label htmlFor="file-input-1" className="cursor-pointer">
                      <Image
                        src={Assets.Edit}
                        alt="Camera Icon"
                        width={24}
                        height={24}
                        className="text-white"
                      />
                    </label>
                    <input
                      id="file-input-1"
                      type="file"
                      accept="image/jpeg, image/png"
                      onChange={(e) => handleFileChange(e, "image1")}
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="group relative h-24 w-28 overflow-hidden rounded-md">
                    <Image
                      src={
                        previewUrls.imaga2 ||
                        productDetails?.image2 ||
                        Assets.DefaultProduct
                      }
                      alt="Product Image"
                      fill
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:bg-opacity-70 group-hover:opacity-100">
                      <label htmlFor="file-input-2" className="cursor-pointer">
                        <Image
                          src={Assets.Edit}
                          alt="Camera Icon"
                          width={24}
                          height={24}
                          className="text-white"
                        />
                      </label>
                      <input
                        id="file-input-2"
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={(e) => handleFileChange(e, "imaga2")}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="group relative h-24 w-28 overflow-hidden rounded-md">
                    <Image
                      src={
                        previewUrls.image3 ||
                        productDetails?.image3 ||
                        Assets.DefaultProduct
                      }
                      alt="Product Image"
                      fill
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:bg-opacity-70 group-hover:opacity-100">
                      <label htmlFor="file-input-3" className="cursor-pointer">
                        <Image
                          src={Assets.Edit}
                          alt="Camera Icon"
                          width={24}
                          height={24}
                          className="text-white"
                        />
                      </label>
                      <input
                        id="file-input-3"
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={(e) => handleFileChange(e, "image3")}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="group relative h-24 w-28 overflow-hidden rounded-md">
                    <Image
                      src={
                        previewUrls.image4 ||
                        productDetails?.image4 ||
                        Assets.DefaultProduct
                      }
                      alt="Product Image"
                      fill
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:bg-opacity-70 group-hover:opacity-100">
                      <label htmlFor="file-input-4" className="cursor-pointer">
                        <Image
                          src={Assets.Edit}
                          alt="Camera Icon"
                          width={24}
                          height={24}
                          className="text-white"
                        />
                      </label>
                      <input
                        id="file-input-4"
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={(e) => handleFileChange(e, "image4")}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="group relative h-24 w-28 overflow-hidden rounded-md">
                    <Image
                      src={
                        previewUrls.image5 ||
                        productDetails?.image5 ||
                        Assets.DefaultProduct
                      }
                      alt="Product Image"
                      fill
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:bg-opacity-70 group-hover:opacity-100">
                      <label htmlFor="file-input-5" className="cursor-pointer">
                        <Image
                          src={Assets.Edit}
                          alt="Camera Icon"
                          width={24}
                          height={24}
                          className="text-white"
                        />
                      </label>
                      <input
                        id="file-input-5"
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={(e) => handleFileChange(e, "image5")}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <ButtonPrimary text="Update Product" height="h-[50px]" />
            </div>
          </div>
        </form>
        <div className="relative flex w-full items-start justify-between gap-8">
          <div className="relative flex h-[40vh] w-[62%] flex-col gap-8">
            <form
              onSubmit={handleDiscountSubmit(onSubmitCreateDiscount)}
              className="flex w-full flex-col"
            >
              <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll rounded-md bg-gray-50 p-5">
                <div className="flex justify-between gap-2">
                  <InputField
                    type="text"
                    label="Subject"
                    placeholder="Subject"
                    width="w-full"
                    register={discountRegister}
                    color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                    inputProps={{
                      name: "subject",
                      autoComplete: "subject",
                    }}
                    error={discountErrors.subject?.message}
                  />
                  <InputField
                    type="text"
                    label="Discount"
                    placeholder="Discount"
                    width="w-full"
                    register={discountRegister}
                    color="bg-white ring-1 ring-gray-100 text-[#ccc]"
                    inputProps={{
                      name: "discount",
                      autoComplete: "discount",
                    }}
                    error={discountErrors.discount?.message}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-josefins text-[16px] font-semibold text-[#7D716A]">
                    Discount Date
                  </label>
                  <div className="relative w-full items-center">
                    <DateRangePicker
                      placeholder="Pilih Tanggal"
                      showOneCalendar
                      format="dd-MMMM-yyyy"
                      className="custom-date-picker h-full w-full"
                      onChange={(date: DateRange | null) => {
                        if (date) {
                          const start = moment(date[0]).format("YYYY-MM-DD");
                          const end = moment(date[1]).format("YYYY-MM-DD");
                          setStartDate(start);
                          setEndDate(end);
                        }
                        setShowDateRangePicker(false);
                      }}
                      placement="bottomStart"
                    />
                  </div>
                </div>

                <ButtonPrimary text="Create Dicount" height="h-[50px]" />
              </div>
            </form>
          </div>
          <div className="relative flex h-[32.5vh] w-[35%] flex-col gap-8">
            <div className="flex-grow overflow-auto">
              <table className="min-w-full divide-y divide-gray-100 border border-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-100 px-6 py-3 text-center font-josefins text-[16px] font-semibold tracking-wider text-[#7D716A]">
                      No
                    </th>
                    <th className="border border-gray-100 px-6 py-3 text-center font-josefins text-[16px] font-semibold tracking-wider text-[#7D716A]">
                      Discount
                    </th>
                    <th className="border border-gray-100 px-6 py-3 text-center font-josefins text-[16px] font-semibold tracking-wider text-[#7D716A]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {productDetails?.Discount &&
                  productDetails.Discount.length > 0 ? (
                    productDetails.Discount.map(
                      (item: Products, index: number) => (
                        <tr key={index}>
                          <td className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900">
                            {index + 1}
                          </td>
                          <td className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900">
                            {Math.round(item.discount * 100)} %
                          </td>
                          <td className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900">
                            <button
                              onClick={() =>
                                handleClickDelete(
                                  item.id!,
                                  productDetails.slug!,
                                )
                              }
                              disabled={loading}
                              className="text-red-600 hover:text-red-800"
                            >
                              {loading ? "Deleting..." : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ),
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="border border-gray-100 px-6 py-3 text-center text-[14px] text-gray-900"
                      >
                        No Discounts Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
