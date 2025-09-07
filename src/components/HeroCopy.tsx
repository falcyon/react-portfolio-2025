"use client";

import React, { useState, useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import { projectsArray, Project } from "../data/projects";

const noise2D = createNoise2D();

/** Shape definition with defaults */
interface ShapeDef {
  id: string;
  w: number;
  h: number;
  rotation?: number;
}

/** Single state of a shape (position + optional size override) */
interface ShapeState {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  text?: string;
  textRotation?: number;
  __random?: boolean;
}

/** Shape with multiple states */
interface ShapeWithStates extends ShapeDef {
  states: ShapeState[];
}

/** Scroll stage: start → end states, and scroll length in vh */
interface Stage {
  startStateIndex: number;
  endStateIndex: number;
  scrollLength: number;
}

function generateStages(projects: Project[]): Stage[] {
  const stages: Stage[] = [];
  let index = 2; // after intro states

  projects.forEach(() => {
    stages.push({
      startStateIndex: index,
      endStateIndex: index + 1,
      scrollLength: 400,
    });
    stages.push({
      startStateIndex: index + 1,
      endStateIndex: index + 2,
      scrollLength: 600,
    });
    index += 2;
  });

  return stages;
}

const stages: Stage[] = [
  { startStateIndex: 0, endStateIndex: 1, scrollLength: 300 },
  { startStateIndex: 1, endStateIndex: 1, scrollLength: 600 },
  { startStateIndex: 1, endStateIndex: 2, scrollLength: 400 },
  { startStateIndex: 2, endStateIndex: 2, scrollLength: 700 },
  ...generateStages(projectsArray),
];

const useVhVwRatio = () => {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const updateRatio = () => setRatio(window.innerWidth / 100);
    updateRatio();
    window.addEventListener("resize", updateRatio);
    return () => window.removeEventListener("resize", updateRatio);
  }, []);

  return ratio;
};

const baseShapesDefs: ShapeDef[] = [
  { id: "Lv", w: 3, h: 15 },
  { id: "Lh", w: 9, h: 3 },
  { id: "Ev", w: 3, h: 15 },
  { id: "Et", w: 9, h: 3 },
  { id: "Em", w: 9, h: 3 },
  { id: "Eb", w: 9, h: 3 },
  { id: "F1v", w: 3, h: 15 },
  { id: "F1t", w: 9, h: 3 },
  { id: "F1m", w: 9, h: 3 },
  { id: "F2v", w: 3, h: 15 },
  { id: "F2t", w: 9, h: 3 },
  { id: "F2m", w: 9, h: 3 },
  { id: "Dot", w: 3, h: 3 },
  { id: "Iv", w: 3, h: 15 },
  { id: "Nl", w: 3, h: 15 },
  { id: "Nr", w: 3, h: 15 },
  { id: "Ns", w: 15.84, h: 3, rotation: 57.55 },
];

const HeroState: Record<string, ShapeState> = {
  Lv: { x: 18, y: 0 },
  Lh: { x: 18, y: 12 },
  Ev: { x: 29, y: 0 },
  Et: { x: 29, y: 0 },
  Em: { x: 29, y: 6 },
  Eb: { x: 29, y: 12 },
  F1v: { x: 40, y: 0 },
  F1t: { x: 40, y: 0 },
  F1m: { x: 40, y: 6 },
  F2v: { x: 51, y: 0 },
  F2t: { x: 51, y: 0 },
  F2m: { x: 51, y: 6 },
  Dot: { x: 60, y: 12 },
  Iv: { x: 64, y: 0 },
  Nl: { x: 69, y: 0 },
  Nr: { x: 78, y: 0 },
  Ns: { x: 67.1, y: 6 },
};

