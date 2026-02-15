export interface NewsItem {
  text: string;
  link?: string;
  linkText?: string;
  date: string; // ISO date for staleness detection
}

export const newsItems: NewsItem[] = [
  {
    text: "Preparing for Currents New Media Festival 2026",
    link: "https://currentsnewmedia.org",
    linkText: "Currents",
    date: "2026-02-01",
  },
  {
    text: "Ephemera shown at NYCxDesign 2025",
    link: "/projects/ephemera",
    linkText: "View project",
    date: "2025-05-01",
  },
];
