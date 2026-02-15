import type { ComponentType } from "react";

export interface GlyphinMeta {
  id: string;
  label: string;
  component: ComponentType;
}

// Static imports — 4 small components, no need for lazy loading yet
import ShapesGlyphin from "./shapes/ShapesGlyphin";
import DictionaryGlyphin from "./dictionary/DictionaryGlyphin";
import MuseumGlyphin from "./museum/MuseumGlyphin";
import TerminalGlyphin from "./terminal/TerminalGlyphin";

export const glyphinRegistry: GlyphinMeta[] = [
  {
    id: "shapes",
    label: "Animated rectangles forming LEFFIN",
    component: ShapesGlyphin,
  },
  {
    id: "dictionary",
    label: "Dictionary definition of Leffin",
    component: DictionaryGlyphin,
  },
  {
    id: "museum",
    label: "Museum placard for Leffin",
    component: MuseumGlyphin,
  },
  {
    id: "terminal",
    label: "Terminal CLI typing Leffin",
    component: TerminalGlyphin,
  },
];
