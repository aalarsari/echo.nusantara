// "use client";

// import { Assets } from "@/assets";
// import { InputField, Notifications } from "@/components/atoms";
// import { UpdateProfile, Profile } from "@/controller/user/profile";
// import { profileUpdate } from "@/lib/zod-schema/profile";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Image from "next/image";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useEffect, useState } from "react";
// import React from "react";
// import { TrashIcon } from "@heroicons/react/24/outline";
// import {
//   Deletecart,
//   GetListcart,
//   UpdateQuantity,
// } from "@/controller/user/cart";
// import {
//   DeleteCartLocaly,
//   GetProductLocaly,
//   UpdateBuyQuantity,
// } from "@/lib/cookies/cart";
// import { getBuyNowData } from "@/controller/user/buy-now";

// export const BuyNowDetail: React.FC<BuyNowDetailProps> = ({ cartId }) => {
//   const [profile, setProfile] = useState<User | null>(null);
//   const [profileData, setProfileData] = useState<User | null>(null);
//   const [cartHome, setCartHome] = useState<CartItem | null>(null);
//   type User = z.infer<typeof profileUpdate>;
//   const [notification, setNotification] = useState({
//     message: "",
//     type: "success" as "success" | "error",
//     visible: false,
//   });
//   const [editMode, setEditMode] = useState(false);

//   const showNotification = (message: string, type: "success" | "error") => {
//     setNotification({ message, type, visible: true });
//     setTimeout(() => {
//       setNotification({ message: "", type, visible: false });
//     }, 3000);
//   };

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<User>({
//     resolver: zodResolver(profileUpdate),
//   });

//   useEffect(() => {
//     async function fetchCartCount() {
//       try {
//         const res = await getBuyNowData(cartId);
//         if (res.ok) {
//           const body = await res.json();
//           setCartHome(body.data);
//         } else {
//           const data = await GetProductLocaly();
//           setCartHome(data);
//         }
//       } catch (error) {
//         console.error("Error fetching cart data:", error);
//         const data = await GetProductLocaly();
//         setCartHome(data);
//       }
//     }

//     fetchCartCount();
//   }, []);

//   useEffect(() => {
//     async function fetchProfile() {
//       try {
//         const response = await Profile();
//         const { data } = response;
//         setProfileData(data);
//         if (data.phone) {
//           data.phone = data.phone.replace(/\D/g, "");
//           data.phone = data.phone.replace(/^62/, "");
//         }
//         Object.keys(data).forEach((key) => {
//           if (key in data) {
//             setValue(key as keyof User, data[key]);
//           }
//         });
//       } catch (error) {
//         console.error("Failed to load profile data:", error);
//       }
//     }
//     fetchProfile();
//   }, [setValue]);

//   const onSubmit = async (data: User) => {
//     try {
//       const response = await UpdateProfile(data);
//       if (response.status === 200) {
//         showNotification(`${data.name} updated successfully!`, "success");
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//       } else {
//         const errorMessage = await response.text();
//         showNotification(`Internal Server Error: ${errorMessage}`, "error");
//       }
//     } catch (error) {
//       const errorMessage = "Internal Server Error: Failed to register product.";
//       showNotification(errorMessage, "error");
//     }
//   };

//   return (
//     <main className="relative h-full w-full">
//       <Notifications
//         message={notification.message}
//         type={notification.type}
//         visible={notification.visible}
//         onClose={() => setNotification({ ...notification, visible: false })}
//       />
//       <div className="flex h-[130vh] w-full flex-col gap-4 bg-[#F9F9F9] p-20">
//         <div>
//           <h2 className="font-josefins">Check Out</h2>
//         </div>
//         <div className="flex h-full w-full flex-row gap-2 rounded-md">
//           <div className="flex h-full w-full flex-col gap-4 rounded-md p-6 ring-1 ring-gray-200">
//             <div className="flex-col pb-4">
//               <div className="flex w-full flex-row items-center justify-between">
//                 <span className="font-josefins text-[20px] text-[#92734E]">
//                   Delivery Info
//                 </span>
//                 <button
//                   onClick={() => setEditMode(true)}
//                   className="flex h-full items-center justify-center gap-2"
//                 >
//                   <span className="font-josefins text-[16px] text-[#c3c3c3]">
//                     Edit
//                   </span>
//                   <Image src={Assets.Edit} alt="Edit" className="h-4 w-4" />
//                 </button>
//               </div>
//               <div>
//                 <h2 className="font-josefins text-[16px] text-[#231F20]">
//                   *Please check the information below before starting the
//                   payment.
//                 </h2>
//               </div>
//             </div>
//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="flex w-full flex-col gap-4"
//             >
//               <InputField
//                 type="text"
//                 label="Email"
//                 placeholder={profile?.email || "Email"}
//                 height="h-[50px]"
//                 register={register}
//                 inputProps={{
//                   name: "email",
//                   autoComplete: "email",
//                   disabled: !editMode,
//                 }}
//                 error={errors.email?.message}
//               />
//               <InputField
//                 type="text"
//                 label="Phone"
//                 placeholder={profile?.phone || "Phone"}
//                 height="h-[50px]"
//                 register={register}
//                 inputProps={{
//                   name: "phone",
//                   autoComplete: "phone",
//                   disabled: !editMode,
//                 }}
//                 error={errors.phone?.message}
//               />
//               <InputField
//                 type="text"
//                 label="Name"
//                 placeholder={profile?.name || "Name"}
//                 height="h-[50px]"
//                 register={register}
//                 inputProps={{
//                   name: "name",
//                   autoComplete: "name",
//                   disabled: !editMode,
//                 }}
//                 error={errors.name?.message}
//               />
//               <InputField
//                 type="text"
//                 label="Address"
//                 placeholder={profile?.address || "Address"}
//                 height="h-[50px]"
//                 register={register}
//                 inputProps={{
//                   name: "address",
//                   autoComplete: "address",
//                   disabled: !editMode,
//                 }}
//                 error={errors.address?.message}
//               />
//               <div className="flex flex-row gap-2">
//                 <InputField
//                   type="text"
//                   label="City"
//                   placeholder={profile?.address || "City"}
//                   height="h-[50px]"
//                   register={register}
//                   inputProps={{
//                     name: "city",
//                     autoComplete: "city",
//                     disabled: !editMode,
//                   }}
//                   error={errors.city?.message}
//                 />
//                 <InputField
//                   type="text"
//                   label="Postal Code"
//                   placeholder={profile?.address || "Postal Code"}
//                   height="h-[50px]"
//                   register={register}
//                   inputProps={{
//                     name: "postalCode",
//                     autoComplete: "postalCode",
//                     disabled: !editMode,
//                   }}
//                   error={errors.postalCode?.message}
//                 />
//               </div>
//               <InputField
//                 type="text"
//                 label="Country"
//                 placeholder={profile?.address || "Country"}
//                 height="h-[50px]"
//                 register={register}
//                 inputProps={{
//                   name: "country",
//                   autoComplete: "country",
//                   disabled: !editMode,
//                 }}
//                 error={errors.country?.message}
//               />
//               {editMode && (
//                 <button
//                   type="submit"
//                   className="mt-4 h-[50px] w-full rounded-md bg-[#92734E] font-josefins text-white"
//                 >
//                   Update Profile
//                 </button>
//               )}
//             </form>
//           </div>
//           <div className="flex h-full w-full flex-col gap-4 rounded-md p-6 ring-1 ring-gray-200">
//             <div className="pb-4">
//               <span className="font-josefins text-[20px] text-[#92734E]">
//                 Shopping Cart
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };
