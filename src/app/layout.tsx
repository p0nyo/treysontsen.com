import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "treysontsen.com",
  description: "personal website for treyson tsen",
  openGraph: {
    type: "website",
    title: "treysontsen.com",
    description: "personal website for treyson tsen",
    url: "https://treysontsen.com",
    images: [{ url: "/website-ogimage.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "treysontsen.com",
    description: "personal website for treyson tsen",
    images: ["/website-ogimage.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
