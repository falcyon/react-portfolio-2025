"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { useVideoVisibility } from "./hooks";
import { loadedMedia, requestLoad, cancelLoad, signalLoaded } from "./mediaLoadStore";
import styles from "./ProjectsGrid.module.css";
import cardStyles from "./Card.module.css";

// Preset filters that map to multiple tags
const PRESETS: { label: string; tags: string[] }[] = [
  { label: "All", tags: [] },
  {
    label: "New Media Art",
    tags: [
      "Physical",
      "AI/ML",
      "Performance",
      "Interactive",
      "Digital",
      "Arduino",
      "Python",
      "Computer Vision",
      "p5.js",
    ],
  },
  {
    label: "Design",
    tags: [
      "Product Design",
      "Branding",
      "Figma",
    ],
  },
];

function GridCard({ project, onTagClick, activeTags }: { project: Project; onTagClick: (tag: string) => void; activeTags: Set<string> }) {
  const isVideo = /\.(mp4|webm|ogg)$/i.test(project.thumbnail);
  const alreadyLoaded = loadedMedia.has(project.thumbnail);
  const [canLoadMedia, setCanLoadMedia] = useState(alreadyLoaded);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoVisibility(videoRef, isVideo && canLoadMedia);

  // Staggered loading — join queue, load when slot available
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

  const showVideo = canLoadMedia && isVideo;
  const showImage = canLoadMedia && !isVideo;

  return (
    <div className={cardStyles.card}>
      <Link
        href={`/projects/${project.slug}`}
        className={cardStyles.cardLink}
        onClick={() => {
          sessionStorage.setItem("navigated-from-landing", "true");
          window.umami?.track("project-click", { project: project.slug });
        }}
      >
        <div ref={wrapRef} className={cardStyles.thumbnailWrap}>
          {showVideo && (
            <video
              ref={videoRef}
              src={project.thumbnail}
              loop
              muted
              playsInline
              preload="metadata"
              tabIndex={-1}
              className={cardStyles.thumbnail}
              onLoadedData={handleLoad}
              onError={handleLoad}
            />
          )}
          {showImage && (
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
      <div className={cardStyles.cardTags}>
        {project.tags.map((tag) => (
          <button
            key={tag}
            className={`${cardStyles.cardTag} ${activeTags.has(tag) ? cardStyles.cardTagActive : ""}`}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsGrid({
  projects,
}: {
  projects: Project[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse active tags from URL
  const activeTags = useMemo(() => {
    const param = searchParams.get("tags");
    if (!param) return new Set<string>();
    return new Set(param.split(",").filter(Boolean));
  }, [searchParams]);

  // All unique tags sorted by frequency
  const allTags = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [projects]);

  // Active preset detection
  const activePreset = useMemo(() => {
    if (activeTags.size === 0) return "All";
    for (const preset of PRESETS) {
      if (preset.tags.length === 0) continue;
      // Check if all active tags belong to this preset
      const presetSet = new Set(preset.tags);
      const allInPreset = [...activeTags].every((t) => presetSet.has(t));
      if (allInPreset) return preset.label;
    }
    return null;
  }, [activeTags]);

  const updateTags = useCallback(
    (newTags: Set<string>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newTags.size === 0) {
        params.delete("tags");
      } else {
        params.set("tags", [...newTags].join(","));
      }
      const qs = params.toString();
      router.replace(`/projects${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router]
  );

  const toggleTag = useCallback(
    (tag: string) => {
      // If tag is already the only active one, deselect it
      if (activeTags.has(tag) && activeTags.size === 1) {
        updateTags(new Set());
      } else {
        // Single-select: replace with just this tag
        updateTags(new Set([tag]));
      }
    },
    [activeTags, updateTags]
  );

  const applyPreset = useCallback(
    (preset: (typeof PRESETS)[number]) => {
      if (preset.tags.length === 0) {
        updateTags(new Set());
      } else {
        updateTags(new Set(preset.tags));
      }
    },
    [updateTags]
  );

  // Filter projects: AND logic — project must have at least one of the active tags
  // (With presets selecting broad categories, OR within the active set makes more sense)
  const filtered = useMemo(() => {
    if (activeTags.size === 0) return projects;
    return projects.filter((p) => p.tags.some((t) => activeTags.has(t)));
  }, [projects, activeTags]);

  // Show/hide individual tags
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 12);

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <div className={styles.presetsRow}>
          <div className={styles.presets}>
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                className={`${styles.presetBtn} ${activePreset === preset.label ? styles.presetActive : ""}`}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tagsRow}>
          {visibleTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.tagBtn} ${activeTags.has(tag) ? styles.tagActive : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
          {allTags.length > 12 && (
            <button
              className={styles.tagBtn}
              onClick={() => setShowAllTags(!showAllTags)}
            >
              {showAllTags ? "Less" : `+${allTags.length - 12} more`}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.map((project) => (
          <GridCard key={project.slug} project={project} onTagClick={toggleTag} activeTags={activeTags} />
        ))}
      </div>
    </div>
  );
}
