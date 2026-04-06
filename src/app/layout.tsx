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
    "AI-powered content repurposing. Paste a blog post, video transcript, or podcast — get Twitter threads, LinkedIn posts, Instagram captions, TikTok scripts and newsletters in seconds.",
  keywords: ["content repurposing", "AI content", "social media automation", "Twitter threads", "LinkedIn content"],
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="min-h-full flex flex-col bg-[#080305] text-white">
        {children}
      </body>
    </html>
  );
}
