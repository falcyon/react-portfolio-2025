"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./WordSearchPlayground.module.css";

const COLS = 40;
const ROWS = 20;

const CENTER_WORD = "LEFFIN";

const WORDS = [
  "MULTIDISCIPLINARY",
  "INTROSPECTIVE",
  "TECHNOLOGIST",
  "EXPERIMENTAL",
  "INTERACTIVE",
  "STORYTELLER",
  "IMMERSIVE",
  "EMBODIED",
  "ENGINEER",
  "BUILDER",
  "ARTIST",
  "HUMAN",
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Dir = [number, number];
const DIRECTIONS: Dir[] = [
  [0, 1], // right
  [1, 0], // down
];

function canPlace(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  dir: Dir,
): boolean {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir[0] * i;
    const c = col + dir[1] * i;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
    if (grid[r][c] !== "" && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(
  grid: string[][],
  highlighted: Set<string>,
  word: string,
  row: number,
  col: number,
  dir: Dir,
) {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir[0] * i;
    const c = col + dir[1] * i;
    grid[r][c] = word[i];
    highlighted.add(`${r},${c}`);
  }
}

function generateGrid(): { grid: string[][]; highlighted: Set<string> } {
  const grid: string[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(""),
  );
  const highlighted = new Set<string>();

  // Place LEFFIN in the center
  const centerRow = Math.floor(ROWS / 2);
  const startCol = Math.floor((COLS - CENTER_WORD.length) / 2);
  placeWord(grid, highlighted, CENTER_WORD, centerRow, startCol, [0, 1]);

  // Place identity words longest-first for best fit
  const sorted = [...WORDS].sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    // Only right or down — skip down if word is taller than grid
    const dirs =
      word.length > ROWS ? [DIRECTIONS[0]] : DIRECTIONS;

    for (let attempt = 0; attempt < 1000; attempt++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);

      if (canPlace(grid, word, row, col, dir)) {
        placeWord(grid, highlighted, word, row, col, dir);
        break;
      }
    }
  }

  // Fill empty cells with random letters
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!grid[r][c]) {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * 26)];
      }
    }
  }

  return { grid, highlighted };
}

export default function WordSearchPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(14);
  const [{ grid, highlighted }] = useState(generateGrid);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const size = Math.min(width / COLS, height / ROWS);
      setCellSize(size);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
          fontSize: `${cellSize * 0.55}px`,
        }}
      >
        {grid.flatMap((row, r) =>
          row.map((letter, c) => (
            <span
              key={`${r}-${c}`}
              className={`${styles.cell} ${highlighted.has(`${r},${c}`) ? styles.accent : styles.dim}`}
            >
              {letter}
            </span>
          )),
        )}
      </div>
    </div>
  );
}