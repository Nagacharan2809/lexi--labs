import type { Metadata, Viewport } from "next";
import { Archivo, Fragment_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
});

export const metadata: Metadata = {
  title: "Lexi Labs — AI Employees That Do the Work",
  description:
    "Lexi Labs builds AI employees that execute real business workflows across sales, marketing, support and operations. Powered by Fleen.",
  keywords: [
    "AI employees",
    "AI workforce",
    "AI agents",
    "business automation",
    "Fleen",
    "Lexi Labs",
  ],
  openGraph: {
    title: "Lexi Labs — AI Employees That Do the Work",
    description:
      "AI employees that execute real business workflows across sales, marketing, support and operations.",
    siteName: "Lexi Labs",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafaf7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${fragmentMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="meta sr-only z-[80] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
