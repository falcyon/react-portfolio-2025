import Landing from "../components/Landing";
import { projectsArray } from "../data/projects";

// JSON-LD structured data for projects
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: projectsArray.map((p, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://leff.in/projects/${p.slug}`,
    name: p.name,
    datePublished: p.year,
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Landing />
    </>
  );
}
