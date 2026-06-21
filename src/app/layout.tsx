import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Treyson Tsen",
  description: "this is the personal website of treyson tsen, feel free to click in to read more about me or play some tetris",
  openGraph: {
    type: "website",
    title: "treysontsen.com",
    description: "this is the personal website of treyson tsen, feel free to click in to read more about me or play some tetris",
    url: "https://treysontsen.com",
    images: [{ url: "/website-ogimage.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "treysontsen.com",
    description: "this is the personal website of treyson tsen, feel free to click in to read more about me or play some tetris",
    images: ["/website-ogimage.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" translate="no">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "treysontsen[dot]com",
                "url": "https://treysontsen.com",
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "name": "Treyson Tsen",
                "url": "https://treysontsen.com",
                "sameAs": [
                  "https://github.com/p0nyo",
                  "https://www.linkedin.com/in/tsen",
                  "https://x.com/98tsuj98",
                  "https://www.instagram.com/tsennpai/",
                  "https://nz.pinterest.com/treysontsen",
                ],
              },
            ]),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
