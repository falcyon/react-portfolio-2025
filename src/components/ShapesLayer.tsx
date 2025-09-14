"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./ShapesLayer.module.css";
import {
  ShapeID, ShapeType,  // types 
  ShapeDims, ShapeState, ShapesWithAllStates,//shape data structures
  unscaledShapesWithStates
} from "./unscaledShapes";

//create interface called ShapeDefs that has all the properties of ShapeDims and ShapeState and an additonal property, progress?: number
interface ShapeDefs extends ShapeDims, ShapeState {
  alpha: number;
  layer: number;
  progress: number;
}
// import { createNoise2D } from "simplex-noise";

// Custom hook for scroll position
function useScrollY(): number {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    setScrollY(window.scrollY); // initialize on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
}

// Custom hook for window size
function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    handleResize(); // initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

// -----------------------------
// Helper functions
// -----------------------------

// Hero states are indices 1–4 (special alignment for name + hero sections)
const isHeroState = (i: number) => i >= 1 && i <= 4;

// Project states are indices > 4 (name/year/tag for projects)
const isProjectState = (i: number) => i > 4;

// Default position for dot-type shapes
const DOT_DEFAULT_POSITION = { x: 25, y: 15 };

/**
 * Calculate project thumbnail bounds depending on aspect ratio and window width.
 * Returns the corners (x1,x2,y1,y2) where project states (name/year/tag) can be placed.
 */
function getProjectBounds(state: ShapeState, windowWidth: number, isMobile: boolean) {
  const ratio = (state.x * 500) / state.y;

  if (windowWidth > ratio + 50) {
    // Wide enough screen
    return {
      projx1: 0.5 * (windowWidth - ratio),
      projx2: 0.5 * (windowWidth + ratio),
      projy1: 250,
      projy2: 750,
    };
  }

  // Narrower case
  return {
    projx1: isMobile ? 25 : 50,
    projx2: isMobile ? windowWidth - 25 : windowWidth - 140,
    projy1: 0.5 * (1000 - (state.y * windowWidth) / state.x),
    projy2: 0.5 * (1000 + (state.y * windowWidth) / state.x),
  };
}

/**
 * Offset tag positions so multiple tags don’t overlap.
 */
function getTagOffset(baseX: number, baseY: number, count: number, scaleFactor: number, isMobile: boolean) {
  if (count <= 1) return { x: baseX, y: baseY };

  if (isMobile) {
    // On mobile, stack tags mostly horizontally
    const x = baseX + 20 * scaleFactor * (count - 1);
    const y = baseY + (count % 2 === 0 ? 10 * scaleFactor * (count - 1) : 0);
    return { x, y };
  }

  // On desktop, stack tags vertically, with slight zigzag
  const y = baseY + 4 * scaleFactor * (count - 1);
  const x = baseX + 5 * scaleFactor * ((count % 2) - 1);
  return { x, y };
}

/**
 * Scale a single state depending on its type:
 * - Hero state (special offsets)
 * - Random state (scatter positioning)
 * - Project state (name/year/tag placement)
 * - Default scaling
 */
