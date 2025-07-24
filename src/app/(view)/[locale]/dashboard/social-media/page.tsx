"use client";

import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/atoms";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { GetListSocialMedia, UpdateSocailMedia, UpdateStatusSocialMedia } from "@/controller/admin/social-media";

export default function Soci() {
   const router = useRouter();
   const [social, setSocial] = useState<SocialMedia[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const { control } = useForm();

   const handleAddSocialMedia = () => {
      router.push("/dashboard/social-media/create");
   };

   const handleStatusChange = async (id: number, isActive: boolean) => {
      try {
         await UpdateStatusSocialMedia(id);
         setSocial((prevSocial) => prevSocial.map((item) => (item.id === id ? { ...item, isActive: !isActive } : item)));
      } catch (err) {
         console.error("Failed to update status", err);
         setError("Failed to update social media status");
      }
   };

   useEffect(() => {
      const fetchSocial = async () => {
         try {
            const response = await GetListSocialMedia();
            const result = await response.json();
            const social = result.data.socialMedia;
            setSocial(social);
         } catch (err) {
            setError("Failed to fetch social media");
         } finally {
            setLoading(false);
         }
      };
      fetchSocial();
   }, []);

   if (loading) return <div>Loading...</div>;
   if (error) return <div>{error}</div>;

   return (
      <main className="flex h-full w-full flex-col gap-2">
         <div className="mb-2 flex items-center justify-between">
            <h2 className="font-domaine text-[20px] text-[#252525]">All Social Media</h2>
            <div className="flex items-center gap-2">
               <ButtonPrimary width="w-[12rem]" height="h-[2.5rem]" text="Add Social Media" onClick={handleAddSocialMedia} />
            </div>
         </div>
         <div className="flex-grow overflow-auto">
            <table className="min-w-full divide-y divide-gray-100">
               <thead className="bg-[#B69B7C]/[12%]">
                  <tr>
                     <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">No</th>
                     <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">Name</th>
                     <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">Link</th>
                     <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">Status</th>
                     <th className="px-6 py-3 text-center text-[14px] font-medium uppercase tracking-wider text-[#252525]">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-300 bg-white">
                  {social.length > 0 ? (
                     social.map((socialItem, index) => (
                        <tr key={socialItem.id}>
                           <td className="px-6 py-4 text-center text-sm text-gray-900">{index + 1}</td>
                           <td className="px-6 py-4 text-center text-sm text-gray-900">{socialItem.name}</td>
                           <td className="px-6 py-4 text-center text-sm text-gray-900">
                              <a href={socialItem.link} className="text-gray-900 underline hover:underline">
                                 {socialItem.link}
                              </a>
                           </td>
                           <td className="px-6 py-4 text-center text-sm text-gray-900">
                              <Controller
                                 control={control}
                                 name={`social_${socialItem.id}`}
                                 defaultValue={socialItem.isActive}
                                 render={({ field: { onChange, value } }) => (
                                    <input
                                       type="checkbox"
                                       checked={value}
                                       className="h-5 w-5 accent-[#C1AE94]"
                                       onChange={async () => {
                                          const newValue = !value;
                                          onChange(newValue);
                                          await handleStatusChange(socialItem.id!, newValue);
                                       }}
                                    />
                                 )}
                              />
                           </td>
                           <td
                              onClick={() => {
                                 router.push(`/dashboard/social-media/${socialItem.id}`);
                              }}
                              className="cursor-pointer px-6 py-4 text-center text-sm text-gray-900"
                           >
                              Detail
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-500">
                           No social media data available
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </main>
   );
}
