// import Hero from "./Hero";
import ProjectCard from "./ProjectCard";
import { projectsArray } from "../data/projects";
import styles from "./Landing.module.css";
import ShapesLayer from "./ShapesLayer";
import SocialLinks from "./Socials";
import Head from "next/head";
export default function Landing() {

  const aboutMeDivStyle: React.CSSProperties = {
    height: "3000px",
    // minHeight: "2600px",
    // maxHeight: "2600px",
    position: "relative",
    fontSize: "24px",
  };
  const galleryItemStyle: React.CSSProperties = {
    height: "1000px",
    display: "grid",
    placeItems: "center",
    zIndex: 1,
    position: "relative",
    transform: "translateZ(0)", // fix z-index bug on Chrome
  };
  const allTags = Array.from(new Set(projectsArray.flatMap(p => p.tags)));
  const allProjectNames = projectsArray.map(p => p.name).join(", ");

  const description = `Explore projects: ${allProjectNames}. Years: ${projectsArray.map(p => p.year).join(", ")}. Tags: ${allTags.join(", ")}.`;

  const keywords = `${allProjectNames}, ${allTags.join(", ")}`;

  // Optional: JSON-LD structured data for projects
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": projectsArray.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://leff.in/projects/${p.slug}`,
      name: p.name,
      datePublished: p.year,
      keywords: p.tags.join(", ")
    }))
  };


  return (
    <>
      <Head>
        <title>My Projects</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>


      <div className={styles.landingContainer}>
        {/* {gridLines} */}

        <section style={aboutMeDivStyle}>
          <h2 className={styles.textLine} style={{ top: "700px" }}>
            Welcome to
          </h2>
          <h2 className={styles.httptext}>https://</h2>
          <span style={{
            position: "absolute",
            left: "-9999px",
            top: "1050px",
            height: "1px",
            width: "1px",
            overflow: "hidden",
          }}
            tabIndex={0}>Leff.in</span>

          <h2 className={styles.textLine} style={{ top: "1200px" }}>
            a gallery in the ether
          </h2>

          <h2 className={styles.textLine} style={{ top: "1700px" }}>
            I am
          </h2>
          <span style={{
            position: "absolute",
            left: "-9999px",
            top: "2100px",
            height: "1px",
            width: "1px",
            overflow: "hidden",
          }} tabIndex={0}>Leffin</span>

          <h2 className={styles.textLine} style={{ top: "2200px" }}>
            a multi-disciplinary Artist with a background in <br /> Design,
            Engineering & Data
          </h2>
          <SocialLinks />
          <h2 className={styles.galleryTitle} style={{ top: "2900px" }}>PROJECTS</h2>
        </section>
        {/* <Hero /> */}
        {/* <section> */}

        {projectsArray.map((project) => (
          <div key={project.slug} style={galleryItemStyle}>
            <ProjectCard
              name={project.name}
              slug={project.slug}
              thumbnail={project.thumbnail}
              year={project.year.toString()} // convert number to string
              tags={project.tags}
            />

          </div>
        ))}
        {/* </section> */}
        <ShapesLayer />
      </div>
      <div style={{ height: "1000px" }}></div >
    </>
  );
}
