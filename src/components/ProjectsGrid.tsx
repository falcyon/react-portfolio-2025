"use client";

import { useEffect, useState, useMemo, useCallback, useRef, useLayoutEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { useVideoVisibility, useVideoRetry } from "./hooks";
import { loadedMedia, requestLoad, cancelLoad, signalLoaded } from "./mediaLoadStore";
import styles from "./ProjectsGrid.module.css";
import cardStyles from "./Card.module.css";

const FLIP_DURATION = 450; // ms — matches --duration-slow

/* ── Animation helpers ── */

function shouldAnimate() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Set elements to hidden state before a staggered reveal. */
function prepareReveal(elements: HTMLElement[]) {
  for (const el of elements) {
    el.style.opacity = "0";
    el.style.transform = "scale(0.97)";
    el.style.transition = "none";
  }
}

/**
 * Start a staggered reveal transition.
 * Call AFTER a forced reflow (void el.offsetHeight) so the browser
 * has committed the initial hidden state from prepareReveal().
 * Returns one cleanup function per element.
 */
function startReveal(
  elements: HTMLElement[],
  duration: number,
  maxStepMs = 20,
): (() => void)[] {
  const step = elements.length > 1
    ? Math.min(maxStepMs, duration / elements.length)
    : 0;

  return elements.map((el, i) => {
    const delay = Math.round(i * step);
    el.style.transition = `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`;
    el.style.opacity = "";
    el.style.transform = "";
    return () => {
      el.style.transition = "";
      el.style.opacity = "";
      el.style.transform = "";
    };
  });
}

/** Total time for a staggered reveal (animation + last card's delay). */
function revealTotalMs(count: number, duration: number, maxStepMs = 20): number {
  const step = count > 1 ? Math.min(maxStepMs, duration / count) : 0;
  return duration + Math.round(count * step);
}

// Persists across client-side navigations so return visits skip the entrance animation
let hasAnimatedInitial = false;

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

function GridCard({
  project,
  onTagClick,
  activeTags,
  cardRef,
}: {
  project: Project;
  onTagClick: (tag: string) => void;
  activeTags: Set<string>;
  cardRef?: (el: HTMLDivElement | null) => void;
}) {
  const isVideo = /\.(mp4|webm|ogg)$/i.test(project.thumbnail);
  const alreadyLoaded = loadedMedia.has(project.thumbnail);
  const [canLoadMedia, setCanLoadMedia] = useState(alreadyLoaded);
  const [mediaLoaded, setMediaLoaded] = useState(alreadyLoaded);
  const videoRef = useRef<HTMLVideoElement>(null);
  useVideoVisibility(videoRef, isVideo && canLoadMedia);

  // Staggered loading — join queue, load when slot available
  useEffect(() => {
    if (alreadyLoaded) return;
    const cb = () => setCanLoadMedia(true);
    requestLoad(cb);
    return () => cancelLoad(cb);
  }, [alreadyLoaded]);

  // Video retry on error / stall
  const { handleLoadedData, handleError } = useVideoRetry({
    videoRef,
    src: project.thumbnail,
    enabled: canLoadMedia && isVideo,
    onSuccess: () => { loadedMedia.add(project.thumbnail); signalLoaded(); setMediaLoaded(true); },
    onGiveUp: () => { signalLoaded(); },
  });

  // Image retry via key remount
  const [imgKey, setImgKey] = useState(0);
  const imgRetries = useRef(0);
  const handleImageLoad = () => { loadedMedia.add(project.thumbnail); signalLoaded(); setMediaLoaded(true); };
  const handleImageError = () => {
    if (imgRetries.current < 2) {
      imgRetries.current++;
      setImgKey(k => k + 1);
    } else {
      signalLoaded();
    }
  };

  const showVideo = canLoadMedia && isVideo;
  const showImage = canLoadMedia && !isVideo;
  const thumbClass = `${cardStyles.thumbnail} ${mediaLoaded ? cardStyles.thumbnailLoaded : ""}`;

  return (
    <div ref={cardRef} className={cardStyles.card}>
      <Link
        href={`/projects/${project.slug}`}
        className={cardStyles.cardLink}
        onClick={() => {
          sessionStorage.setItem("navigated-from-landing", "true");
          window.umami?.track("project-click", { project: project.slug });
        }}
      >
        <div className={`${cardStyles.thumbnailWrap} ${mediaLoaded ? cardStyles.thumbnailWrapLoaded : ""}`}>
          {showVideo && (
            <video
              ref={videoRef}
              src={project.thumbnail}
              loop
              muted
              playsInline
              preload="metadata"
              tabIndex={-1}
              className={thumbClass}
              onLoadedData={handleLoadedData}
              onError={handleError}
            />
          )}
          {showImage && (
            <Image
              key={imgKey}
              src={project.thumbnail}
              alt={`${project.name} thumbnail`}
              width={project.width}
              height={project.height}
              className={thumbClass}
              onLoad={handleImageLoad}
              onError={handleImageError}
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
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const snapshotRef = useRef<{
    positions: Map<string, DOMRect>;
    clones: Map<string, HTMLElement>;
    gridRect: DOMRect;
  } | null>(null);
  const pendingCleanups = useRef<(() => void)[]>([]);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /** Cancel any in-progress animation and run all pending cleanups. */
  const flushCleanups = useCallback(() => {
    if (cleanupTimer.current) { clearTimeout(cleanupTimer.current); cleanupTimer.current = undefined; }
    pendingCleanups.current.forEach((fn) => fn());
    pendingCleanups.current = [];
  }, []);

  /** Schedule cleanup after animation finishes. */
  const scheduleCleanup = useCallback((totalMs: number) => {
    cleanupTimer.current = setTimeout(() => {
      pendingCleanups.current.forEach((fn) => fn());
      pendingCleanups.current = [];
    }, totalMs + 50);
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
      const presetSet = new Set(preset.tags);
      const allInPreset = [...activeTags].every((t) => presetSet.has(t));
      if (allInPreset) return preset.label;
    }
    return null;
  }, [activeTags]);

  // Snapshot card positions + clone DOM nodes before a filter change
  const snapshot = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const gridRect = grid.getBoundingClientRect();
    const positions = new Map<string, DOMRect>();
    const clones = new Map<string, HTMLElement>();
    cardRefs.current.forEach((el, slug) => {
      positions.set(slug, el.getBoundingClientRect());
      const clone = el.cloneNode(true) as HTMLElement;

      // Capture current video frame as a static canvas so the clone
      // shows the last visible frame instead of a blank video element
      const origVideo = el.querySelector("video");
      const cloneVideo = clone.querySelector("video");
      if (origVideo && cloneVideo && origVideo.readyState >= 2) {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = origVideo.videoWidth;
          canvas.height = origVideo.videoHeight;
          canvas.getContext("2d")?.drawImage(origVideo, 0, 0);
          canvas.className = cloneVideo.className;
          cloneVideo.replaceWith(canvas);
        } catch { /* cross-origin or other error — keep the clone video as-is */ }
      }

      clones.set(slug, clone);
    });
    snapshotRef.current = { positions, clones, gridRect };
  }, []);

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
      snapshot();
      if (activeTags.has(tag) && activeTags.size === 1) {
        updateTags(new Set());
      } else {
        updateTags(new Set([tag]));
      }
    },
    [activeTags, updateTags, snapshot]
  );

  const applyPreset = useCallback(
    (preset: (typeof PRESETS)[number]) => {
      snapshot();
      if (preset.tags.length === 0) {
        updateTags(new Set());
      } else {
        updateTags(new Set(preset.tags));
      }
    },
    [updateTags, snapshot]
  );

  // Filter projects: OR logic — project must have at least one of the active tags
  const filtered = useMemo(() => {
    if (activeTags.size === 0) return projects;
    return projects.filter((p) => p.tags.some((t) => activeTags.has(t)));
  }, [projects, activeTags]);

  // Initial page-load entrance: staggered fade-in for all cards
  useLayoutEffect(() => {
    if (hasAnimatedInitial) return;
    hasAnimatedInitial = true;

    if (!shouldAnimate()) return;

    const grid = gridRef.current;
    if (!grid) return;

    const cards: HTMLDivElement[] = [];
    cardRefs.current.forEach((el) => cards.push(el));
    if (cards.length === 0) return;

    prepareReveal(cards);
    void grid.offsetHeight;
    pendingCleanups.current = startReveal(cards, FLIP_DURATION, 80);
    scheduleCleanup(revealTotalMs(cards.length, FLIP_DURATION, 80));

    return flushCleanups;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FLIP + exit/enter animation after filter change
  useLayoutEffect(() => {
    const snap = snapshotRef.current;
    if (!snap) return flushCleanups;
    snapshotRef.current = null;

    if (!shouldAnimate()) return flushCleanups;

    const grid = gridRef.current;
    if (!grid) return flushCleanups;

    // Cancel any in-progress animation (including initial entrance)
    flushCleanups();

    const currentSlugs = new Set(filtered.map((p) => p.slug));

    // EXIT: append clones for removed cards, fade out at old position
    const exitClones: HTMLElement[] = [];
    snap.positions.forEach((oldRect, slug) => {
      if (currentSlugs.has(slug)) return;
      const clone = snap.clones.get(slug);
      if (!clone) return;

      Object.assign(clone.style, {
        position: "absolute",
        left: `${oldRect.left - snap.gridRect.left}px`,
        top: `${oldRect.top - snap.gridRect.top}px`,
        width: `${oldRect.width}px`,
        height: `${oldRect.height}px`,
        margin: "0",
        pointerEvents: "none",
        zIndex: "1",
      });
      grid.appendChild(clone);
      exitClones.push(clone);
      pendingCleanups.current.push(() => clone.remove());
    });

    // Categorize remaining cards: FLIP (existed before) vs ENTER (new)
    const entering: HTMLDivElement[] = [];
    const flipping: { el: HTMLDivElement; dx: number; dy: number }[] = [];

    cardRefs.current.forEach((el, slug) => {
      const oldRect = snap.positions.get(slug);
      if (!oldRect) {
        entering.push(el);
        return;
      }

      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;

      flipping.push({ el, dx, dy });
    });

    // Phase 1: set initial states BEFORE reflow
    flipping.forEach(({ el, dx, dy }) => {
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = "none";
    });
    prepareReveal(entering);

    // Force reflow so the browser commits all initial states
    void grid.offsetHeight;

    // Phase 2: start all transitions
    const EXIT_STAGGER = 60; // ms between each exit clone
    exitClones.forEach((clone, i) => {
      const delay = Math.round(i * EXIT_STAGGER);
      clone.style.transition = `opacity ${FLIP_DURATION}ms ease ${delay}ms, transform ${FLIP_DURATION}ms ease ${delay}ms`;
      clone.style.opacity = "0";
      clone.style.transform = "scale(0.95)";
    });

    flipping.forEach(({ el }) => {
      el.style.transition = `transform ${FLIP_DURATION}ms ease`;
      el.style.transform = "";
      pendingCleanups.current.push(() => {
        el.style.transition = "";
        el.style.transform = "";
      });
    });

    pendingCleanups.current.push(...startReveal(entering, FLIP_DURATION, 80));

    const exitTotalMs = FLIP_DURATION + Math.round(exitClones.length * EXIT_STAGGER);
    const enterTotalMs = revealTotalMs(entering.length, FLIP_DURATION, 80);
    scheduleCleanup(Math.max(exitTotalMs, enterTotalMs));

    return flushCleanups;
  }, [filtered, flushCleanups, scheduleCleanup]);

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
      <div ref={gridRef} className={styles.grid}>
        {filtered.map((project) => (
          <GridCard
            key={project.slug}
            project={project}
            onTagClick={toggleTag}
            activeTags={activeTags}
            cardRef={(el) => {
              if (el) cardRefs.current.set(project.slug, el);
              else cardRefs.current.delete(project.slug);
            }}
          />
        ))}
      </div>
    </div>
  );
}
