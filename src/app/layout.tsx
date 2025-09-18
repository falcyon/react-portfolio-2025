import type { Metadata } from "next";
import "./globals.css";
import GridOverlay from "@/components/GridOverlay";
import LenisProvider from "@/components/LenisProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
export const metadata: Metadata = {
  title: {
    default: "Leffin - Portfolio Home",
    template: "Leffin - %s",
  },
  description: "Leffin is an artist who blends technology and creativity. Explore his immersive projects here.",
  openGraph: {
    title: "Leffin | Interactive & Experiential Artist",
    description: "Leffin is an artist who blends technology and creativity. Explore his immersive projects here.",
    url: "https://leff.in",
    siteName: "Leffin Portfolio",
    images: [
      {
        url: "https://leff.in/leffin_opengraphimage.png",
        width: 1200,
        height: 630,
        alt: "Leffin Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leffin | Interactive & Experiential Artist",
    description: "Leffin is an artist who blends technology and creativity. Explore his immersive projects here.",
    images: ["https://leff.in/leffin_opengraphimage.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/qje5ynx.css" />

      </head>
      <body>
        <LenisProvider>
          <GridOverlay />
          {children}
        </LenisProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
