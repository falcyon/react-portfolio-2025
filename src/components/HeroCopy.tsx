"use client";

import React, { useState, useEffect, useRef } from "react";
// import ShapeText from "./ShapeText";
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
  // yearShapes,
  // tagShapes,
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

    // We'll need 1 horizontal for the year + one for each tag
    const neededHorizontals = 1 + (project.tags?.length ?? 0);

    const hIds = Array.from(
      { length: neededHorizontals },
      (_, j) =>
        horizontalList[(i * neededHorizontals + j) % horizontalList.length]
    );

    const allShapeIds = [vId, ...hIds];
    const chosen = allShapeIds
      .map((id) => shapeDefs.find((s) => s.id === id))
      .filter((s): s is ShapeDef => !!s);

    const yFirst = [700, 400, 500, 600, 700, 800];
    const xFirst = [20 + windowWidth * 0, 30, 70, 85, 78, 73];

    const stateA: Record<string, ShapeState> = {};
    const stateB: Record<string, ShapeState> = {};

    chosen.forEach((shape, idx) => {
      let text: string;
      let textType: "name" | "year" | "tag";

      if (idx === 0) {
        text = project.name;
        textType = "name";
      } else if (idx === 1) {
        text = String(project.year);
        textType = "year";
      } else {
        const tagIndex = idx - 2;
        text = project.tags?.[tagIndex] ?? "";
        textType = "tag";
      }

      stateA[shape.id] = {
        x: xFirst[idx] ?? 50 + idx * 40,
        y: yFirst[idx] ?? 400 + idx * 100,
        text,
        textType,
      };
      stateB[shape.id] = {
        x: xFirst[idx] ?? 50 + idx * 40,
        y: (yFirst[idx] ?? 400 + idx * 100) - 500,
        text,
        textType,
      };
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
): ShapeState => {
  const startText = start.text ?? "";
  const endText = end.text ?? "";
  let interpolatedText = "";

  if (startText === endText) {
    // Same text → keep full
    interpolatedText = startText;
  } else if (!startText) {
    // Blank → appear after t/2
    if (t < 0.5) {
      interpolatedText = "";
    } else {
      const localT = (t - 0.5) / 0.5;
      const letters = Math.floor(endText.length * localT);
      interpolatedText = endText.slice(0, letters);
    }
  } else if (!endText) {
    // Disappear in first half
    if (t < 0.5) {
      const localT = t / 0.5;
      const letters = Math.ceil(startText.length * (1 - localT));
      interpolatedText = startText.slice(0, letters);
    } else {
      interpolatedText = "";
    }
  } else {
    // Both have text: overwrite from both ends
    const maxLen = Math.max(startText.length, endText.length);
    const charsToReplace = Math.floor((maxLen * t) / 2);

    const front = endText.slice(0, charsToReplace);
    const back = endText.slice(-charsToReplace);
    const middleCount = maxLen - charsToReplace * 2;

    // Get middle from whichever string fits, or pad with spaces if shorter
    const startMiddle = startText
      .slice(charsToReplace, charsToReplace + middleCount)
      .padEnd(middleCount, " ");
    interpolatedText = front + startMiddle + back;
  }

  return {
    x: (start.x ?? 0) + ((end.x ?? 0) - (start.x ?? 0)) * t,
    y: (start.y ?? 0) + ((end.y ?? 0) - (start.y ?? 0)) * t,
    w: (start.w ?? 0) + ((end.w ?? start.w ?? 0) - (start.w ?? 0)) * t,
    h: (start.h ?? 0) + ((end.h ?? start.h ?? 0) - (start.h ?? 0)) * t,
    text: interpolatedText.trimEnd(),
  };
};

const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  const targetY = 550;
  const isUserScrollingRef = useRef(false);
  const isAutoScrollingRef = useRef(false);

  useEffect(() => {
    let animationFrameId: number;

    const updateScroll = () => {
      if (isUserScrollingRef.current) {
        isAutoScrollingRef.current = false;
        return; // stop auto-scroll if user intervenes
      }

      const currentY = window.scrollY;
      if (currentY < targetY) {
        isAutoScrollingRef.current = true;
        const nextY = currentY + (targetY - currentY) * 0.03 + 2;
        window.scrollTo({ top: nextY });
        setScrollY(nextY);
        animationFrameId = requestAnimationFrame(updateScroll);
      } else {
        isAutoScrollingRef.current = false;
        setScrollY(currentY);
      }
    };

    const onScroll = () => {
      isUserScrollingRef.current = true;
      setScrollY(window.scrollY);
      // After a short pause, allow auto-scroll again
      setTimeout(() => {
        isUserScrollingRef.current = false;
        if (!isAutoScrollingRef.current && window.scrollY < targetY) {
          updateScroll();
        }
      }, 100);
    };

    window.addEventListener("scroll", onScroll);

    const startAutoScroll = () => {
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => requestAnimationFrame(updateScroll));
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
  const fallbackX = Math.random() * 90; // x in vw
  const fallbackY = 50 + Math.random() * 800; // y in px
  const s = stateArr.map((st) => {
    const hasExplicitPos = st?.x !== undefined || st?.y !== undefined;
    const isRandom = !hasExplicitPos;

    return {
      x: st?.x ?? fallbackX, //x in vw
      y: st?.y ?? fallbackY, //y in px
      w: st?.w ?? def.w, //w in px
      h: st?.h ?? def.h, //h in px
      text: st?.text,
      __random: isRandom,
    };
  });

  return { ...def, states: s };
};

const Hero: React.FC = () => {
  const windowWidth = useWindowWidth();
  const shapesDefs = React.useMemo(
    () =>
      baseShapesDefs.map((s) => ({
        ...s,
        w:
          windowWidth < 700
            ? s.h * 6 // switch w and h for narrow screens. scale w equivalent to h, in px.
            : (s.w * windowWidth) / 100, // w in px
        h: windowWidth < 700 ? s.w * 6 : (s.h * windowWidth) / 100, //h in px. For smaller screens, h is limited to 400 px i.e distance between top and bottom lines in 'about me'. but base h is designed for total h of 70px. so multiplied by 10
      })),
    [windowWidth]
  );
  const projectStateMaps = React.useMemo(
    () => generateProjectStates(projectsArray, baseShapesDefs, windowWidth),
    [windowWidth]
  );
  const scaleXnY = (state: ShapeState, def: ShapeDef) => {
    const x = state.x;
    const y = state.y;

    if (windowWidth < 700) {
      return {
        ...state,
        x: y !== undefined ? (y - 7.5) * 6 + windowWidth / 2 : undefined,
        y: x !== undefined ? (61 - x) * 6 + 225 - def.h : undefined, // baseShapesDefs.h
      };
    } else {
      return {
        ...state,
        x: x !== undefined ? x + 18 : undefined,
        y: y !== undefined ? (y * windowWidth) / 100 + 250 : undefined,
      };
    }
  };

  const states: ShapeState[][] = React.useMemo(
    () =>
      shapesDefs.map((s) => [
        {},
        scaleXnY(HeroState[s.id], s) ?? {},
        scaleXnY(NameState[s.id], s) ?? {},
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
          let newX = st.x;
          let newY = st.y;

          if (idx === 1 || idx === 2) {
            const sourceState = idx === 1 ? HeroState[s.id] : NameState[s.id];
            const scaled = scaleXnY(sourceState, def);
            newX = scaled?.x ?? st.x;
            newY = scaled?.y ?? st.y;
          }
          if (st.__random && windowWidth < 700) {
            //replace with something else . this is buggy.
            newX = (st.x ?? 0) * (windowWidth / 100); // adjust factor as needed
          }
          return {
            ...st,
            x: newX,
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

        // Determine base color (fully opaque)
        const baseColor = s.id === "Dot" ? "#da1f26" : "#171717";
        el.style.background = baseColor;

        // Determine opacity based on random state
        const opacityStart = s.states[currentStage.startStateIndex].__random
          ? 0.2
          : 1;
        const opacityEnd = s.states[currentStage.endStateIndex]?.__random
          ? 0.2
          : 1;

        // Interpolate opacity
        const opacity = opacityStart + (opacityEnd - opacityStart) * progress;
        el.style.opacity = `${opacity}`;

        // Set position and size
        if (windowWidth < 700) {
          el.style.left = `${x}px`;
        } else {
          el.style.left = `${x}vw`;
        }
        el.style.top = `${y}px`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.transform = s.rotation ? `rotate(${s.rotation}deg)` : "";

        // Render text
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
          id={s.id}
          ref={(el) => {
            shapeRefs.current[s.id] = el;
          }}
          className={`${styles.shape} ${
            verticalIds.includes(s.id)
              ? styles.shapeVertical
              : styles.shapeHorizontal
          } }`}
        >
          <div></div>
        </div>
      ))}
    </div>
  );
};

export default Hero;
