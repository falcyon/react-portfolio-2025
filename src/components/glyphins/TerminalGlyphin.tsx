"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./TerminalGlyphin.module.css";

const LINES = [
  { prompt: "$ whoami", output: ["leffin"] },
  {
    prompt: "$ cat about.txt",
    output: [
      "multidisciplinary artist-engineer",
      "builds immersive interactive installations",
      "IIT Bombay → Citibank → Parsons MFA",
    ],
  },
  {
    prompt: "$ ls projects/ | head -4",
    output: [
      "ephemera/",
      "andWordsWillEchoInMySoul/",
      "notesToSelf/",
      "palimpsest/",
    ],
  },
];

const TYPE_SPEED = 35; // ms per character for prompts
const OUTPUT_DELAY = 150; // ms before showing output after prompt
const LINE_DELAY = 80; // ms between output lines
const GROUP_DELAY = 400; // ms between command groups

export default function TerminalGlyphin() {
  const [displayed, setDisplayed] = useState<
    { type: "prompt" | "output"; text: string }[]
  >([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const animating = useRef(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = (fn: () => void, ms: number) => {
      timeout = setTimeout(fn, ms);
    };

    const allSteps: { type: "prompt" | "output"; text: string }[] = [];
    for (const group of LINES) {
      allSteps.push({ type: "prompt", text: group.prompt });
      for (const line of group.output) {
        allSteps.push({ type: "output", text: line });
      }
    }

    let stepIndex = 0;
    let charIndex = 0;

    const typeNext = () => {
      if (!animating.current || stepIndex >= allSteps.length) return;

      const step = allSteps[stepIndex];

      if (step.type === "prompt") {
        // Type prompt character by character
        if (charIndex === 0) {
          setDisplayed((prev) => [...prev, { type: "prompt", text: "" }]);
        }
        if (charIndex < step.text.length) {
          charIndex++;
          setDisplayed((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              type: "prompt",
              text: step.text.slice(0, charIndex),
            };
            return next;
          });
          schedule(typeNext, TYPE_SPEED);
        } else {
          // Prompt done, move to next step
          charIndex = 0;
          stepIndex++;
          schedule(typeNext, OUTPUT_DELAY);
        }
      } else {
        // Output lines appear instantly
        setDisplayed((prev) => [...prev, { type: "output", text: step.text }]);
        stepIndex++;
        charIndex = 0;

        // Check if next step is a prompt (new group) or another output line
        const isNextPrompt =
          stepIndex < allSteps.length && allSteps[stepIndex].type === "prompt";
        schedule(typeNext, isNextPrompt ? GROUP_DELAY : LINE_DELAY);
      }
    };

    schedule(typeNext, 300);

    return () => {
      animating.current = false;
      clearTimeout(timeout);
    };
  }, []);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.terminal}>
      <div className={styles.lines}>
        {displayed.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "prompt" ? styles.prompt : styles.output
            }
          >
            {line.text}
          </div>
        ))}
        <span className={`${styles.cursor} ${cursorVisible ? "" : styles.cursorHidden}`}>
          _
        </span>
      </div>
    </div>
  );
}
