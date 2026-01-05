"use client";

import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { projectsArray } from "../data/projects";
import styles from "./Landing.module.css";
import ShapesLayer from "./ShapesLayer";
import SocialLinks from "./Socials";
import StarsBackground from "./StarsBackground";

export default function Landing() {
  const [pageReady, setPageReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  // Page styles
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

  // 1. Mark page as ready after hydration
  useEffect(() => {
    setPageReady(true);
  }, []);

  // 2. Sequentially reveal projects
  useEffect(() => {
    if (!pageReady) return;
    if (visibleCount >= projectsArray.length) return;

    const timeout = setTimeout(() => {
      setVisibleCount((count) => count + 1);
    }, 150); // adjust pacing here

    return () => clearTimeout(timeout);
  }, [pageReady, visibleCount]);

  return (
    <div className={styles.landingContainer}>
      <StarsBackground />

      <section style={aboutMeDivStyle}>
        <h1 className={styles.textLine} style={{ top: "700px" }}>
          Welcome to
        </h1>

        <h2 className={styles.httptext}>https://</h2>

        <span
          style={{
            position: "absolute",
            left: "-9999px",
            top: "1050px",
            height: "1px",
            width: "1px",
            overflow: "hidden",
          }}
          tabIndex={0}
        >
          Leff.in
        </span>

        <h2 className={styles.textLine} style={{ top: "1200px" }}>
          a gallery of some of my work, in this ether
        </h2>

        <h2 className={styles.textLine} style={{ top: "1700px" }}>
          I am
        </h2>

        <span
          style={{
            position: "absolute",
            left: "-9999px",
            top: "2100px",
            height: "1px",
            width: "1px",
            overflow: "hidden",
          }}
          tabIndex={0}
        >
          Leffin
        </span>

        <h2 className={styles.textLine} style={{ top: "2200px" }}>
          a multi-disciplinary Artist with a background in <br />
          Design, Engineering & Data
        </h2>

        <SocialLinks />

        <h2 className={styles.galleryTitle} style={{ top: "2800px" }}>
          PROJECTS
        </h2>
      </section>

      {/* Sequential project rendering */}
      {projectsArray.slice(0, visibleCount).map((project) => (
        <div key={project.slug} style={galleryItemStyle}>
          <ProjectCard
            name={project.name}
            slug={project.slug}
            thumbnail={project.thumbnail}
            year={project.year.toString()}
            tags={project.tags}
          />
        </div>
      ))}

      <ShapesLayer />
      <div style={{ height: "500px" }} />
    </div>
  );
}
