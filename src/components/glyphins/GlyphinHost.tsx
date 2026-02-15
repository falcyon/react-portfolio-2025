"use client";

import { useState, useCallback, useRef } from "react";
import { glyphinRegistry } from "./glyphinRegistry";
import styles from "./GlyphinHost.module.css";

export default function GlyphinHost() {
  const [glyphinIndex, setGlyphinIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [wiping, setWiping] = useState(false);
  const pendingIndex = useRef<number | null>(null);

  const cycleGlyphin = useCallback(() => {
    if (wiping) return;

    // Cycle to next in order, wrapping around
    const next = (glyphinIndex + 1) % glyphinRegistry.length;

    pendingIndex.current = next;
    setWiping(true);
    window.umami?.track("glyphin-cycle");

    // After wipe-out finishes, swap the glyphin and wipe back in
    setTimeout(() => {
      setGlyphinIndex(pendingIndex.current!);
      setCycleCount((c) => c + 1);
      setWiping(false);
    }, 400);
  }, [wiping, glyphinIndex]);

  const currentGlyphin = glyphinRegistry[glyphinIndex];
  const GlyphinComponent = currentGlyphin.component;

  return (
    <div className={styles.heroOuter}>
      <div className={styles.heroContainer}>
        {/* Glyphin content with wipe animation */}
        <div
          className={`${styles.glyphinContent} ${wiping ? styles.wipeOut : styles.wipeIn}`}
        >
          <GlyphinComponent key={`${currentGlyphin.id}-${cycleCount}`} />
        </div>

        {/* Glyphin counter */}
        <span className={styles.glyphinCounter}>
          Glyphin #{glyphinIndex + 1}/{glyphinRegistry.length}
        </span>

        {/* Earmark corner button */}
        <button
          className={styles.earmark}
          onClick={cycleGlyphin}
          aria-label="Show a different glyphin"
        >
          <svg
            className={styles.earmarkIcon}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0 L40 0 L0 40 Z" className={styles.earmarkTriangle} />
            <path
              d="M32 32 L24 24 M24 24 L29 24 M24 24 L24 29"
              className={styles.earmarkArrow}
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
