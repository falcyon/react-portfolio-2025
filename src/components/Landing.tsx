// import Hero from "./Hero";
import ProjectCard from "./ProjectCard";
import { projectsArray } from "../data/projects";
import styles from "./Landing.module.css";
import ShapesLayer from "./ShapesLayer";
import SocialLinks from "./Socials";

export default function Landing() {
  const gridLines = [];
  const galleryHeight = 2700 + projectsArray.length * 1200;

  const aboutMeDivStyle: React.CSSProperties = {
    height: "2700px",
    // minHeight: "2600px",
    // maxHeight: "2600px",
    position: "relative",
    fontSize: "24px",
  };
  const galleryItemStyle: React.CSSProperties = {
    height: "1200px",
    display: "grid",
    placeItems: "center",
    zIndex: 1,
    position: "relative",
    transform: "translateZ(0)", // fix z-index bug on Chrome
  };

  const offset = 600; // Adjust this value to shift the grid lines up or down
  for (let i = 0; i <= galleryHeight; i += 200) {
    const pxMark = i - offset;
    gridLines.push(
      <div
        key={pxMark}
        className={styles.gridLine}
        style={{ top: `${i}px` }} // keep only top dynamic
      >
        <span className={styles.gridLabel}>{pxMark}px</span>
      </div>
    );
  }

  return (
    <div className={styles.landingContainer}>
      {/* {gridLines} */}

      <section style={aboutMeDivStyle}>
        <h2 className={styles.textLine} style={{ top: "700px" }}>
          Welcome to
        </h2>
        <h2 className={styles.httptext}>https://</h2>
        <h2 className={styles.textLine} style={{ top: "1200px" }}>
          a gallery in the ether
        </h2>

        <h2 className={styles.textLine} style={{ top: "1700px" }}>
          I am
        </h2>
        <h2 className={styles.textLine} style={{ top: "2200px" }}>
          a multi-disciplinary Artist with a background in <br /> Design,
          Engineering & Data
        </h2>
        <SocialLinks />
        <h2 className={styles.galleryTitle} style={{ top: "2500px" }}>PROJECTS</h2>
      </section>
      {/* <Hero /> */}
      {/* <section> */}

      {projectsArray.map((project) => (
        <div key={project.slug} style={galleryItemStyle}>
          <ProjectCard {...project} />
        </div>
      ))}
      {/* </section> */}
      <ShapesLayer />
    </div>

  );
}
