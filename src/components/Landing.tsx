import ProjectCard from "./ProjectCard";
import { projectsArray } from "../data/projects";
import styles from "./Landing.module.css";
import ShapesLayer from "./ShapesLayer";
import SocialLinks from "./Socials";
import StarsBackground from "./StarsBackground";

export default function Landing() {
  const aboutMeDivStyle: React.CSSProperties = {
    height: "2800px",
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

  return (
    <div className={styles.landingContainer}>
      <StarsBackground />
      <section style={aboutMeDivStyle}>
        <h1 className={styles.textLine} style={{ top: "700px" }}>
          Welcome to
        </h1>
        <h2 className={styles.httptext}>https://</h2>
        <span style={{ position: "absolute", left: "-9999px", top: "1050px", height: "1px", width: "1px", overflow: "hidden", }} tabIndex={0}>
          Leff.in
        </span>

        <h2 className={styles.textLine} style={{ top: "1200px" }}>
          a gallery of some of my work, in this ether
        </h2>

        <h2 className={styles.textLine} style={{ top: "1700px" }}>
          I am
        </h2>
        <span style={{ position: "absolute", left: "-9999px", top: "2100px", height: "1px", width: "1px", overflow: "hidden", }} tabIndex={0}>
          Leffin
        </span>

        <h2 className={styles.textLine} style={{ top: "2200px" }}>
          a multi-disciplinary Artist with a background in <br /> Design,
          Engineering & Data
        </h2>

        <SocialLinks />
        <h2 className={styles.galleryTitle} style={{ top: "2800px" }}>
          PROJECTS
        </h2>
      </section>
      {projectsArray.map((project) => (
        <div key={project.slug} style={galleryItemStyle}>
          <ProjectCard
            name={project.name}
            slug={project.slug}
            thumbnail={project.thumbnail}
            year={project.year.toString()} // convert number to string
            width={project.width}
            height={project.height}
            tags={project.tags}
          />
        </div>
      ))}

      <ShapesLayer />
      <div style={{ height: "500px" }}></div>
    </div>
  );
}
