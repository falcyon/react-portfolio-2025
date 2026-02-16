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
      "Quantum",
    ],
  },
  {
    label: "Design",
    tags: [
      "Product Design",
      "Branding",
    ],
  },
];

function GridCard({ project }: { project: Project }) {
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
        window.umami?.track("project-click", { project: project.slug });
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
      <div className={cardStyles.cardTags}>
        {project.tags.map((tag) => (
          <span key={tag} className={cardStyles.cardTag}>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default function ProjectsGrid({
  projects,
}: {
  projects: Project[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Push grid down to account for fixed filter bar height
  useEffect(() => {
    const el = filterBarRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      el.parentElement?.style.setProperty(
        "--filter-bar-height",
        `${el.offsetHeight}px`
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      const next = new Set(activeTags);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      updateTags(next);
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
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 8);

  return (
    <div className={styles.container}>
      {/* Fixed filter bar */}
      <div className={styles.filterBar} ref={filterBarRef}>
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
          {allTags.length > 8 && (
            <button
              className={styles.tagBtn}
              onClick={() => setShowAllTags(!showAllTags)}
            >
              {showAllTags ? "Less" : `+${allTags.length - 8} more`}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.map((project) => (
          <GridCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
