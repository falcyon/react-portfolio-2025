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

        <meta property="og:title" content="Leffin - Artist Portfolio" />
        <meta property="og:description" content="Leffin and his interactive experiential art projects" />
        <meta property="og:image" content="%PUBLIC_URL%/Leffin_Portfolio.png" />
        <meta property="og:url" content="https://leff.in" />
        <meta property="og:type" content="website" />


        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Leffin - Artist Portfolio" />
        <meta name="twitter:description" content="Leffin and his interactive experiential art projects" />
        <meta name="twitter:image" content="%PUBLIC_URL%/Leffin_Portfolio.png" />


      </head>
      <body>
        <GridOverlay />
        {children}
      </body>
    </html>
  );
}
