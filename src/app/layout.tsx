import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContentRepurposer — Turn One Post Into Content For Every Platform",
  description:
    "AI-powered content repurposing. Paste a blog post or transcript — get Twitter threads, LinkedIn posts, and more in seconds.",
  keywords: ["content repurposing", "AI content", "social media automation", "Twitter threads", "LinkedIn content"],
  metadataBase: new URL("https://contentrepurposer.eazyweb.nc"),
  alternates: {
    canonical: "https://contentrepurposer.eazyweb.nc",
  },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  openGraph: {
    title: "ContentRepurposer — AI Content Repurposing for Every Platform",
    description:
      "Turn one piece of content into posts for every platform. Save 80% of your content creation time.",
    url: "https://contentrepurposer.eazyweb.nc",
    siteName: "ContentRepurposer",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentRepurposer — AI Content Repurposing",
    description: "Turn one piece of content into posts for every platform.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "ContentRepurposer",
      url: "https://contentrepurposer.eazyweb.nc",
      publisher: {
        "@type": "Organization",
        name: "EazyWebNC",
        url: "https://eazyweb.nc",
        logo: { "@type": "ImageObject", url: "https://eazyweb.nc/logo.png" },
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "ContentRepurposer",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://contentrepurposer.eazyweb.nc",
      description:
        "AI-powered content repurposing. Turn one post into content for every platform in seconds.",
      offers: [
        { "@type": "Offer", name: "Starter", price: "19", priceCurrency: "USD" },
        { "@type": "Offer", name: "Creator", price: "49", priceCurrency: "USD" },
        { "@type": "Offer", name: "Agency", price: "99", priceCurrency: "USD" },
      ],
      creator: { "@type": "Organization", name: "EazyWebNC", url: "https://eazyweb.nc" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is ContentRepurposer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ContentRepurposer is an AI tool that transforms a single piece of content — blog post, video transcript, or podcast — into optimized posts for every social media platform.",
          },
        },
        {
          "@type": "Question",
          name: "Which content formats can I repurpose?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can repurpose blog posts, video transcripts, podcast episodes, newsletters, and more. ContentRepurposer generates Twitter threads, LinkedIn posts, Instagram captions, and TikTok scripts.",
          },
        },
        {
          "@type": "Question",
          name: "How is ContentRepurposer different from RepurposeBot?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ContentRepurposer handles a wider range of input formats including video transcripts and podcasts, while RepurposeBot specializes in blog-to-social transformation. Both are AI-powered.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#080305] text-white">
        {children}
      </body>
    </html>
  );
}
