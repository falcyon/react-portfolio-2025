"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { useVideoVisibility } from "./hooks";
import { loadedMedia } from "./mediaLoadStore";
import styles from "./FeaturedProjects.module.css";

function FeaturedCard({ project }: { project: Project }) {
  const isVideo = /\.(mp4|webm|ogg)$/i.test(project.thumbnail);
  const alreadyLoaded = loadedMedia.has(project.thumbnail);
  const [canLoadMedia, setCanLoadMedia] = useState(alreadyLoaded);
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoVisibility(videoRef, isVideo && canLoadMedia);

  useEffect(() => {
    if (!alreadyLoaded) setCanLoadMedia(true);
  }, [alreadyLoaded]);

  const handleLoad = () => {
    loadedMedia.add(project.thumbnail);
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={styles.card}
      onClick={() => {
        sessionStorage.setItem("navigated-from-landing", "true");
        window.umami?.track("featured-click", { project: project.slug });
      }}
    >
      <div className={styles.thumbnailWrap}>
        {canLoadMedia && isVideo && (
          <video
            ref={videoRef}
            src={project.thumbnail}
            loop
            muted
            playsInline
            preload="metadata"
            className={styles.thumbnail}
            onLoadedData={handleLoad}
          />
        )}
        {canLoadMedia && !isVideo && (
          <Image
            src={project.thumbnail}
            alt={`${project.name} thumbnail`}
            width={project.width}
            height={project.height}
            className={styles.thumbnail}
            onLoad={handleLoad}
          />
        )}
      </div>
      <div className={styles.cardInfo}>
        <span className={styles.cardName}>{project.name}</span>
        <span className={styles.cardYear}>{project.year}</span>
      </div>
      <p className={styles.cardDescription}>{project.description}</p>
    </Link>
  );
}

export default function FeaturedProjects({
  projects,
}: {
  projects: Project[];
}) {
  const featured = useMemo(() => {
    return projects
      .filter((p) => p.featured)
      .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
  }, [projects]);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Selected Work</h2>
        <Link href="/projects" className={styles.viewAll}>
          View all projects &rarr;
        </Link>
      </div>
      <div className={styles.grid}>
        {featured.map((project) => (
          <FeaturedCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
