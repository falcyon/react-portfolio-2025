import type { Metadata } from "next";
import "./globals.css";
import GridOverlay from "@/components/GridOverlay";


export const metadata: Metadata = {
  title: "Leffin - Portfolio",
  description: "Leffin's personal art portfolio showcasing projects, skills, and experiences.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/qje5ynx.css" />
        {/* <link id="favicon" rel="icon" href="/favicon-light.ico" /> */}

        <meta property="og:title" content="Leffin | An Interactive & Experiential Artist" />
        <meta property="og:description" content="Leffin is an artist who blends technology and creativity. Explore his immersive projects here." />
        <meta property="og:image" content="https://leff.in/leffin_opengraphimage.png" />
        <meta property="og:url" content="https://leff.in" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Leffin Portfolio" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Leffin | An Interactive & Experiential Artist" />
        <meta name="twitter:description" content="Leffin is an artist who blends technology and creativity. Explore his immersive projects here." />
        <meta name="twitter:image" content="https://leff.in/leffin_opengraphimage.png" />


      </head>
      <body>
        <GridOverlay />
        {children}
      </body>
    </html>
  );
}
