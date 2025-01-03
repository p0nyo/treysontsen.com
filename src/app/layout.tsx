import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const urbanist = Urbanist({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Treyson Tsen",
  description: "Portfolio Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-200">
      <head>
        <meta name="title" property="og:title" content="Treyson Tsen" />
        <meta name="image" property="og:image" content="https://raw.githubusercontent.com/p0nyo/portfolio-website/main/src/app/landing-page.jpg" />
      </head>
      <body className={urbanist.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
