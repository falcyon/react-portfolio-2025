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
  cells: Set<string>,
  word: string,
  row: number,
  col: number,
  dir: Dir,
) {
  for (let i = 0; i < word.length; i++) {
    const r = row + dir[0] * i;
    const c = col + dir[1] * i;
    grid[r][c] = word[i];
    cells.add(`${r},${c}`);
  }
}

function generateGrid(): {
  grid: string[][];
  leffinCells: Set<string>;
  wordCells: Set<string>;
} {
  const grid: string[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(""),
  );
  const leffinCells = new Set<string>();
  const wordCells = new Set<string>();

  // Place LEFFIN in the center
  const centerRow = Math.floor(ROWS / 2);
  const startCol = Math.floor((COLS - CENTER_WORD.length) / 2);
  placeWord(grid, leffinCells, CENTER_WORD, centerRow, startCol, [0, 1]);

  // Place identity words longest-first for best fit
  const sorted = [...WORDS].sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    const dirs =
      word.length > ROWS ? [DIRECTIONS[0]] : DIRECTIONS;

    for (let attempt = 0; attempt < 1000; attempt++) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);

      if (canPlace(grid, word, row, col, dir)) {
        placeWord(grid, wordCells, word, row, col, dir);
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

  return { grid, leffinCells, wordCells };
}

export default function WordSearchPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState({ colW: 0, rowH: 0 });
  const [{ grid, leffinCells, wordCells }] = useState(generateGrid);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setSizes({ colW: width / COLS, rowH: height / ROWS });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cellClass = (r: number, c: number) => {
    const key = `${r},${c}`;
    if (leffinCells.has(key)) return `${styles.cell} ${styles.leffin}`;
    if (wordCells.has(key)) return styles.cell;
    return `${styles.cell} ${styles.filler}`;
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {sizes.colW > 0 && (
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${COLS}, ${sizes.colW}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${sizes.rowH}px)`,
            fontSize: `${Math.min(sizes.colW, sizes.rowH) * 0.55}px`,
          }}
        >
          {grid.flatMap((row, r) =>
            row.map((letter, c) => (
              <span key={`${r}-${c}`} className={cellClass(r, c)}>
                {letter}
              </span>
            )),
          )}
        </div>
      )}
    </div>
  );
}