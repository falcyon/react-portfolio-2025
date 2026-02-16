"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { useVideoVisibility } from "./hooks";
import { loadedMedia, requestLoad, cancelLoad, signalLoaded } from "./mediaLoadStore";
import styles from "./FeaturedProjects.module.css";
import cardStyles from "./Card.module.css";

function FeaturedCard({ project }: { project: Project }) {
  const isVideo = /\.(mp4|webm|ogg)$/i.test(project.thumbnail);
  const alreadyLoaded = loadedMedia.has(project.thumbnail);
  const [canLoadMedia, setCanLoadMedia] = useState(alreadyLoaded);
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoVisibility(videoRef, isVideo && canLoadMedia);

  useEffect(() => {
    if (alreadyLoaded) return;
    const cb = () => setCanLoadMedia(true);
    requestLoad(cb);
    return () => cancelLoad(cb);
  }, [alreadyLoaded]);

  const handleLoad = () => {
    loadedMedia.add(project.thumbnail);
    signalLoaded();
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cardStyles.card}
      onClick={() => {
        sessionStorage.setItem("navigated-from-landing", "true");
        window.umami?.track("featured-click", { project: project.slug });
      }}
    >
      <div className={cardStyles.thumbnailWrap}>
        {canLoadMedia && isVideo && (
          <video
            ref={videoRef}
            src={project.thumbnail}
            loop
            muted
            playsInline
            preload="metadata"
            className={cardStyles.thumbnail}
            onLoadedData={handleLoad}
          />
        )}
        {canLoadMedia && !isVideo && (
          <Image
            src={project.thumbnail}
            alt={`${project.name} thumbnail`}
            width={project.width}
            height={project.height}
            className={cardStyles.thumbnail}
            onLoad={handleLoad}
          />
        )}
      </div>
      <div className={cardStyles.cardInfo}>
        <span className={cardStyles.cardName}>{project.name}</span>
        <span className={cardStyles.cardYear}>{project.year}</span>
      </div>
      <p className={cardStyles.cardDescription}>{project.description}</p>
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
