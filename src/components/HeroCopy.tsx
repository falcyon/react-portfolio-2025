"use client";

import React, { useState, useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import { projectsArray, Project } from "../data/projects";
import {
  baseShapesDefs,
  HeroState,
  NameState,
  landingStages,
  generateStages,
  ShapeDef,
  ShapeState,
} from "./heroStates";

import styles from "./Hero.module.css";

const noise2D = createNoise2D();

const stages = [...landingStages, ...generateStages(projectsArray)];

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);

    updateWindowWidth(); // ensure initial value is correct
    window.addEventListener("resize", updateWindowWidth);

    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  return windowWidth;
};

/** Shape with multiple states */
interface ShapeWithStates extends ShapeDef {
  states: ShapeState[];
}

function generateProjectStates(
  projects: Project[],
  shapeDefs: ShapeDef[],
  windowWidth: number
): Record<string, ShapeState>[] {
  const states: Record<string, ShapeState>[] = [];
  const verticalList = ["Lv", "Ev", "F1v", "F2v", "Iv", "Nl", "Nr"];
  const horizontalList = ["Lh", "Et", "Em", "Eb", "F1t", "F1m", "F2t", "F2m"];

  projects.forEach((project, i) => {
    const vId = verticalList[i % verticalList.length];
    const hId1 = horizontalList[(2 * i) % horizontalList.length];
    const hId2 = horizontalList[(2 * i + 1) % horizontalList.length];

    const chosen = [vId, hId1, hId2]
      .map((id) => shapeDefs.find((s) => s.id === id))
      .filter((s): s is ShapeDef => !!s);

    const yFirst = [200, 100, 300];
    const xFirst = [20 + windowWidth * 0, 30, 70];

    const stateA: Record<string, ShapeState> = {};
    const stateB: Record<string, ShapeState> = {};

    chosen.forEach((shape, idx) => {
      const text =
        idx === 0
          ? project.name
          : idx === 1
          ? String(project.year)
          : project.tags?.[0] ?? "";

      stateA[shape.id] = { x: xFirst[idx], y: yFirst[idx], text };
      stateB[shape.id] = { x: xFirst[idx], y: yFirst[idx], text };
    });

    states.push(stateA);
    states.push(stateB);
  });
  return states;
}

const interpolate = (
  start: ShapeState,
  end: ShapeState,
  t: number
): ShapeState => ({
  x: (start.x ?? 0) + ((end.x ?? 0) - (start.x ?? 0)) * t,
  y: (start.y ?? 0) + ((end.y ?? 0) - (start.y ?? 0)) * t,
  w: (start.w ?? 0) + ((end.w ?? start.w ?? 0) - (start.w ?? 0)) * t,
  h: (start.h ?? 0) + ((end.h ?? start.h ?? 0) - (start.h ?? 0)) * t,
  text: start.text === end.text ? start.text : "",
});

const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  const targetY = 500;
  const isScrollingRef = useRef(false);

  useEffect(() => {
    let animationFrameId: number;

    const updateScroll = () => {
      const currentY = window.scrollY;
      if (currentY < targetY && !isScrollingRef.current) {
        const nextY = currentY + (targetY - currentY) * 0.03 + 2;
        window.scrollTo({ top: nextY });
        animationFrameId = requestAnimationFrame(updateScroll);
        setScrollY(nextY);
      } else {
        setScrollY(currentY);
      }
    };

    const onScroll = () => {
      isScrollingRef.current = true;
      setScrollY(window.scrollY);
      setTimeout(() => {
        isScrollingRef.current = false;
        if (window.scrollY < targetY) {
          updateScroll();
        }
      }, 100);
    };

    window.addEventListener("scroll", onScroll);

    // Wait for fonts and layout to be ready
    const startAutoScroll = () => {
      // Wait for all fonts to load
      document.fonts.ready.then(() => {
        // Double rAF ensures layout + paint are done
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            updateScroll();
          });
        });
      });
    };

    startAutoScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return scrollY;
};

