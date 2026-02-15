"use client";

import GlyphinHost from "./glyphins/GlyphinHost";
import NewsSection from "./NewsSection";
import FeaturedProjects from "./FeaturedProjects";
import ThumbnailPreloader from "./ThumbnailPreloader";
import PagePreloader from "./PagePreloader";
import { projectsArray } from "../data/projects";
import newsItems from "../content/news.json";
import styles from "./Landing.module.css";

export default function Landing() {
  return (
    <div className={styles.landingContainer}>
      <PagePreloader />
      <GlyphinHost />
      <NewsSection items={newsItems} />
      <FeaturedProjects projects={projectsArray} />
      <ThumbnailPreloader projects={projectsArray} />
    </div>
  );
}