const NameState: Record<string, ShapeState> = {
  Lv: { x: 18, y: 0 },
  Lh: { x: 18, y: 12 },
  Ev: { x: 29, y: 0 },
  Et: { x: 29, y: 0 },
  Em: { x: 29, y: 6 },
  Eb: { x: 29, y: 12 },
  F1v: { x: 40, y: 0 },
  F1t: { x: 40, y: 0 },
  F1m: { x: 40, y: 6 },
  F2v: { x: 51, y: 0 },
  F2t: { x: 51, y: 0 },
  F2m: { x: 51, y: 6 },
  Iv: { x: 61, y: 0 },
  Nl: { x: 66, y: 0 },
  Nr: { x: 75, y: 0 },
  Ns: { x: 64.1, y: 6 },
  Dot: { x: 79, y: 12 },
};

function generateProjectStates(
  projects: Project[],
  shapeDefs: ShapeDef[],
  ratio: number
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
    const xFirst = [20 + ratio * 0, 30, 70];

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

const Hero: React.FC = () => {
  const ratio = useVhVwRatio();
  const shapesDefs = React.useMemo(
    () => baseShapesDefs.map((s) => ({ ...s, h: s.h * ratio })),
    [ratio]
  );
  const projectStateMaps = React.useMemo(
    () => generateProjectStates(projectsArray, baseShapesDefs, ratio),
    [ratio]
  );
  const scaleY = (state?: ShapeState) =>
    state
      ? {
          ...state,
          y: state.y !== undefined ? state.y * ratio + 350 : undefined,
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
    [ratio]
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
            text: st.text,
          };
        });
        return { ...s, states: newStates };
      })
    );
  }, [ratio]);

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

        const startColor = s.states[currentStage.startStateIndex].__random
          ? "#ececec"
          : "var(--foreground)";
        const endColor = s.states[currentStage.endStateIndex]?.__random
          ? "#ececec"
          : "var(--foreground)";
        const bgColor = lerpColor(startColor, endColor, progress);

        el.style.left = `${x}vw`;
        el.style.top = `${y}px`;
        el.style.width = `${w}vw`;
        el.style.height = `${h}px`;
        el.style.background = bgColor;
        el.style.transform = s.rotation ? `rotate(${s.rotation}deg)` : "";
        el.style.zIndex = String(
          s.states[currentStage.startStateIndex].__random ? 1 : 3
        );
        el.textContent = text ?? "";
        if (verticalIds.includes(s.id)) {
          el.style.writingMode = "vertical-rl";
          el.style.textOrientation = "mixed";
          el.style.transform += " rotate(180deg)"; // rotate along the vertical
        } else {
          el.style.writingMode = "";
          el.style.textOrientation = "";
        }
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [shapes, currentStage, progress]);

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

  const lerpColor = (a: string, b: string, t: number) => {
    const ah = parseInt(a.replace("#", ""), 16);
    const ar = (ah >> 16) & 0xff;
    const ag = (ah >> 8) & 0xff;
    const ab = ah & 0xff;

    const bh = parseInt(b.replace("#", ""), 16);
    const br = (bh >> 16) & 0xff;
    const bg = (bh >> 8) & 0xff;
    const bb = bh & 0xff;

    const rr = Math.round(ar + (br - ar) * t);
    const rg = Math.round(ag + (bg - ag) * t);
    const rb = Math.round(ab + (bb - ab) * t);

    return `rgb(${rr},${rg},${rb})`;
  };

  const verticalIds = ["Lv", "Ev", "F1v", "F2v", "Iv", "Nl", "Nr"];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {shapes.map((s) => (
        <div
          key={s.id}
          ref={(el) => {
            shapeRefs.current[s.id] = el;
          }}
          style={{
            position: "absolute",
            cursor: "grab",
            display: "flex",
            alignItems: verticalIds.includes(s.id) ? "auto" : "center",
            justifyContent: verticalIds.includes(s.id) ? "auto" : "center",
            color: verticalIds.includes(s.id) ? "#d93838ff" : "#fff",
            fontSize: verticalIds.includes(s.id) ? "64px" : "18px",
            fontFamily: "sans-serif",
            whiteSpace: "nowrap",
            border: "1px solid var(--foreground)",
          }}
        />
      ))}
    </div>
  );
};

export default Hero;
