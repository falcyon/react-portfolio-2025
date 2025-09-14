"use client";

import React, { useState, useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";
import { projectsArray, Project } from "../data/projects";
import {
  baseShapesDefs, // all properties: id, w, h, rotation
  HeroState,
  NameState,
  landingStages,
  generateStages,
  ShapeDef, // all properties: id, w, h, rotation
  ShapeState, // all properties: x, y, w, h, text, textType
} from "./heroStates";

import styles from "./Hero.module.css";

const noise2D = createNoise2D();
const stages = [...landingStages, ...generateStages(projectsArray)];

/** ------------------ Hooks ------------------ **/

const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);
    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    return () => window.removeEventListener("resize", updateWindowWidth);
  }, []);

  return windowWidth;
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
        return;
      }

      const currentY = window.scrollY;
      if (currentY < targetY) {
        isAutoScrollingRef.current = true;
        const nextY = currentY + (targetY - currentY) * 0.03 + 1;
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

/** ------------------ Helpers ------------------ **/

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

    const yFirst = [800, 450, 550, 600, 650, 700];
    const xFirst = [20 + windowWidth * 0.01, 30, 70, 80, 74, 73];

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
        y: (yFirst[idx] ?? 400 + idx * 100) - 550,
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
    interpolatedText = startText;
  } else if (!startText) {
    if (t < 0.5) {
      interpolatedText = "";
    } else {
      const localT = (t - 0.5) / 0.5;
      const letters = Math.floor(endText.length * localT);
      interpolatedText = endText.slice(0, letters);
    }
  } else if (!endText) {
    if (t < 0.5) {
      const localT = t / 0.5;
      const letters = Math.ceil(startText.length * (1 - localT));
      interpolatedText = startText.slice(0, letters);
    } else {
      interpolatedText = "";
    }
  } else {
    const maxLen = Math.max(startText.length, endText.length);
    const charsToReplace = Math.floor((maxLen * t) / 2);

    const front = endText.slice(0, charsToReplace);
    const back = endText.slice(-charsToReplace);
    const middleCount = maxLen - charsToReplace * 2;

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
// --- NEW: pre-generate stable random positions ---
const randomPositions: Record<string, { x: number; y: number }> =
  Object.fromEntries(
    baseShapesDefs.map((def) => [
      def.id,
      {
        x: Math.random() * 90, // x in vw
        y: 50 + Math.random() * 800, // y in px
      },
    ])
  );

const makeShape = (def: ShapeDef, stateArr: ShapeState[]): ShapeWithStates => {
  //console log out the states have defined w or h
  stateArr.forEach((st, i) => {
    if (st.w !== undefined || st.h !== undefined) {
      console.log(`State ${i} of shape ${def.id} has defined w or h:`, st);
    }
  });
  const s = stateArr.map((st) => ({
    x: st.x,
    y: st.y,
    w: st.w ?? def.w, // use shape def if not defined in state
    h: st.h ?? def.h, // use shape def if not defined in state
    text: st.text,
    __random: st.__random, // keep whatever is set above
  }));
  return { ...def, states: s };
};

const scaleXnY = (state: ShapeState, def: ShapeDef, windowWidth: number) => {
  const x = state.x;
  const y = state.y;

  if (x === undefined || y === undefined) {
    console.log("undefined x or y in state:", state, "def:", def);
  }
  if (windowWidth < 700) {
    return {
      ...state,
      x: y !== undefined ? (y - 7.5) * 6 + windowWidth / 2 : undefined,
      y: x !== undefined ? (61 - x) * 6 + 225 - def.h : undefined,
    };
  } else {
    return {
      ...state,
      x: x !== undefined ? x + 18 : undefined,
      y: y !== undefined ? (y * windowWidth) / 100 + 250 : undefined,
    };
  }
};

const getStageProgress = (scrollY: number) => {
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

/** ------------------ Extracted Effects ------------------ **/

const useShapesResize = (
  windowWidth: number,
  shapesDefs: ShapeDef[],
  setShapes: React.Dispatch<React.SetStateAction<ShapeWithStates[]>>
) => {
  useEffect(() => {
    setShapes((prevShapes) =>
      prevShapes.map((s) => {
        const def = shapesDefs.find((d) => d.id === s.id)!;
        const newStates = s.states.map((st, idx) => {
          let newX = st.x;
          let newY = st.y;

          if (idx === 1 || idx === 2) {
            const sourceState = idx === 1 ? HeroState[s.id] : NameState[s.id];
            const scaled = scaleXnY(sourceState, def, windowWidth);
            newX = scaled?.x ?? st.x;
            newY = scaled?.y ?? st.y;
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
  }, [windowWidth, shapesDefs, setShapes]);
};

const useShapesAnimation = (
  shapes: ShapeWithStates[],
  currentStage: { startStateIndex: number; endStateIndex: number },
  progress: number,
  windowWidth: number,
  shapePhase: Record<string, number>,
  shapeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>,
  timeRef: React.MutableRefObject<number>
) => {
  useEffect(() => {
    let frameId: number;

    const loop = () => {
      timeRef.current += 0.01;

      shapes.forEach((s) => {
        const el = shapeRefs.current[s.id];
        if (!el) return;

        const { x, y, w, h, text } = getShapePosition(
          s,
          currentStage,
          progress,
          timeRef.current,
          shapePhase
        );

        const baseColor = s.id === "Dot" ? "#da1f26" : "#171717";
        el.style.background = baseColor;

        const opacityStart = s.states[currentStage.startStateIndex].__random
          ? 0.2
          : 1;
        const opacityEnd = s.states[currentStage.endStateIndex]?.__random
          ? 0.2
          : 1;

        const opacity = opacityStart + (opacityEnd - opacityStart) * progress;
        el.style.opacity = `${opacity}`;

        if (windowWidth < 700) {
          el.style.left = `${x}px`;
        } else {
          el.style.left = `${x}vw`;
        }
        el.style.top = `${y}px`;
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.transform = s.rotation ? `rotate(${s.rotation}deg)` : "";

        if (text) {
          const words = text.split(" ");
          const formatted = words
            .map((w, i) => ((i + 1) % 4 === 0 ? w + "<br/>" : w))
            .join(" ");
          el.innerHTML = formatted;
        } else {
          el.innerHTML = "";
        }
      });

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [
    shapes,
    currentStage,
    progress,
    windowWidth,
    shapePhase,
    shapeRefs,
    timeRef,
  ]);
};

/** ------------------ Local Helper ------------------ **/

const getShapePosition = (
  s: ShapeWithStates,
  currentStage: { startStateIndex: number; endStateIndex: number },
  progress: number,
  time: number,
  shapePhase: Record<string, number>
) => {
  const start = s.states[currentStage.startStateIndex];
  const end = s.states[currentStage.endStateIndex];
  const base = interpolate(start, end, progress);

  const scale = 0.3 * 1 - progress * (1 - progress);
  const tNoise = time + shapePhase[s.id];
  const noiseX = noise2D(tNoise, 0) * scale;
  const noiseY = noise2D(tNoise, 1) * scale;

  return {
    ...base,
    x: (base.x ?? 0) + noiseX,
    y: (base.y ?? 0) + noiseY,
  };
};

/** ------------------ Component ------------------ **/

const Hero: React.FC = () => {
  const windowWidth = useWindowWidth();

  const shapesDefs = React.useMemo(
    () =>
      baseShapesDefs.map((s) => ({
        ...s,
        w: windowWidth < 700 ? s.h * 6 : (s.w * windowWidth) / 100,
        h: windowWidth < 700 ? s.w * 6 : (s.h * windowWidth) / 100,
      })),
    [windowWidth]
  );

  const projectStateMaps = React.useMemo(
    () => generateProjectStates(projectsArray, baseShapesDefs, windowWidth),
    [windowWidth]
  );

  const states: ShapeState[][] = React.useMemo(
    () =>
      shapesDefs.map((s) => {
        const random = randomPositions[s.id];

        return [
          { x: random.x, y: random.y, w: s.w, h: s.h, __random: true },
          {
            ...scaleXnY(
              HeroState[s.id] ?? { x: random.x, y: random.y },
              s,
              windowWidth
            ),
            w: s.w,
            h: s.h,
            __random: !HeroState[s.id],
          },
          {
            ...scaleXnY(
              NameState[s.id] ?? { x: random.x, y: random.y },
              s,
              windowWidth
            ),
            w: s.w,
            h: s.h,
            __random: !NameState[s.id],
          },
          ...projectStateMaps.map((m) => {
            const state = m[s.id];
            return state
              ? { ...state, w: s.w, h: s.h, __random: false }
              : { x: random.x, y: random.y, w: s.w, h: s.h, __random: true };
          }),
        ];
      }),
    [windowWidth]
  );

  const [shapes, setShapes] = useState<ShapeWithStates[]>(() =>
    shapesDefs.map((def, i) => makeShape(def, states[i]))
  );

  useShapesResize(windowWidth, shapesDefs, setShapes);

  const scrollY = useScrollY();
  const { stageIndex, progress } = getStageProgress(scrollY);
  const currentStage = stages[stageIndex];

  const timeRef = useRef(0);
  const shapeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const shapePhase = useRef<Record<string, number>>(
    Object.fromEntries(shapes.map((s) => [s.id, Math.random() * 1000]))
  ).current;

  useShapesAnimation(
    shapes,
    currentStage,
    progress,
    windowWidth,
    shapePhase,
    shapeRefs,
    timeRef
  );

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
          }`}
        >
          <div className={s.states[currentStage.endStateIndex]?.textType ?? ""}>
            {s.states[currentStage.endStateIndex]?.text ?? ""}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;
