import { notFound } from "next/navigation";
import { Locale, hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import Script from "next/script";
import { Providers } from "./providers";
if (process.env.NODE_ENV !== "production") {
  require("../assets/styles/globals.css");
} else {
  require("../assets/styles/build.css");
}
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "IndexPage" });

  return {
    title: "Symphony of Nature | ECHO NUSANTARA | Premium Quality Bird's Nest",
    description:
      "We believe that when you respect the harmony of nature's ecosystem, humans and nature can co-exist in a beautiful symphony.",
    openGraph: {
      title:
        "Symphony of Nature | ECHO NUSANTARA | Premium Quality Bird's Nest",
      description:
        "We believe that when you respect the harmony of nature's ecosystem, humans and nature can co-exist in a beautiful symphony.",
      url: "https://echonusantara.com",
      site_name:
        "Symphony of Nature | ECHO NUSANTARA | Premium Quality Bird's Nest",
      type: "website",
      images: [
        {
          url: "https://echonusantara.com/icon-flower.svg",
          width: 1200,
          height: 630,
          alt: "Symphony of Nature | ECHO NUSANTARA | Premium Quality Bird's Nest",
        },
      ],
    },
    twitter: {
      site: "",
      title: "Echo Nusantara",
      description:
        "We believe that when you respect the harmony of nature's ecosystem, humans and nature can co-exist in a beautiful symphony. We are born from nature, and ECHO seeks to reestablish that innate connection",
      image: "https://echonusantara.com/icon-flower.svg",
    },
    meta: [
      { name: "robots", content: "index, follow" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "ECHO NUSANTARA" },
      { name: "theme-color", content: "#FFFFFF" },
    ],
  };
}

type Props = {
  children: ReactNode;
  params: { locale: Locale };
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = params;
  const messages = await getMessages({ locale });

  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }

  // Enable static rendering
  setRequestLocale(locale);

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ECHO NUSANTARA",
    url: "https://echonusantara.com",
    logo: "https://echonusantara.com/icon-flower.svg",
    sameAs: ["https://www.facebook.com/", "https://twitter.com/"],
  };

  const imageSchemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: "https://echonusantara.com/icon-flower.svg",
    width: 1200,
    height: 630,
    description:
      "Symphony of Nature | ECHO NUSANTARA | Premium Quality Bird's Nest",
  };

  return (
    <html lang={locale} className={inter.className}>
      <head>
        <link rel="icon" href="/icon-flower.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-flower.svg" sizes="180x180" />
        <link rel="canonical" href="https://echonusantara.com" />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="https://echonusantara.com/sitemap.xml"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="ECHO NUSANTARA" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Google Analytics */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-MVNQRCW3KW"
        />
        <Script id="google-analytics-setup" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MVNQRCW3KW');
          `}
        </Script>

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(imageSchemaMarkup),
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
