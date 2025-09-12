// heroStates.ts
import { Project } from "../data/projects";

/** Shape definition with defaults */
export interface ShapeDef {
  id: string;
  w: number;
  h: number;
  rotation?: number;
}

/** Single state of a shape (position + optional size override) */
export interface ShapeState {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  text?: string;
  textType?: string;
  __random?: boolean;
}

/** Scroll stage: start → end states, and scroll length in vh */
export interface Stage {
  startStateIndex: number;
  endStateIndex: number;
  scrollLength: number;
}

export const baseShapesDefs: ShapeDef[] = [
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

export const HeroState: Record<string, ShapeState> = {
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

// Define shapeIDs for certain years
export const yearShapes: Record<string, string> = {
  "2025": "Lh",
  "2024": "Et",
  "2023": "Em",
  "2022": "Eb",
  "2021": "F1t",
  "2017": "F1m",
};

// Define shapeIDs for certain tags
export const tagShapes: Record<string, string> = {
  Interactive: "Lv",
  Physical: "Ev",
  Digital: "F1v",
  Data: "F2v",
  Installation: "Iv",
  Design: "Nl",
  Engineering: "Nr",
};

export const NameState: Record<string, ShapeState> = {
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

export function generateStages(projects: Project[]): Stage[] {
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

export const landingStages: Stage[] = [
  { startStateIndex: 0, endStateIndex: 1, scrollLength: 300 },
  { startStateIndex: 1, endStateIndex: 1, scrollLength: 700 },
  { startStateIndex: 1, endStateIndex: 2, scrollLength: 300 },
  { startStateIndex: 2, endStateIndex: 2, scrollLength: 700 },
];
