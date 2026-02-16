"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ExplosionPlayground.module.css";

// --- Shape data ---

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

// --- Text element data ---

interface TextElement {
  id: string;
  content: string;
  fontScale: number;
  minFontSize: number;
}

const textElements: TextElement[] = [
  { id: "t_0", content: "MULTIDISCIPLINARY", fontScale: 1.0, minFontSize: 9 },
  { id: "t_1", content: "INTERACTIVE", fontScale: 1.0, minFontSize: 9 },
  { id: "t_2", content: "TECHNOLOGIST", fontScale: 1.0, minFontSize: 9 },
  { id: "t_3", content: "INTROSPECTIVE", fontScale: 1.0, minFontSize: 9 },
  { id: "t_4", content: "EMBODIED", fontScale: 1.0, minFontSize: 9 },
  { id: "t_5", content: "IMMERSIVE", fontScale: 1.0, minFontSize: 9 },
  { id: "t_6", content: "EXPERIMENTAL", fontScale: 1.0, minFontSize: 9 },
  { id: "t_7", content: "HUMAN", fontScale: 1.0, minFontSize: 9 },
  { id: "t_8", content: "STORYTELLER", fontScale: 1.0, minFontSize: 9 },
  { id: "t_9", content: "BUILDER", fontScale: 1.0, minFontSize: 9 },
];

// Chaos positions for text (percentage-based, like shape chaos)
const textChaosPositions: Record<string, { x: number; y: number }> = {
  t_0: { x: 70, y: 10 },
  t_1: { x: 15, y: 60 },
  t_2: { x: 80, y: 45 },
  t_3: { x: 35, y: 80 },
  t_4: { x: 60, y: 5 },
  t_5: { x: 25, y: 42 },
  t_6: { x: 85, y: 75 },
  t_7: { x: 50, y: 30 },
  t_8: { x: 8, y: 88 },
  t_9: { x: 92, y: 55 },
};

// --- Shape states ---

