import Hero from './HeroDivTry';
import ProjectCard from "./ProjectCard";
import { projectsArray } from "../data/projects";
import styles from './Landing.module.css';

export default function Landing() {
  const gridLines = [];
  const galleryHeight = 2600 + projectsArray.length * 1000;

  const aboutMeDivStyle: React.CSSProperties = {
    height: "2600px",
    minHeight: "2600px",
    maxHeight: "2600px",
    position: "relative",
    fontSize: "24px",
  };
  const galleryItemStyle: React.CSSProperties = {
    height: "1000px",
    display: "grid",
    placeItems: "center",
  };


  for (let i = 0; i <= galleryHeight; i += 200) {
    const pxMark = i;
    gridLines.push(
      <div
        key={pxMark}
        className={styles.gridLine}
        style={{ top: `${i}px` }}  // keep only top dynamic
      >
        <span className={styles.gridLabel}>{pxMark}px</span>
      </div>
    );
  }

  return (
    <div className={styles.landingContainer}>
      {gridLines}
      <Hero />
      <section style={aboutMeDivStyle}>
        <h2 className={styles.textLine} style={{ top: '700px' }}>
          Welcome to
        </h2>
        <h2 style={{ position: 'absolute', top: '830px', right: '82vw' }}>https://</h2>
        <h2 className={styles.textLine} style={{ top: '1200px' }}>
          a gallery in the ether
        </h2>

        <h2 className={styles.textLine} style={{ top: '1700px' }}>
          I am
        </h2>
        <h2 className={styles.textLine} style={{ top: '2200px' }}>
          a multi-disciplinary Artist with a background in <br /> Design, Engineering & Data
        </h2>



      </section>
      <section>
        <h2 className={styles.galleryTitle}>PROJECTS</h2>
        {projectsArray.map((project) => (
          <div key={project.slug} style={galleryItemStyle}>
            <ProjectCard {...project} />
          </div>
        ))}
      </section>
    </div >
  );
}
