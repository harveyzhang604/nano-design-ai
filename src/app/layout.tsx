import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Nano Design AI - 完全免费的 AI 图像处理工具 | 真实自然，不改变你",
  description: "完全免费，无需订阅。老照片修复不改变表情，人像增强保留真实纹理。真实、自然、有温度的 AI 图像处理。31个功能，包括背景移除、照片修复、人像增强、卡通化等。",
  keywords: [
    // 英文关键词（SEO优化）
    "free AI photo editor", "AI photo editor no subscription", 
    "AI photo restoration without changing face", "natural skin texture AI portrait",
    "remove background free unlimited", "AI image enhancement free",
    // 中文关键词
    "免费AI图像处理", "AI图片编辑器", "老照片修复", "不改变表情",
    "人像增强", "真实纹理", "背景移除", "照片修复",
    "AI卡通化", "职业漫画化", "年鉴照", "宠物拟人化",
    "无需订阅", "完全免费", "真实自然", "Nano Design AI",
    "图片生成", "AI绘画", "设计灵感", "创意设计"
  ],
  authors: [{ name: "Nano Design AI" }],
  creator: "Nano Design AI",
  publisher: "Nano Design AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://talkphoto.app",
    title: "Nano Design AI - 完全免费的 AI 图像处理工具",
    description: "完全免费，无需订阅。老照片修复不改变表情，人像增强保留真实纹理。真实、自然、有温度的 AI 图像处理。",
    siteName: "Nano Design AI",
    images: [
      {
        url: "https://img.talkphoto.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nano Design AI - AI 设计生成器",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Design AI - 完全免费的 AI 图像处理工具",
    description: "完全免费，无需订阅。老照片修复不改变表情，人像增强保留真实纹理。真实、自然、有温度的 AI 图像处理。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="canonical" href="https://talkphoto.app" />
        <link rel="preconnect" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
        {/* Phase 5: Preconnect to Gemini API */}
        <link rel="preconnect" href="https://generativelanguage.googleapis.com" />
        <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
