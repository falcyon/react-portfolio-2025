"use client";

import { useState, useEffect, useMemo } from "react";
import styles from "./ShapesLayer.module.css";
import {
  ShapeID,  // types 
  ShapeDims, ShapeState, ShapesWithAllStates,//shape data structures
  unscaledShapesWithStates
} from "./unscaledShapes";
import { useScrollYwithAutoScroll as useScrollY } from "./hooks";
//create interface called ShapeDefs that has all the properties of ShapeDims and ShapeState and an additonal property, progress?: number
interface ShapeDefs extends ShapeDims, ShapeState {
  alpha: number;
  layer: number;
  progress: number;
}
import PagePreloader from "./PagePreloader";


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

const isHeroState = (i: number) => i >= 1 && i <= 4;
const isProjectState = (i: number) => i > 4;
const DOT_DEFAULT_POSITION = { x: 25, y: 15 };

// Returns the corners (x1,x2,y1,y2) of project thumbnails

function getProjectBounds(state: ShapeState, windowWidth: number, isMobile: boolean) {
  // state.x & state.y here are projects width and height
  const ratio = (state.x * 500) / state.y;
  const padding = isMobile ? 25 : 100

  if (windowWidth > ratio + 2 * padding) {
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
    projx1: isMobile ? 50 : 100,
    projx2: isMobile ? windowWidth - 50 : windowWidth - 120,
    projy1: 0.5 * (1000 - (state.y * (windowWidth - 2 * padding)) / state.x),
    projy2: 0.5 * (1000 + (state.y * (windowWidth - 2 * padding)) / state.x),
  };
}
let tagCountPerState: Record<number, number> = {};
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
 * - Hero state (bespoke offsets)
 * - Random state (scatter positioning)
 * - Project state (name/year/tag placement)
 * - Default scaling
 */
function scaleState(
  s: { state: ShapeState; scrollVal: number },
  i: number,
  shape: ShapesWithAllStates,
  windowWidth: number,
  windowHeight: number,
  scaleFactor: number,
  isMobile: boolean
) {
  let x = s.state.x * scaleFactor;
  let y = s.state.y * scaleFactor;

  // --- Hero state (indices 1–4)
  if (isHeroState(i)) {
    if (isMobile) {
      x = (s.state.y - 7.5) * scaleFactor + windowWidth / 2;
      y = (61 - s.state.x - shape.w) * scaleFactor + 175;
      x = (s.state.x + 2) * scaleFactor;
      y = s.state.y * scaleFactor + 250;

    } else {
      x = (s.state.x + 18) * scaleFactor;
      y = s.state.y * scaleFactor + 250;
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
      x = projx1 - 40;
      y = projy1 - 100;
    } else if (s.state.textType === "year") {
      x = projx2 - (isMobile ? 80 : 20);
      y = projy1 - 60;
    } else if (s.state.textType === "tag") {
      x = isMobile ? projx1 - 30 : projx2 - 20;
      y = isMobile ? projy2 + 10 : projy2 - 80;

      // Adjust for multiple tags
      tagCountPerState[i] = (tagCountPerState[i] ?? 0) + 1;
      const { x: newX, y: newY } = getTagOffset(x, y, tagCountPerState[i], scaleFactor, isMobile);
      x = newX;
      y = newY;
    }
  }
  // const heightOffset = Math.max(0, windowHeight - 500);
  // --- Final scaled state
  return {
    state: {
      ...s.state,
      x,
      y: s.state.__random || (shape.shapeType === "dot" && isProjectState(i)) || (isHeroState(i))
        ? y // keep y as-is for random/dot project states
        : i % 2 === 1
          ? y + (isMobile ? 250 : 400) // odd index: push down start state
          : y + (isMobile ? -150 : -100), // even index: pull up end state
    },
    scrollVal: s.scrollVal,
  };
}

/**
 * Scale an entire shape (its dimensions + all its states).
 */

