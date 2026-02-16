"use client";

import { useState, useCallback, useRef } from "react";
import { playgroundRegistry } from "./playgroundRegistry";
import styles from "./PlaygroundHost.module.css";

type Transition = "idle" | "covering" | "revealing" | "returning";

const COVER_MS = 500;
const REVEAL_MS = 500;
const RETURN_MS = 250;

export default function PlaygroundHost() {
  const [playgroundIndex, setPlaygroundIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [transition, setTransition] = useState<Transition>("idle");
  const pendingIndex = useRef<number | null>(null);

  const cyclePlayground = useCallback(() => {
    if (transition !== "idle") return;

    const next = (playgroundIndex + 1) % playgroundRegistry.length;
    pendingIndex.current = next;
    setTransition("covering");
    window.umami?.track("playground-cycle");

    setTimeout(() => {
      setPlaygroundIndex(pendingIndex.current!);
      setCycleCount((c) => c + 1);
      setTransition("revealing");

      setTimeout(() => {
        setTransition("returning");

        setTimeout(() => {
          setTransition("idle");
        }, RETURN_MS);
      }, REVEAL_MS);
    }, COVER_MS);
  }, [transition, playgroundIndex]);

  const currentPlayground = playgroundRegistry[playgroundIndex];
  const PlaygroundComponent = currentPlayground.component;

  const overlayClass =
    transition === "covering"
      ? styles.covering
      : transition === "revealing"
        ? styles.revealing
        : "";

  const earmarkClass =
    transition === "returning"
      ? styles.earmarkReturning
      : transition !== "idle"
        ? styles.earmarkHidden
        : "";

  return (
    <div className={styles.heroOuter}>
      <div className={styles.heroContainer}>
        {/* Playground content */}
        <div className={styles.playgroundContent}>
          <PlaygroundComponent key={`${currentPlayground.id}-${cycleCount}`} />
        </div>

        {/* Page-turn overlay */}
        <div className={`${styles.pageTurnOverlay} ${overlayClass}`} />

        {/* Playground name */}
        <span className={styles.playgroundName}>
          {currentPlayground.name}
        </span>

        {/* Playground counter */}
        <span className={styles.playgroundCounter}>
          Playground #{playgroundIndex + 1}/{playgroundRegistry.length}
        </span>

        {/* Earmark corner button */}
        <button
          className={`${styles.earmark} ${earmarkClass}`}
          onClick={cyclePlayground}
          aria-label="Show a different playground"
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
