"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import styles from "./ShapesGlyphin.module.css";

// --- Shape data (extracted from unscaledShapes.ts) ---

const shapeIDs = [
  "Ns", "Lh", "Et", "Em", "Eb", "F1t", "F1m", "F2t", "F2m",
  "Nr", "Nl", "Iv", "F2v", "F1v", "Ev", "Lv", "Dot",
] as const;

type ShapeID = (typeof shapeIDs)[number];

interface ShapeDims {
  w: number;
  h: number;
  rotation?: number;
  shapeType: "long" | "short" | "dot" | "slant";
}

const unscaledShapes: Record<ShapeID, ShapeDims> = {
  Lv: { w: 3, h: 15, shapeType: "long" },
  Lh: { w: 9, h: 3, shapeType: "short" },
  Ev: { w: 3, h: 15, shapeType: "long" },
  Et: { w: 9, h: 3, shapeType: "short" },
  Em: { w: 9, h: 3, shapeType: "short" },
  Eb: { w: 9, h: 3, shapeType: "short" },
  F1v: { w: 3, h: 15, shapeType: "long" },
  F1t: { w: 9, h: 3, shapeType: "short" },
  F1m: { w: 9, h: 3, shapeType: "short" },
  F2v: { w: 3, h: 15, shapeType: "long" },
  F2t: { w: 9, h: 3, shapeType: "short" },
  F2m: { w: 9, h: 3, shapeType: "short" },
  Dot: { w: 3, h: 3, shapeType: "dot" },
  Iv: { w: 3, h: 15, shapeType: "long" },
  Nl: { w: 3, h: 15, shapeType: "long" },
  Nr: { w: 3, h: 15, shapeType: "long" },
  Ns: { w: 15.84, h: 3, rotation: 57.55, shapeType: "slant" },
};

// Hero state: positions that spell "LEFFIN."
const HeroState: Record<ShapeID, { x: number; y: number }> = {
  Lv: { x: 0, y: 0 },
  Lh: { x: 0, y: 12 },
  Ev: { x: 11, y: 0 },
  Et: { x: 11, y: 0 },
  Em: { x: 11, y: 6 },
  Eb: { x: 11, y: 12 },
  F1v: { x: 22, y: 0 },
  F1t: { x: 22, y: 0 },
  F1m: { x: 22, y: 6 },
  F2v: { x: 33, y: 0 },
  F2t: { x: 33, y: 0 },
  F2m: { x: 33, y: 6 },
  Dot: { x: 42, y: 12 },
  Iv: { x: 46, y: 0 },
  Nl: { x: 51, y: 0 },
  Nr: { x: 60, y: 0 },
  Ns: { x: 49.1, y: 6 },
};

// --- Animation config ---
const SCATTER_HOLD = 200; // ms to show scatter before animating
const ANIM_DURATION = 1800; // ms for scatter → LEFFIN transition

// Ease-in-out quadratic
const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Generate non-clumping random positions
function generateRandomPositions(count: number, minDist: number) {
  const points: { x: number; y: number }[] = [];
  let attempts = 0;
  while (points.length < count && attempts < 5000) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const tooClose = points.some((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      return dx * dx + dy * dy < minDist * minDist;
    });
    if (!tooClose) points.push({ x, y });
    attempts++;
  }
  // Fallback if we can't fit enough points
  while (points.length < count) {
    points.push({ x: Math.random() * 100, y: Math.random() * 100 });
  }
  return points;
}

export default function ShapesGlyphin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const animRef = useRef<number>(0);
  const startTime = useRef<number>(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Generate random start positions per mount
  const randomPositions = useMemo(() => {
    const points = generateRandomPositions(shapeIDs.length, 12);
    const positions: Record<string, { x: number; y: number }> = {};
    shapeIDs.forEach((id, i) => {
      if (unscaledShapes[id].shapeType === "dot") {
        positions[id] = { x: 48, y: 35 };
      } else {
        positions[id] = points[i];
      }
    });
    return positions;
  }, []);

  // Observe container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    if (containerWidth === 0) return;

    const scaleFactor = containerWidth / 100;

    // Pre-compute scaled hero positions
    const heroScaled: Record<string, { x: number; y: number; w: number; h: number }> = {};
    const randomScaled: Record<string, { x: number; y: number; w: number; h: number }> = {};

    for (const id of shapeIDs) {
      const dims = unscaledShapes[id];
      const w = dims.w * scaleFactor;
      const h = dims.h * scaleFactor;
      const hero = HeroState[id];

      // Hero position: offset from left side of container
      heroScaled[id] = {
        x: (hero.x + 18) * scaleFactor,
        y: hero.y * scaleFactor + 20,
        w,
        h,
      };

      // Random position: % of container
      const rp = randomPositions[id];
      randomScaled[id] = {
        x: (rp.x / 100) * containerWidth * 0.85,
        y: (rp.y / 100) * (containerWidth * 0.25),
        w,
        h,
      };
    }

    startTime.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime.current;
      const rawProgress = Math.max(
        0,
        Math.min(1, (elapsed - SCATTER_HOLD) / ANIM_DURATION)
      );
      const progress = ease(rawProgress);

      for (const id of shapeIDs) {
        const el = shapeRefs.current[id];
        if (!el) continue;

        const start = randomScaled[id];
        const end = heroScaled[id];

        const x = start.x + (end.x - start.x) * progress;
        const y = start.y + (end.y - start.y) * progress;
        const w = start.w + (end.w - start.w) * progress;
        const h = start.h + (end.h - start.h) * progress;

        const dims = unscaledShapes[id as ShapeID];
        const rotation = dims.rotation ?? 0;

        // Opacity: fade from 0.15 to 1
        const isDot = dims.shapeType === "dot";
        const alpha = isDot ? 1 : 0.15 + 0.85 * progress;

        el.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.opacity = `${alpha}`;
      }

      // Keep animating if not done
      if (elapsed < SCATTER_HOLD + ANIM_DURATION + 100) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [containerWidth, randomPositions]);

  return (
    <div ref={containerRef} className={styles.container}>
      {shapeIDs.map((id) => {
        const dims = unscaledShapes[id];
        const isDot = dims.shapeType === "dot";
        return (
          <div
            key={id}
            ref={(el) => {
              shapeRefs.current[id] = el;
            }}
            className={`${styles.shape} ${isDot ? styles.dot : ""}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0.15,
            }}
          />
        );
      })}
    </div>
  );
}