// "LEFF.IN" — dot between F and I (the domain)
const LeffInState: Record<ShapeID, { x: number; y: number }> = {
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

// "LEFFIN." — dot at the end (the name)
const LeffinDotState: Record<ShapeID, { x: number; y: number }> = {
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
  Iv: { x: 44, y: 0 },
  Nl: { x: 49, y: 0 },
  Nr: { x: 58, y: 0 },
  Ns: { x: 47.1, y: 6 },
  Dot: { x: 62, y: 12 },
};

// --- Animation config ---
const INITIAL_HOLD = 100;
const TRANSITION = 750;
const LETTER_HOLD = 1250;
const CHAOS_HOLD = 750;

// Phase definitions for the looping cycle
// State 0 = chaos, State 1 = LEFF.IN, State 2 = LEFFIN.
const PHASES: { type: "transition" | "hold"; from?: number; to?: number; state?: number; duration: number }[] = [
  { type: "transition", from: 0, to: 1, duration: TRANSITION },
  { type: "hold", state: 1, duration: LETTER_HOLD },
  { type: "transition", from: 1, to: 2, duration: TRANSITION },
  { type: "hold", state: 2, duration: LETTER_HOLD },
  { type: "transition", from: 2, to: 0, duration: TRANSITION },
  { type: "hold", state: 0, duration: CHAOS_HOLD },
];
const CYCLE_DURATION = PHASES.reduce((sum, p) => sum + p.duration, 0);

const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

// Chaos state — hand-placed scattered positions
const ChaosState: Record<ShapeID, { x: number; y: number }> = {
  Lv: { x: 25, y: 20 },
  Lh: { x: -5, y: 96 },
  Ev: { x: 48, y: 55 },
  Et: { x: 15, y: 80 },
  Em: { x: 50, y: 10 },
  Eb: { x: 30, y: 95 },
  F1v: { x: 15, y: 74 },
  F1t: { x: 18, y: 60 },
  F1m: { x: 62, y: 45 },
  F2v: { x: 40, y: -7 },
  F2t: { x: 82, y: 88 },
  F2m: { x: 8, y: 40 },
  Dot: { x: 55, y: 55 },
  Iv: { x: 80, y: -3 },
  Nl: { x: 70, y: 70 },
  Nr: { x: 100, y: 95 },
  Ns: { x: 105, y: 20 },
};

export default function ExplosionPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const elRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const animRef = useRef<number>(0);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (containerSize.w === 0) return;

    const containerWidth = containerSize.w;
    const containerHeight = containerSize.h;
    const scaleFactor = containerWidth / 100;
    const X_OFFSET = 18;

    // --- Compute text font sizes ---
    const wordFontSize = Math.max(9, 1.0 * scaleFactor);

    // --- Compute text settled layout (to determine total content height) ---
    const nameHeightPx = 15 * scaleFactor;
    const gapNameToWords = Math.max(12, 5 * scaleFactor);
    const nameWidthPx = 65 * scaleFactor;
    const charWidthPx = wordFontSize * 0.55;
    const tagPadHPx = wordFontSize * 0.5; // horizontal padding inside tag
    const wordGapPx = wordFontSize * 0.6;
    const lineHeightPx = wordFontSize * 2.2;

    // Dry-run word layout to count rows
    let tempX = 0;
    let numWordRows = 1;
    for (const t of textElements) {
      const tagWidth = t.content.length * charWidthPx + tagPadHPx * 2;
      if (tempX + tagWidth > nameWidthPx && tempX > 0) {
        tempX = 0;
        numWordRows++;
      }
      tempX += tagWidth + wordGapPx;
    }

    const totalContentPx =
      nameHeightPx + gapNameToWords + numWordRows * lineHeightPx;
    const Y_OFFSET = (containerHeight - totalContentPx) / 2;

    // --- Compute settled text positions (px, with Y_OFFSET) ---
    const textSettled: Record<string, { x: number; y: number; fontSize: number }> = {};

    // Word rows: flow left-to-right, wrap when exceeding name width
    const wordsStartY = nameHeightPx + gapNameToWords + Y_OFFSET;
    let rowX = 0;
    let rowY = wordsStartY;
    for (const t of textElements) {
      const tagWidth = t.content.length * charWidthPx + tagPadHPx * 2;
      if (rowX + tagWidth > nameWidthPx && rowX > 0) {
        rowX = 0;
        rowY += lineHeightPx;
      }
      textSettled[t.id] = { x: X_OFFSET * scaleFactor + rowX, y: rowY, fontSize: wordFontSize };
      rowX += tagWidth + wordGapPx;
    }

    // --- Set text font sizes (constant, set once) ---
    for (const t of textElements) {
      const el = elRefs.current[t.id];
      if (el) el.style.fontSize = `${textSettled[t.id].fontSize}px`;
    }

    // --- Pre-compute state positions for ALL elements ---
    const statePositions: Record<string, { x: number; y: number }>[] = [];

    // State 0: chaos
    const chaos: Record<string, { x: number; y: number }> = {};
    for (const id of shapeIDs) {
      const rp = ChaosState[id];
      chaos[id] = {
        x: (rp.x / 100) * containerWidth * 0.85,
        y: (rp.y / 100) * containerHeight * 0.85,
      };
    }
    for (const t of textElements) {
      const rp = textChaosPositions[t.id];
      chaos[t.id] = {
        x: (rp.x / 100) * containerWidth * 0.85,
        y: (rp.y / 100) * containerHeight * 0.85,
      };
    }
    statePositions.push(chaos);

    // State 1: LEFF.IN (shapes form domain, text settled)
    const leffIn: Record<string, { x: number; y: number }> = {};
    for (const id of shapeIDs) {
      const pos = LeffInState[id];
      leffIn[id] = {
        x: (pos.x + X_OFFSET) * scaleFactor,
        y: pos.y * scaleFactor + Y_OFFSET,
      };
    }
    for (const t of textElements) {
      leffIn[t.id] = { x: textSettled[t.id].x, y: textSettled[t.id].y };
    }
    statePositions.push(leffIn);

    // State 2: LEFFIN. (shapes form name, text settled — same positions)
    const leffinDot: Record<string, { x: number; y: number }> = {};
    for (const id of shapeIDs) {
      const pos = LeffinDotState[id];
      leffinDot[id] = {
        x: (pos.x + X_OFFSET) * scaleFactor,
        y: pos.y * scaleFactor + Y_OFFSET,
      };
    }
    for (const t of textElements) {
      leffinDot[t.id] = { x: textSettled[t.id].x, y: textSettled[t.id].y };
    }
    statePositions.push(leffinDot);

    // Pre-compute shape dimensions (constant across all states)
    const shapeSizes: Record<string, { w: number; h: number }> = {};
    for (const id of shapeIDs) {
      const dims = unscaledShapes[id];
      shapeSizes[id] = { w: dims.w * scaleFactor, h: dims.h * scaleFactor };
    }

    let wasOutlined = true; // shapes start in chaos (outlined)

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;

      let fromPositions: Record<string, { x: number; y: number }>;
      let toPositions: Record<string, { x: number; y: number }>;
      let progress: number;
      let toIdx: number;

      if (elapsed < INITIAL_HOLD) {
        // Initial hold: show chaos
        fromPositions = statePositions[0];
        toPositions = statePositions[0];
        progress = 1;
        toIdx = 0;
      } else {
        // Find current phase in the looping cycle
        const cycleTime = (elapsed - INITIAL_HOLD) % CYCLE_DURATION;
        let t = cycleTime;
        let phase = PHASES[0];
        for (const p of PHASES) {
          if (t < p.duration) {
            phase = p;
            break;
          }
          t -= p.duration;
        }

        if (phase.type === "hold") {
          fromPositions = statePositions[phase.state!];
          toPositions = statePositions[phase.state!];
          progress = 1;
          toIdx = phase.state!;
        } else {
          fromPositions = statePositions[phase.from!];
          toPositions = statePositions[phase.to!];
          progress = ease(t / phase.duration);
          toIdx = phase.to!;
        }
      }

      // Animate shapes
      for (const id of shapeIDs) {
        const el = elRefs.current[id];
        if (!el) continue;

        const from = fromPositions[id];
        const to = toPositions[id];
        const size = shapeSizes[id];
        const dims = unscaledShapes[id as ShapeID];
        const rotation = dims.rotation ?? 0;

        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;

        el.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        el.style.width = `${size.w}px`;
        el.style.height = `${size.h}px`;
      }

      // Animate text elements
      for (const t of textElements) {
        const el = elRefs.current[t.id];
        if (!el) continue;

        const from = fromPositions[t.id];
        const to = toPositions[t.id];

        const x = from.x + (to.x - from.x) * progress;
        const y = from.y + (to.y - from.y) * progress;

        el.style.transform = `translate(${x}px, ${y}px)`;
      }

      // Toggle shape background color when state changes
      const shouldOutline = toIdx === 0;
      if (shouldOutline !== wasOutlined) {
        for (const id of shapeIDs) {
          const el = elRefs.current[id];
          if (!el) continue;
          const isDotShape = unscaledShapes[id as ShapeID].shapeType === "dot";
          if (shouldOutline) {
            el.style.backgroundColor = "var(--background)";
          } else {
            el.style.backgroundColor = isDotShape ? "var(--accent)" : "";
          }
        }
        wasOutlined = shouldOutline;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [containerSize]);

  return (
    <div ref={containerRef} className={styles.container}>
      {shapeIDs.map((id) => {
        const dims = unscaledShapes[id];
        const isDot = dims.shapeType === "dot";
        return (
          <div
            key={id}
            ref={(el) => {
              elRefs.current[id] = el;
            }}
            className={`${styles.shape} ${isDot ? styles.dot : ""}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "var(--background)",
            }}
          />
        );
      })}
      {textElements.map((t) => (
        <div
          key={t.id}
          ref={(el) => {
            elRefs.current[t.id] = el;
          }}
          className={styles.tag}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
