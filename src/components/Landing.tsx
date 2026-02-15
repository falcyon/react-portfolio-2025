"use client";

import GlyphinHost from "./glyphins/GlyphinHost";
import NewsSection from "./NewsSection";
import FeaturedProjects from "./FeaturedProjects";
import PagePreloader from "./PagePreloader";
import { projectsArray } from "../data/projects";
import { newsItems } from "../data/news";
import styles from "./Landing.module.css";

export default function Landing() {
  return (
    <div className={styles.landingContainer}>
      <PagePreloader />
      <GlyphinHost />
      <NewsSection items={newsItems} />
      <FeaturedProjects projects={projectsArray} />
    </div>
  );
}
