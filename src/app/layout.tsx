import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nano Design AI - AI 设计生成器 | 6大领域30+场景",
  description: "使用 Nano Banana 2 AI 引擎，一键生成高质量设计作品。涵盖设计、内容创作、教育科普、生活方式、商业营销、娱乐媒体 6 大领域，30+ 细分场景。免费在线 AI 设计工具。",
  keywords: [
    "AI设计", "AI生成器", "Nano Banana", "设计工具", "内容创作", 
    "商业营销", "教育科普", "生活方式", "娱乐媒体", "免费AI工具",
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
    title: "Nano Design AI - AI 设计生成器",
    description: "使用 Nano Banana 2 AI 引擎，一键生成高质量设计作品。涵盖 6 大领域 30+ 场景。",
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
    title: "Nano Design AI - AI 设计生成器",
    description: "使用 Nano Banana 2 AI 引擎，一键生成高质量设计作品。",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
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
      </head>
      <body>{children}</body>
    </html>
  );
}
