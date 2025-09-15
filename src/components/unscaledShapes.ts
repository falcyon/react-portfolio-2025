// unscaledShapes.ts
import { projectsArray } from "../data/projects";
// --------------------
// Shape IDs (single source of truth)
// --------------------
export const shapeIDs = [
  "Lh","Et","Em","Eb"
  ,"F1t","F1m",
  "F2t","F2m",
  "Nr","Nl","Iv","F2v","F1v","Ev","Lv","Ns","Dot"
] as const;

export type ShapeID = typeof shapeIDs[number];
export type ShapeType = "long" | "short" | "dot" | "slant";

// --------------------
// Unscaled Shape Definitions
// --------------------
export interface ShapeDims {
  w: number;
  h: number;
  rotation?: number;
  shapeType: ShapeType;
}

// --------------------
// Shape States
// --------------------
export interface ShapeState {
  x: number;
  y: number;
  text?: string;
  textType?: string;
  __random?: boolean;
}



// Combined shape data structure
export interface ShapesWithAllStates extends ShapeDims {
  states: {
    state: ShapeState;
    scrollVal: number;
  }[];
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



const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate points that are at least `minDist` apart
const generateNonClumpingPoints = (
  count: number,
  minDist: number
): { x: number; y: number }[] => {
  const points: { x: number; y: number }[] = [];

  while (points.length < count) {
    const x = randomInRange(0, 100);
    const y = randomInRange(0, 100);

    // check if it's far enough from existing points
    const tooClose = points.some(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      return dx * dx + dy * dy < minDist * minDist;
    });

    if (!tooClose) {
      points.push({ x, y });
    }
  }

  return points;
};

// --------------------
// RandomState: maps each ShapeID to a random ShapeState (non-clumping)
// --------------------
const minDist = 15; // tweak this: higher = more spaced out
const points = generateNonClumpingPoints(shapeIDs.length, minDist);

const RandomState: Record<ShapeID, ShapeState> = Object.fromEntries(
  shapeIDs.map((id, i) => {
    if (unscaledShapes[id].shapeType === "dot") {
      return [id, { x: 48, y: 35,__random: true }];
    }
    return [id, { x: points[i].x, y: points[i].y, __random: true }];
  })
) as Record<ShapeID, ShapeState>;


// --------------------
// HeroState (second state, explicit)
// --------------------
const HeroState: Record<ShapeID, ShapeState> = {
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

// --------------------
// NameState (third state, explicit)
// --------------------
const NameState: Record<ShapeID, ShapeState> = {
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
  Iv: { x: 43, y: 0 },
  Nl: { x: 48, y: 0 },
  Nr: { x: 57, y: 0 },
  Ns: { x: 46.1, y: 6 },
  Dot: { x: 61, y: 12 },
};




// Generate combined data dynamically
export const unscaledShapesWithStates: Record<ShapeID, ShapesWithAllStates> = Object.fromEntries(
  shapeIDs.map(id => [
    id,
    {
      ...unscaledShapes[id],
      states: [
        { state: RandomState[id], scrollVal: 10 },
        { state: HeroState[id], scrollVal: 200 },
        { state: HeroState[id], scrollVal: 900 },
        { state: NameState[id], scrollVal: 1200 },
        { state: NameState[id], scrollVal: 1900 },
        // Project-specific states will be added here
      ],
    }
  ])
) as Record<ShapeID, ShapesWithAllStates>;

const longShapeIDs = shapeIDs.filter(id => unscaledShapes[id].shapeType === "long");
const shortShapeIDs = shapeIDs.filter(id => unscaledShapes[id].shapeType === "short");

let longIndex = 0;
let shortIndex = 0;
let scrollVal = 1200; //end of NameState

// Iterate over projectsArray to add project-specific states

for (const project of projectsArray) {
  //create a new Record<ShapeID, ShapeState> that is a copy of randomState
  const projectState: Record<ShapeID, ShapeState> = { ...RandomState };
  // Add project-specific text to long and short shapes
  
    const nameShape = longShapeIDs[longIndex % longShapeIDs.length];
    projectState[nameShape] = {
      // x:RandomState[nameShape].x,
      // y:RandomState[nameShape].y,
      x: project.width,
      y: project.height,
      text: project.name,
      textType: "name",
      __random: false
    };
    longIndex++;

    const yearShape = shortShapeIDs[shortIndex % shortShapeIDs.length];
    projectState[yearShape] = {
      //  x:RandomState[yearShape].x,
      // y:RandomState[yearShape].y,
      x: project.width,
      y: project.height,
      text: project.year.toString(),
      textType: "year",
      __random: false
    };
    shortIndex++;

    for (const tag of project.tags) {
      const tagShape = shortShapeIDs[shortIndex % shortShapeIDs.length];
      projectState[tagShape] = {
      //   x:RandomState[tagShape].x,
      // y:RandomState[tagShape].y,
        x: project.width,
        y: project.height,
        text: tag,
        textType: "tag",
        __random: false
      };
      shortIndex++;
    }
  scrollVal += 1000
    //add projectState & scrollVal to the states array of each shape in unscaledShapesWithStates
    for (const id of shapeIDs) {
      unscaledShapesWithStates[id].states.push({
        state: projectState[id],
        scrollVal
      });
      unscaledShapesWithStates[id].states.push({
        state: projectState[id],
        scrollVal: scrollVal + 700
      });
    } 
}