const makeShape = (def: ShapeDef, stateArr: ShapeState[]): ShapeWithStates => {
  const fallbackX = Math.random() * 90;
  const fallbackY = 50 + Math.random() * 800;
  const s = stateArr.map((st) => {
    const hasExplicitPos = st?.x !== undefined || st?.y !== undefined;
    const isRandom = !hasExplicitPos;

    return {
      x: st?.x ?? fallbackX,
      y: st?.y ?? fallbackY,
      w: st?.w ?? def.w,
      h: st?.h ?? def.h,
      text: st?.text,
      __random: isRandom,
    };
  });

  return { ...def, states: s };
};
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}
const Hero: React.FC = () => {
  const windowWidth = useWindowWidth();
  const shapesDefs = React.useMemo(
    () =>
      baseShapesDefs.map((s) => ({
        ...s,
        w: windowWidth < 700 ? (s.w * 700) / windowWidth : s.w,
        h: windowWidth < 700 ? s.h * 7 : (s.h * windowWidth) / 100,
      })),
    [windowWidth]
  );
  const projectStateMaps = React.useMemo(
    () => generateProjectStates(projectsArray, baseShapesDefs, windowWidth),
    [windowWidth]
  );
  const scaleY = (state?: ShapeState) =>
    state
      ? {
          ...state,
          y:
            state.y !== undefined
              ? (state.y * windowWidth) / 100 + 350
              : undefined,
        }
      : state;

  const states: ShapeState[][] = React.useMemo(
    () =>
      shapesDefs.map((s) => [
        {},
        scaleY(HeroState[s.id]) ?? {},
        scaleY(NameState[s.id]) ?? {},
        ...projectStateMaps.map((m) => m[s.id] ?? {}),
      ]),
    [windowWidth]
  );

  const [shapes, setShapes] = useState<ShapeWithStates[]>(() =>
    shapesDefs.map((def, i) => makeShape(def, states[i]))
  );

  useEffect(() => {
    setShapes((prevShapes) =>
      prevShapes.map((s) => {
        const def = shapesDefs.find((d) => d.id === s.id)!;
        const newStates = s.states.map((st, idx) => {
          let newY = st.y;
          if (idx === 1) newY = scaleY(HeroState[s.id])?.y ?? st.y;
          if (idx === 2) newY = scaleY(NameState[s.id])?.y ?? st.y;

          return {
            ...st,
            y: newY,
            h: def.h,
            w: def.w,
            text: st.text,
          };
        });
        return { ...s, states: newStates };
      })
    );
  }, [windowWidth]);

  const scrollY = useScrollY();

  const getStageProgress = () => {
    let acc = 0;
    for (let i = 0; i < stages.length; i++) {
      const stagePx = stages[i].scrollLength;
      if (scrollY <= acc + stagePx) {
        const t = (scrollY - acc) / stagePx;
        return { stageIndex: i, progress: Math.min(Math.max(t, 0), 1) };
      }
      acc += stagePx;
    }
    return { stageIndex: stages.length - 1, progress: 1 };
  };

  const { stageIndex, progress } = getStageProgress();
  const currentStage = stages[stageIndex];
  const timeRef = useRef(0);
  const shapeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    let frameId: number;

    const loop = () => {
      timeRef.current += 0.01;

      shapes.forEach((s) => {
        const el = shapeRefs.current[s.id];
        if (!el) return;

        const { x, y, w, h, text } = getShapePosition(s);

        // Determine base color
        const baseColor = s.id === "Dot" ? "#da1f26" : "var(--foreground)";

        // Determine alpha based on random state
        const alphaStart = s.states[currentStage.startStateIndex].__random
          ? 0.2
          : 1;
        const alphaEnd = s.states[currentStage.endStateIndex]?.__random
          ? 0.2
          : 1;

        // Interpolate alpha
        const alpha = alphaStart + (alphaEnd - alphaStart) * progress;

        // Apply color with alpha
        el.style.background = `rgba(${hexToRgb(baseColor)}, ${alpha})`;

        // Set left and width in px if windowWidth indicates narrow screen
        // if (windowWidth < 700) {
        //   el.style.left = `${(x / 100) * window.innerWidth}px`; // convert vw to px
        //   el.style.width = `${w * 1}px`; // convert vw to px
        // } else {
        //   el.style.left = `${x}vw`;
        //   el.style.width = `${w}vw`;
        // }
        el.style.left = `${x}vw`;
        el.style.width = `${w}vw`;
        el.style.top = `${y}px`;
        el.style.height = `${h}px`;
        el.style.transform = s.rotation ? `rotate(${s.rotation}deg)` : "";
        el.style.zIndex = String(
          s.states[currentStage.startStateIndex].__random ? "auto" : 100
        );
        el.textContent = text ?? "";
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [shapes, currentStage, progress, windowWidth]);

  const shapePhase = useRef<Record<string, number>>(
    Object.fromEntries(shapes.map((s) => [s.id, Math.random() * 1000]))
  ).current;

  const getShapePosition = (s: ShapeWithStates) => {
    const start = s.states[currentStage.startStateIndex];
    const end = s.states[currentStage.endStateIndex];
    const base = interpolate(start, end, progress);
    // console.log(progress, start, end, base);
    const scale = 0.3 * 1 - progress * (1 - progress);
    const tNoise = timeRef.current + shapePhase[s.id];
    const noiseX = noise2D(tNoise, 0) * scale; // fixed second param
    const noiseY = noise2D(tNoise, 1) * scale;

    return {
      ...base,
      x: (base.x ?? 0) + noiseX,
      y: (base.y ?? 0) + noiseY,
    };
  };

  const verticalIds = ["Lv", "Ev", "F1v", "F2v", "Iv", "Nl", "Nr"];

  return (
    <div className={styles.heroContainer}>
      {shapes.map((s) => (
        <div
          key={s.id}
          ref={(el) => {
            shapeRefs.current[s.id] = el;
          }}
          className={`${styles.shape} ${
            verticalIds.includes(s.id)
              ? styles.shapeVertical
              : styles.shapeHorizontal
          } }`}
        />
      ))}
    </div>
  );
};

export default Hero;