function scaleShape(
  shape: ShapesWithAllStates,
  windowWidth: number,
  windowHeight: number,
  isMobile: boolean
) {
  const scaleFactor = isMobile ? windowWidth * 1.5 / 100 : windowWidth / 100;


  return {
    // w: isMobile ? shape.h * scaleFactor : shape.w * scaleFactor, // mobile swaps w/h scaling
    // h: isMobile ? shape.w * scaleFactor : shape.h * scaleFactor,
    w: shape.w * scaleFactor,
    h: shape.h * scaleFactor,
    rotation: shape.rotation,
    shapeType: shape.shapeType,
    states: shape.states.map((s, i) =>
      scaleState(s, i, shape, windowWidth, windowHeight, scaleFactor, isMobile)
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
  tagCountPerState = {};
  return Object.fromEntries(
    Object.entries(unscaledShapesWithStates).map(([id, shape]) => [
      id,
      scaleShape(shape, windowWidth, windowHeight, isMobile),
    ])
  ) as Record<ShapeID, ShapesWithAllStates>;
}


// Helper function to get current shape state based on scrollY. the positionedshape is w,h,rotation, shapetype from scaledShapesWithStates, and x,y,text,textType from the state in scaledShapesWithStates where scrollVal is the largest scrollVal less than or equal to scrollY.
function getCurrentShapeState(scaledShapesWithStates: Record<ShapeID, ShapesWithAllStates>, scrollY: number): { currentShapeState: Record<ShapeID, ShapeDefs>, startIndex: number } {
  const currentShapeState: Record<ShapeID, ShapeDefs> = {} as Record<ShapeID, ShapeDefs>;
  let startIndex = 0
  for (const shapeID in scaledShapesWithStates) {
    const shape = scaledShapesWithStates[shapeID as ShapeID];
    // Find the state with the largest scrollVal less than or equal to scrollY
    let startState = shape.states[0].state;
    let endState = shape.states[1].state;
    let startScrollVal = 0;
    let endScrollVal = 0;
    startIndex = 0
    for (const s of shape.states) {
      if (s.scrollVal <= scrollY) {
        startState = s.state;
        startScrollVal = s.scrollVal;
        startIndex += 1
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
      alpha = 0.1 + 0.9 * progress;
      layer = progress > 0.5 ? 1 : 0;


    } else if (!startState.__random && endState.__random) {
      alpha = 1 - 0.9 * progress;
      layer = progress < 0.5 ? 1 : 0;
    } else if (startState.__random && endState.__random) {
      alpha = 0.1;
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
  return { currentShapeState, startIndex };
}




export default function ShapesLayer() {
  const scrollY = useScrollY(); // in pixels
  const { width: windowWidth, height: windowHeight } = useWindowSize(); // in pixels

  // Compute scaledShapesWithStates when windowWidth changes
  const scaledShapesWithStates = useMemo(
    () => getScaledShapesWithStates(unscaledShapesWithStates, windowWidth, windowHeight),
    [windowWidth, windowHeight]
  );

  // Then get the current shape definitions based on scroll position
  const { currentShapeState, startIndex } = useMemo(
    () => getCurrentShapeState(scaledShapesWithStates, scrollY),
    [scaledShapesWithStates, scrollY]
  );

  const handleHomeClick = () => {
    // Example: scroll back to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Or navigate programmatically if you’re using Next.js/React Router
    // router.push("/")
  };

  const renderShapes = (layer: number) =>
    Object.entries(currentShapeState)
      .filter(([, shape]) => shape.layer === layer)
      .map(([shapeID, shape]) => {
        const { w, h, x, y, rotation, shapeType, text, textType, alpha } = shape;
        const backgroundColor =
          shapeType === "dot"
            ? "var(--accent)"
            : `rgba(31, 32, 34, ${alpha ?? 1})`;

        const isHomeButton = shapeType === "dot" && startIndex > 2;

        return (
          <div
            key={shapeID}
            className={`${styles.shape} ${styles[shapeType]} ${startIndex}`}
            style={{
              width: `${w}px`,
              height: `${h}px`,
              transform: `translate(${x}px, ${y}px) rotate(${rotation || 0}deg)`,
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor,
              cursor: isHomeButton ? "pointer" : "default",
            } as React.CSSProperties}
            onClick={isHomeButton ? handleHomeClick : undefined}
          >
            {text && (
              <div className={`${styles.text} ${styles[textType ?? ""]}`}>
                {text}
              </div>
            )}
          </div>
        );
      });

  return (
    <>
      <PagePreloader />
      <div className={styles.ShapesBackgroundContainer}>
        {renderShapes(0)}
      </div>
      <div className={styles.ShapesOverlayContainer}>
        {renderShapes(1)}
      </div>
    </>
  );
}
