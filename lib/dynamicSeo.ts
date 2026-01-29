import { Metadata } from "next";
import { seoData } from "@/json";
import { cn } from "@/lib/utils";

const DynamicSeo = (index: number): Metadata => {
  const currentSeoData = seoData[index] || {};

  return {
    title: currentSeoData.LAYOUT_SEO_TITLE || "",
    description: currentSeoData.LAYOUT_SEO_DESCRIPTION || "",
    generator: currentSeoData.LAYOUT_CREATORS || "",
    applicationName: currentSeoData.LAYOUT_APPLICATION_NAME || "",
    referrer: "origin-when-cross-origin",
    keywords: currentSeoData.LAYOUT_KEYWORDS || "",
    authors: [
      {
        name: "SapphireCredit Exchange",
        url: "https://samsung-fold-7.connectwithsapphire.com/",
      },
    ],
    creator: currentSeoData.LAYOUT_CREATORS || "",
    publisher: "Sapphire Virtual Network Limited",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(cn(currentSeoData.LAYOUT_URL || "")),
    alternates: {
      canonical: currentSeoData.LAYOUT_URL || "",
      languages: {
        "en-US": "/en-US",
      },
    },
    openGraph: {
      title: currentSeoData.LAYOUT_SEO_TITLE || "",
      description: currentSeoData.LAYOUT_SEO_DESCRIPTION || "",
      url: currentSeoData.LAYOUT_URL || "",
      siteName: currentSeoData.LAYOUT_APPLICATION_NAME || "",
      images: [
        {
          url: "/images/og.png",
          width: 1996,
          height: 872,
          alt: currentSeoData.LAYOUT_APPLICATION_NAME || "",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    robots: {
      index: true, // Allows search engines to index the page
      follow: true, // Allows search engines to follow links on the page
      nocache: true, // Prevents search engines from caching the page
      googleBot: {
        index: true, // Allows Googlebot to index the page
        follow: true, // Allows Googlebot to follow links
        noimageindex: true, // Prevents Google from indexing images
        "max-video-preview": -1, // Allows unlimited video previews
        "max-image-preview": "large", // Allows large image previews
        "max-snippet": -1, // Allows unlimited text snippets
      },
    },
    icons: {
      icon: [
        { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      shortcut: "/images/favicon-32x32.png",
      apple: [
        {
          url: "/images/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: {
        rel: "/images/android-chrome-512x512",
        url: "/images/android-chrome-512x512.png",
      },
    },
    verification: {
      google: "We-ws3A5LZKL1ccqgaoSzg-e6kRdRlMXlgKPWvEDP6o",
      yandex: "21bf5d2f690a11c9",
      yahoo: "b91628d9ce0e835cf74e62eab04e5fd3",
      other: {
        "facebook-domain-verification": ["es6d6v9o1kur3zsrb0sbzzyueeac0w"],
      },
    },
    twitter: {
      card: "summary_large_image",
      title: currentSeoData.LAYOUT_APPLICATION_NAME || "",
      description: currentSeoData.LAYOUT_SEO_DESCRIPTION || "",
      creator: "@sapphire virtual network ltd",
      site: "@sapphire virtual network ltd",
      images: [
        {
          url: "/images/og.png",
          alt: currentSeoData.LAYOUT_APPLICATION_NAME || "",
        },
      ],
    },
    category: "technology",
    classification: "Business & Consumer Services",
  };
};

export default DynamicSeo;