function scaleState(
  s: { state: ShapeState; scrollVal: number },
  i: number,
  shape: { w: number; h: number; rotation?: number; shapeType: ShapeType; states: { state: ShapeState; scrollVal: number }[] },
  windowWidth: number,
  windowHeight: number,
  scaleFactor: number,
  tagCountPerState: Record<number, number>,
  isMobile: boolean
) {
  let x = s.state.x * scaleFactor;
  let y = s.state.y * scaleFactor;

  // --- Hero state (indices 1–4)
  if (isHeroState(i)) {
    if (isMobile) {
      x = (s.state.y - 7.5) * scaleFactor + windowWidth / 2;
      y = (61 - s.state.x - shape.w) * scaleFactor + 225;
    } else {
      x = (s.state.x + 18) * (windowWidth / 100);
      y = (s.state.y * windowWidth) / 100 + 250;
    }
  }

  // --- Random state
  else if (s.state.__random) {
    x = s.state.x * (windowWidth / 100) * (isMobile ? 0.9 : 0.85);
    y = s.state.y * (windowHeight / 100) * (isMobile ? 0.8 : 0.7);
  }

  // --- Project states
  else if (isProjectState(i)) {
    const { projx1, projx2, projy1, projy2 } = getProjectBounds(s.state, windowWidth, isMobile);

    if (shape.shapeType === "dot") {
      x = DOT_DEFAULT_POSITION.x;
      y = DOT_DEFAULT_POSITION.y;
    } else if (s.state.textType === "name") {
      x = projx1 - (isMobile ? 3 : 4) * scaleFactor;
      y = projy1 - 3 * scaleFactor;
    } else if (s.state.textType === "year") {
      x = projx2 - (isMobile ? 18 : 2) * scaleFactor;
      y = projy1 + (isMobile ? -6 : 3) * scaleFactor;
    } else if (s.state.textType === "tag") {
      x = isMobile ? projx1 - 3 * scaleFactor : projx2 - 2 * scaleFactor;
      y = isMobile ? projy2 + 3 * scaleFactor : projy2;

      // Adjust for multiple tags
      tagCountPerState[i] = (tagCountPerState[i] ?? 0) + 1;
      const { x: newX, y: newY } = getTagOffset(x, y, tagCountPerState[i], scaleFactor, isMobile);
      x = newX;
      y = newY;
    }
  }

  // --- Final scaled state
  return {
    state: {
      ...s.state,
      x,
      y: s.state.__random || (shape.shapeType === "dot" && isProjectState(i))
        ? y // leave y untouched for random/dot project states
        : (i % 2 === 1 ? y + (isMobile ? 200 : 300) : y - 200), // stagger odd/even placement
    },
    scrollVal: s.scrollVal,
  };
}

/**
 * Scale an entire shape (its dimensions + all its states).
 */
function scaleShape(
  shape: { w: number; h: number; rotation?: number; shapeType: ShapeType; states: { state: ShapeState; scrollVal: number }[] },
  windowWidth: number,
  windowHeight: number,
  isMobile: boolean
) {
  const scaleFactor = isMobile ? 6 : windowWidth / 100;
  const tagCountPerState: Record<number, number> = {};

  return {
    w: isMobile ? shape.h * scaleFactor : shape.w * scaleFactor, // mobile swaps w/h scaling
    h: isMobile ? shape.w * scaleFactor : shape.h * scaleFactor,
    rotation: shape.rotation,
    shapeType: shape.shapeType,
    states: shape.states.map((s, i) =>
      scaleState(s, i, shape, windowWidth, windowHeight, scaleFactor, tagCountPerState, isMobile)
    ),
  };
}

// -----------------------------
// Main Function
// -----------------------------

/**
 * Scale all shapes and their states based on the window size.
 * - Mobile (windowWidth < 700) → fixed factor scaling
 * - Desktop (≥ 700) → proportional scaling by windowWidth
 */
export function getScaledShapesWithStates(
  unscaledShapesWithStates: Record<ShapeID, ShapesWithAllStates>,
  windowWidth: number,
  windowHeight: number
): Record<ShapeID, ShapesWithAllStates> {
  const isMobile = windowWidth < 700;

  return Object.fromEntries(
    Object.entries(unscaledShapesWithStates).map(([id, shape]) => [
      id,
      scaleShape(shape, windowWidth, windowHeight, isMobile),
    ])
  ) as Record<ShapeID, ShapesWithAllStates>;
}


