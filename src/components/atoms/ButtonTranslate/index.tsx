import Image from "next/image";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { setPrefLangCookie } from "../Translate/translate";

interface Language {
  label: string;
  value: string;
  logo: string;
}

const languages: Language[] = [
  { label: "Eng", value: "en", logo: "/images/logo-us.svg" },
  { label: "Ind", value: "id", logo: "/images/logo-indo.svg" },
  { label: "Jpn", value: "ja", logo: "/images/logo-jpn.svg" },
];

const includedLanguages = languages.map((lang) => lang.value).join(",");

// Google Translate initialization
function googleTranslateElementInit() {
  new (window as any).google.translate.TranslateElement(
    {
      pageLanguage: "en", // Set default page language (avoid "Auto")
      includedLanguages,
      autoDisplay: false,
    },
    "google_translate_element"
  );
}

interface GoogleTranslateProps {
  prefLangCookie: string;
}

export const GoogleTranslate: React.FC<GoogleTranslateProps> = ({
  prefLangCookie,
}) => {
  const [langCookie, setLangCookie] = useState<string>("");

  useEffect(() => {
    const lang = decodeURIComponent(prefLangCookie || "en");
    setLangCookie(lang);
    (window as any).googleTranslateElementInit = googleTranslateElementInit;
  }, [prefLangCookie]);

  const [isLanguageListOpen, setIsLanguageListOpen] = useState(false);

  const handleLanguageClick = () => {
    setIsLanguageListOpen(!isLanguageListOpen);
  };

  const handleLanguageChange = (value: string) => {
    setLangCookie(value);
    setPrefLangCookie(value);

    const element = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement | null;
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event("change"));
    }

    setIsLanguageListOpen(false);
  };

  const currentLang = langCookie || "en";
  const currentLangObj = languages.find((l) => l.value === currentLang);

  return (
    <div className="relative">
      {/* Hidden Google Translate DOM Element */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Language Selector Button */}
      <div className="relative">
        <button
          onClick={handleLanguageClick}
          className="flex items-center gap-2 rounded-full border border-[#B69B7C] px-4 py-[6px] shadow-sm transition hover:shadow-md"
        >
          <Image
            src={currentLangObj?.logo || "/images/logo-us.svg"}
            alt="flag"
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-sm font-semibold text-[#717582] uppercase">
            {currentLangObj?.label || "Eng"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown List */}
        {isLanguageListOpen && (
          <div className="absolute top-12 z-10 w-full rounded-md border border-[#E4E4E4] bg-white shadow-md">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleLanguageChange(lang.value)}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100"
              >
                <Image
                  src={lang.logo}
                  alt={lang.label}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-[#333] uppercase">{lang.value}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Google Translate Script */}
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
};
