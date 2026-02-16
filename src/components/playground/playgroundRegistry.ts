import type { ComponentType } from "react";

export interface PlaygroundMeta {
  id: string;
  name: string;
  label: string;
  component: ComponentType;
}

// Static imports — 4 small components, no need for lazy loading yet
import ExplosionPlayground from "./explosion/ExplosionPlayground";
import DictionaryPlayground from "./dictionary/DictionaryPlayground";
import TerminalPlayground from "./terminal/TerminalPlayground";
import PhysicsPlayground from "./physics/PhysicsPlayground";
import WordSearchPlayground from "./wordsearch/WordSearchPlayground";

export const playgroundRegistry: PlaygroundMeta[] = [
  {
    id: "explosion",
    name: "Explosion",
    label: "Animated rectangles forming LEFFIN",
    component: ExplosionPlayground,
  },
  {
    id: "dictionary",
    name: "Dictionary",
    label: "Dictionary definition of Leffin",
    component: DictionaryPlayground,
  },
  {
    id: "terminal",
    name: "Terminal",
    label: "Terminal CLI typing Leffin",
    component: TerminalPlayground,
  },
  {
    id: "physics",
    name: "2D Bodies",
    label: "Physics word drop",
    component: PhysicsPlayground,
  },
  {
    id: "wordsearch",
    name: "Word Search",
    label: "Word search puzzle with identity words",
    component: WordSearchPlayground,
  },
];
