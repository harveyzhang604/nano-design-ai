import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nano Design AI - AI-Powered Interior Design & Architecture",
  description: "Generate high-fidelity 'Black & Gold' style interior and architectural designs instantly with Nano Design AI.",
  keywords: ["AI design", "interior design", "architecture", "nano design", "black gold style", "AI generator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
