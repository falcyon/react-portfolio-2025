// unscaledShapes.ts
import { projectsArray } from "../data/projects";
// --------------------
// Shape IDs (single source of truth)
// --------------------
export const shapeIDs = [
  "Lh","Et","Em","Eb"
  ,"F1t","F1m",
  "F2t","F2m",
  "Lv", "Ev", "F1v", "F2v", "Iv", "Nl", "Nr", 
  // "Nr", "Nl", "Iv", "F2v", "F1v", "Ev", "Lv", 
  "Ns","Dot"
] as const;

export type ShapeID = typeof shapeIDs[number];
export type ShapeType = "long" | "short" | "dot" | "slant";

// --------------------
// Unscaled Shape Definitions
// --------------------
export interface ShapeDims {
  w: number;
  h: number;
  shapeType: ShapeType;
}

// --------------------
// Shape States
// --------------------
export interface ShapeState {
  x: number;
  y: number;
  rotation?: number;
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
  Ns: { w: 15.84, h: 3, shapeType: "slant" },
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
      return [id, { x: 48, y: 35,__random: false }];
    }
    else if (unscaledShapes[id].shapeType === "slant"){
      return [id, { x: points[i].x, y: points[i].y,rotation: 57.55, __random: true }];
    }
    else{
      return [id, { x: points[i].x, y: points[i].y, __random: true }];
    }
   
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
  Ns: { x: 49.1, y: 6, rotation: 57.55 },
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
  Ns: { x: 46.1, y: 6, rotation: 57.55 },
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
        { state: HeroState[id], scrollVal: 550 },
        { state: HeroState[id], scrollVal: 1300 },
        { state: NameState[id], scrollVal: 1500 },
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
let scrollVal = 1400; //end of NameState

// Iterate over projectsArray to add project-specific states
const ProjectStateDummy: Record<ShapeID, ShapeState> = {
  Lv: { x: 4, y: 29, __random: true },
  Ev: { x: 9, y: 45 , __random: true},
  F1v: { x: 17, y: 50, __random: true },
  F2v: { x: 27, y: 42 , __random: true},
  Iv: { x: 29, y: 15, __random: true },
  Nl: { x: 22, y: 6 , __random: true},
  Nr: { x: 13, y: 5, __random: true },
  Lh: { x: 66, y: 8, __random: true },
  Et: { x: 80, y: 39 , __random: true},
  Em: { x: 68, y: 71 , __random: true},
  Eb: { x: 48, y: 76, __random: true },
  F1t: { x: 23, y: 72, __random: true },
  F1m: { x: 16, y: 44 , __random: true},
  F2t: { x: 20, y: 20 , __random: true},
  F2m: { x: 40, y: 12 , __random: true},
  Ns: { x: 46.1, y: 6 , __random: true},
  Dot: { x: 50, y: 50, __random: false },
};


function noisyValue(base: number, range: number = 10) {
  return base + (Math.random() * 2 - 1) * range;
}

let previousState = { ...ProjectStateDummy };

for (const project of projectsArray) {
  //create a new Record<ShapeID, ShapeState> that is a copy of randomState
  const projectState: Record<ShapeID, ShapeState> = { ...RandomState };

  // --- Rotate long shapes, update only x and y ---
  // const lenLong = longShapeIDs.length;
  // const rotatedLong = longShapeIDs.map(id => previousState[id]);
  // for (let i = 0; i < lenLong; i++) {
  //   const toID = longShapeIDs[i];
  //   const fromShape = rotatedLong[(i - 1 + lenLong) % lenLong];
  //   projectState[toID] = {
  //     ...ProjectStateDummy[toID],        // keep all original attributes
  //     x: noisyValue(fromShape.x*1.06, 0),   // rotated + noise
  //     y: noisyValue(fromShape.y*1.04, 0),
  //   };
  // }

  // --- Rotate short shapes, update only x and y ---
  // const lenShort = shortShapeIDs.length;
  // const rotatedShort = shortShapeIDs.map(id => previousState[id]);
  // for (let i = 0; i < lenShort; i++) {
  //   const toID = shortShapeIDs[i];
  //   const fromShape = rotatedShort[(i - 1 + lenShort) % lenShort];
  //   projectState[toID] = {
  //     ...ProjectStateDummy[toID],        // keep all other attributes
  //     x: noisyValue(fromShape.x*2, 0),
  //     y: noisyValue(fromShape.y*2, 0),
  //   };
  // }
  // previousState = projectState;


    const nameShape = longShapeIDs[longIndex % longShapeIDs.length];
    projectState[nameShape] = {
      x:RandomState[nameShape].x,
      y:RandomState[nameShape].y,
      // x: project.width,
      // y: project.height,
      text: project.name,
      rotation: 0,
      textType: "name",
      __random: false
    };
    longIndex++;

    const yearShape = shortShapeIDs[shortIndex % shortShapeIDs.length];
    projectState[yearShape] = {
       x:RandomState[yearShape].x,
      y:RandomState[yearShape].y,
      // x: project.width,
      // y: project.height,
      text: project.year.toString(),
      textType: "year",
      __random: false
    };
    shortIndex++;

    for (const tag of project.tags) {
      const tagShape = shortShapeIDs[shortIndex % shortShapeIDs.length];
      projectState[tagShape] = {
        x:RandomState[tagShape].x,
      y:RandomState[tagShape].y,
        // x: project.width,
        // y: project.height,
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