import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nano Design AI - AI-Powered Interior Design & Architecture",
  description: "Generate high-fidelity 'Black & Gold' style interior and architectural designs instantly with Nano Design AI.",
  keywords: ["AI design", "interior design", "architecture", "nano design", "black gold style", "AI generator"],
  openGraph: {
    title: "Nano Design AI - AI-Powered Interior Design & Architecture",
    description: "Generate high-fidelity 'Black & Gold' style interior and architectural designs instantly with Nano Design AI.",
    url: "https://nano-design-ai.vercel.app",
    siteName: "Nano Design AI",
    images: [
      {
        url: "https://nano-design-ai.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nano Design AI Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Design AI - AI-Powered Interior Design & Architecture",
    description: "Generate high-fidelity 'Black & Gold' style interior and architectural designs instantly with Nano Design AI.",
    images: ["https://nano-design-ai.vercel.app/og-image.png"],
  },
  metadataBase: new URL("https://nano-design-ai.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Nano Design AI",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web",
    "description": "Generate high-fidelity 'Black & Gold' style interior and architectural designs instantly with Nano Design AI.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
