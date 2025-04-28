import Image from "next/image";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { setPrefLangCookie } from "../Translate/translate";

interface Language {
  label: string;
  value: string;
  logo: string;
}

const languages: Language[] = [
  { label: "English", value: "en", logo: "/images/logo-us.svg" },
  { label: "Indonesian", value: "id", logo: "/images/logo-indo.svg" },
  { label: "Chinese", value: "zh-CN", logo: "/images/logo-china.svg" },
  { label: "Korean", value: "ko", logo: "/images/logo-korea.svg" },
];

const includedLanguages = languages.map((lang) => lang.value).join(",");

function googleTranslateElementInit() {
  new (window as any).google.translate.TranslateElement(
    {
      pageLanguage: "auto",
      includedLanguages,
      autoDisplay: false,
    },
    "google_translate_element",
  );
}

interface GoogleTranslateProps {
  prefLangCookie: string;
}

export const GoogleTranslate: React.FC<GoogleTranslateProps> = ({
  prefLangCookie,
}: GoogleTranslateProps) => {
  const [langCookie, setLangCookie] = useState<string>("");

  useEffect(() => {
    setLangCookie(decodeURIComponent(prefLangCookie));
    (window as any).googleTranslateElementInit = googleTranslateElementInit;
  }, [prefLangCookie]);

  const [isLanguageListOpen, setIsLanguageListOpen] = useState(false);

  const handleLanguageClick = () => {
    setIsLanguageListOpen(!isLanguageListOpen);
  };

  const handleLanguageChange = (value: string) => {
    const lang = "/en/" + value;
    setLangCookie(lang);

    setPrefLangCookie(lang);
    const element = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement | null;
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event("change"));
    }
    setIsLanguageListOpen(false);
  };

  return (
    <div className="relative">
      <div id="google_translate_element" style={{ display: "none" }}></div>
      <div className="relative">
        <button
          onClick={handleLanguageClick}
          className="block items-center rounded-md text-sm "
        >
          <GlobeAltIcon width={30} height={30} className="text-[#C1AE94]" />
        </button>
        {isLanguageListOpen && (
          <div className="bg- border-white/50shadow-lg absolute top-10 z-10 rounded-md border-[0.75px]">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleLanguageChange(lang.value)}
                className="flex h-[3rem] w-[3rem] items-center justify-center rounded-md  bg-[#BCBCBC]/10 p-2 text-white transition-all duration-300 ease-in-out hover:bg-white/25 focus:border-[#C9B192] focus:outline-none focus:ring-[0.5px] focus:ring-[#C9B192]"
              >
                <Image
                  src={lang.logo}
                  alt="Language Logo"
                  width={25}
                  height={25}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
};