// Helper function to get current shape state based on scrollY. the positionedshape is w,h,rotation, shapetype from scaledShapesWithStates, and x,y,text,textType from the state in scaledShapesWithStates where scrollVal is the largest scrollVal less than or equal to scrollY.
function getCurrentShapeState(scaledShapesWithStates: Record<ShapeID, ShapesWithAllStates>, scrollY: number): Record<ShapeID, ShapeDefs> {
  const currentShapeState: Record<ShapeID, ShapeDefs> = {} as Record<ShapeID, ShapeDefs>;
  for (const shapeID in scaledShapesWithStates) {
    const shape = scaledShapesWithStates[shapeID as ShapeID];
    // Find the state with the largest scrollVal less than or equal to scrollY
    let startState = shape.states[0].state;
    let endState = shape.states[1].state;
    let startScrollVal = 0;
    let endScrollVal = 0;
    for (const s of shape.states) {
      if (s.scrollVal <= scrollY) {
        startState = s.state;
        startScrollVal = s.scrollVal;
      } else {
        endState = s.state;
        endScrollVal = s.scrollVal;
        break;
      }
    }
    const progress = scrollY <= startScrollVal ? 0 : scrollY >= endScrollVal ? 1 : (scrollY - startScrollVal) / (endScrollVal - startScrollVal);

    //define text as 
    const startText = startState.text ?? "";
    const endText = endState.text ?? "";
    let interpolatedText = "";

    if (startText === endText) {
      interpolatedText = startText;
    } else if (!startText) {
      if (progress < 0.5) {
        interpolatedText = "";
      } else {
        const localT = (progress - 0.5) / 0.5;
        const letters = Math.floor(endText.length * localT);
        interpolatedText = endText.slice(0, letters);
      }
    } else if (!endText) {
      if (progress < 0.5) {
        const localT = progress / 0.5;
        const letters = Math.ceil(startText.length * (1 - localT));
        interpolatedText = startText.slice(0, letters);
      } else {
        interpolatedText = "";
      }
    } else {
      // replace characters from the startText with characters from the endText based on progress
      const letters = Math.floor(endText.length * progress);
      interpolatedText = endText.slice(0, letters) + startText.slice(letters);
    }

    //define alpha & layer as 
    let alpha = 1;
    let layer = 1;
    if (startState.__random && !endState.__random) {
      alpha = 0.2 + 0.8 * progress;
      layer = progress > 0.5 ? 1 : 0;


    } else if (!startState.__random && endState.__random) {
      alpha = 1 - 0.8 * progress;
      layer = progress < 0.5 ? 1 : 0;
    } else if (startState.__random && endState.__random) {
      alpha = 0.2;
      layer = 0
    }



    const interpolatedState: ShapeState = {
      x: startState.x + (endState.x - startState.x) * progress,
      y: startState.y + (endState.y - startState.y) * progress,
      text: interpolatedText,
      textType: endState.textType || startState.textType
    };


    currentShapeState[shapeID as ShapeID] = {
      w: shape.w,
      h: shape.h,
      rotation: shape.rotation,
      shapeType: shape.shapeType,
      alpha, // example alpha based on progress
      layer, //which div to go in
      progress, // example progress value
      ...interpolatedState
    };
  }
  return currentShapeState;
}

export default function ShapesLayer() {
  const scrollY = useScrollY(); // in pixels
  const { width: windowWidth, height: windowHeight } = useWindowSize(); //in pixels

  // Compute scaledShapesWithStates when windowWidth changes
  const scaledShapesWithStates = useMemo(() => getScaledShapesWithStates(unscaledShapesWithStates, windowWidth, windowHeight), [windowWidth, windowHeight]);

  // Then get the current shape definitions based on scroll position
  const currentShapeDef = useMemo(() => getCurrentShapeState(scaledShapesWithStates, scrollY), [scaledShapesWithStates, scrollY]);

  const renderShapes = (layer: number) =>
    Object.entries(currentShapeDef)
      .filter(([, shape]) => shape.layer === layer)
      .map(([shapeID, shape]) => {
        const { w, h, x, y, rotation, shapeType, text, textType, alpha } = shape;
        return (
          <div
            key={shapeID}
            className={`${styles.shape} ${styles[shapeType]}`}
            style={{
              width: `${w}px`,
              height: `${h}px`,
              transform: `translate(${x}px, ${y}px) rotate(${rotation || 0}deg)`,
              position: 'absolute',
              top: 0,
              left: 0,
              ["--alpha" as string]: alpha
            } as React.CSSProperties}
          >
            {text && <div className={`${styles.text} ${styles[textType ?? ""]}`}>{text}</div>}
          </div>
        );
      });

  return (
    <>
      <div className={styles.ShapesBackgroundContainer}>
        {renderShapes(0)}
      </div>
      <div className={styles.ShapesOverlayContainer}>
        {renderShapes(1)}
      </div>


    </>
  );


}