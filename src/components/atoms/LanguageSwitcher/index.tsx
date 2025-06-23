"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ChangeEvent, useTransition } from "react";

export const LanguageSwitcher = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname(); // 👈 current path
  const localeActive = useLocale();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;

    // Replace current locale in path with new one
    const segments = pathname.split("/");
    segments[1] = nextLocale; // Replace locale segment
    const newPath = segments.join("/");

    startTransition(() => {
      router.replace(newPath); // 👈 Navigate to new path with new locale
    });
  };

  return (
    <label className="border-2 rounded">
      <p className="sr-only">Change language</p>
      <select
        defaultValue={localeActive}
        className="bg-transparent py-2"
        onChange={onSelectChange}
        disabled={isPending}
      >
        <option value="en">English</option>
        <option value="id">Indonesian</option>
      </select>
    </label>
  );
};
