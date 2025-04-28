"use client";

import { Assets } from "@/assets";
import { ButtonPrimary, InputField, Notifications } from "@/components/atoms";
import {
  Profile,
  UpdateChangeProfilePicture,
  UpdateProfile,
} from "@/controller/user/profile";
import { profileUpdate } from "@/lib/zod-schema/profile";
import { Gander } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export const MyProfile = () => {
  const [profileData, setProfileData] = useState<User | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gander | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
  type User = z.infer<typeof profileUpdate> & {
    gander: Gander;
    photo?: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<User>({
    defaultValues: {
      gander: profileData?.gander! || "",
    },
  });
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const response = await Profile();
      const { data } = response;
      setProfileData(data);
      setPreviewUrl(data.photo ?? null);
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      showNotification("Please select a photo before saving", "error");
      return;
    }

    try {
      const response = await UpdateChangeProfilePicture({
        photo: selectedFile,
      });
      if (response.ok) {
        await fetchProfile();
        showNotification("Profile picture updated successfully", "success");
      } else {
        showNotification("Failed to update profile picture", "error");
      }
    } catch (error) {
      showNotification("Failed to update profile picture", "error");
    }
  };

  const onSubmit = async (formData: User) => {
    try {
      console.log("Selected Gender:", selectedGender);
      if (selectedGender !== null) {
        formData.gander = selectedGender;
        const response = await UpdateProfile(formData);
        if (response.ok) {
          showNotification("Profile updated successfully", "success");
        } else {
          showNotification("Failed to update profile", "error");
        }
      } else {
        showNotification("Gender is not selected", "error");
      }
    } catch (error) {
      showNotification("Failed to update profile", "error");
    }
  };

  const getImageSrc = () => {
    if (previewUrl) {
      return previewUrl;
    }
    return Assets.Forest;
  };

  useEffect(() => {
    if (profileData?.gander) {
      setValue("gander", profileData.gander);
    }
  }, [profileData, setValue]);

  useEffect(() => {
    console.log("Selected Gender (useEffect):", selectedGender);
  }, [selectedGender]);

  return (
    <div className="relative flex h-auto w-full flex-col gap-10 lg:h-full">
      <Notifications
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
      <div className="relative flex flex-col items-center justify-center gap-6 md:flex-row md:justify-start">
        <div className="group relative h-32 w-40">
          <Image
            src={getImageSrc()}
            alt="Photo Profile"
            fill
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:bg-opacity-70 group-hover:opacity-100">
            <label htmlFor="file-input" className="cursor-pointer">
              <Image
                src={Assets.Edit}
                alt="Camera Icon"
                width={24}
                height={24}
                className="text-white"
              />
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2 md:items-start">
          <div className="flex flex-row gap-2">
            <ButtonPrimary
              text="Update Photo"
              width="w-[10rem]"
              height="h-[2.5rem]"
              onClick={handleSave}
            />
          </div>
          <div className="w-full">
            <h2 className="text-center font-josefins text-[16px] font-thin md:text-start md:text-[14px]">
              *Upload photos in JPEG or PNG format, maximum size 2MB
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <InputField
              type="text"
              placeholder={profileData?.name || "Name"}
              label="Name"
              register={register}
              height="h-[48px]"
              inputProps={{
                name: "name",
                autoComplete: "name",
              }}
              error={errors.name?.message}
            />
            <InputField
              type="text"
              placeholder={profileData?.phone || "Phone"}
              label="Phone"
              register={register}
              height="h-[48px]"
              inputProps={{
                name: "phone",
                autoComplete: "phone",
              }}
              error={errors.phone?.message}
            />
          </div>
          <Controller
            name="gander"
            control={control}
            defaultValue={selectedGender ?? undefined}
            render={({ field }) => (
              <div className="flex w-full flex-row gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...field}
                    value="Male"
                    checked={field.value === "Male"}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setSelectedGender(e.target.value as Gander);
                    }}
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...field}
                    value="Female"
                    checked={field.value === "Female"}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setSelectedGender(e.target.value as Gander);
                    }}
                  />
                  <span>Female</span>
                </label>
              </div>
            )}
          />
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <InputField
              type="text"
              placeholder={profileData?.email || "Email"}
              label="Email"
              register={register}
              height="h-[48px]"
              inputProps={{
                name: "email",
                autoComplete: "email",
              }}
              error={errors.email?.message}
            />
            <InputField
              type="text"
              placeholder={profileData?.postalCode || "Postal Code"}
              label="Postal Code"
              register={register}
              height="h-[48px]"
              inputProps={{
                name: "postalCode",
                autoComplete: "postalCode",
              }}
              error={errors.postalCode?.message}
            />
          </div>

          <div className="flex w-full flex-row gap-4">
            <InputField
              type="text"
              placeholder={profileData?.address || "Address"}
              label="Address"
              register={register}
              height="h-[48px]"
              inputProps={{
                name: "address",
                autoComplete: "address-line1",
              }}
              error={errors.address?.message}
            />
          </div>
          <ButtonPrimary text="Save" width="w-[49%]" height="h-[48px]" />
        </form>
      </div>
    </div>
  );
};
