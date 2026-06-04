import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "treysontsen.com",
  description: "personal website for treyson tsen",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
