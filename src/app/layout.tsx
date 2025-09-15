import type { Metadata } from "next";
import "./globals.css";
import GridOverlay from "@/components/GridOverlay";

export const metadata: Metadata = {
  title: "Leffin - Portfolio",
  description: "Leffin's personal portfolio showcasing projects, skills, and experiences.",
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

      </head>
      <body>
        <GridOverlay />
        {children}
      </body>
    </html>
  );
}
