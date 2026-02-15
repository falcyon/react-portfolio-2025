import type { ComponentType } from "react";

export interface PlaygroundMeta {
  id: string;
  label: string;
  component: ComponentType;
}

// Static imports — 4 small components, no need for lazy loading yet
import ShapesPlayground from "./shapes/ShapesPlayground";
import DictionaryPlayground from "./dictionary/DictionaryPlayground";
import MuseumPlayground from "./museum/MuseumPlayground";
import TerminalPlayground from "./terminal/TerminalPlayground";

export const playgroundRegistry: PlaygroundMeta[] = [
  {
    id: "shapes",
    label: "Animated rectangles forming LEFFIN",
    component: ShapesPlayground,
  },
  {
    id: "dictionary",
    label: "Dictionary definition of Leffin",
    component: DictionaryPlayground,
  },
  {
    id: "museum",
    label: "Museum placard for Leffin",
    component: MuseumPlayground,
  },
  {
    id: "terminal",
    label: "Terminal CLI typing Leffin",
    component: TerminalPlayground,
  },
];
