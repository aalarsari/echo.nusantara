import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Script from "next/script";

if (process.env.NODE_ENV !== "production") {
  require("../assets/styles/globals.css");
} else {
  require("../assets/styles/build.css");
}

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Symphony of Nature | ECHO NUSANTARA | Premium Quality Bird's Nest",
  description:
    "We believe that when you respect the harmony of nature's ecosystem, humans and nature can co-exist in a beautiful symphony.",
  openGraph: {
    title: "Symphony of Nature | ECHO NUSANTARA | Premium Quality Bird's Nest",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="id" className={inter.className}>
      <head>
        <link rel="icon" href="/icon-flower.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-flower.svg" sizes="180x180" />
        <link rel="canonical" href={metadata.openGraph.url} />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="https://echonusantara.com/sitemap.xml"
        />
        <title lang="id" id="no-translate" translate="no">
          {metadata.openGraph.title}
        </title>
        {metadata.meta.map((tag, index) => (
          <meta key={index} name={tag.name} content={tag.content} />
        ))}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.site_name} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta
          property="og:image:width"
          content={metadata.openGraph.images[0].width.toString()}
        />
        <meta
          property="og:image:height"
          content={metadata.openGraph.images[0].height.toString()}
        />
        <meta
          property="og:image:alt"
          content={metadata.openGraph.images[0].alt}
        />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Google Analytics Script */}

        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-MVNQRCW3KW`}
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
