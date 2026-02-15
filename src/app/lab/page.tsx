import type { Metadata } from "next";
import styles from "./lab.module.css";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Interactive prototypes, p5.js sketches, and experiments by Leffin.",
};

type LabItem = {
  name: string;
  description: string;
  href: string;
  thumbnail?: string;
};

const LAB_ITEMS: LabItem[] = [
  {
    name: "Dino Revenge",
    description: "A Gemini-powered twist on the Chrome dinosaur game.",
    href: "/lab/dinoRevenge",
  },
  {
    name: "Human Condition",
    description: "Real-time body segmentation with pose detection overlays. Sketch for the Human Condition installation.",
    href: "https://editor.p5js.org/Falcyon/full/NmCT_pCwr",
    thumbnail: "/media/thumbnails/portraiture.mp4",
  },
  {
    name: "Unraveling",
    description: "Generative thread simulation that slowly disintegrates into noise.",
    href: "https://editor.p5js.org/Falcyon/full/uYdaF57i4",
    thumbnail: "/media/thumbnails/unraveling.mp4",
  },
  {
    name: "Bit by Bit",
    description: "Pixel-level deconstruction of an image, rebuilt one bit at a time. Prep for the Bit by Bit piece.",
    href: "https://editor.p5js.org/Falcyon/full/BzzwCfNDG",
    thumbnail: "/media/thumbnails/bitbybit.mp4",
  },
  {
    name: "Quantum Bit",
    description: "Visualizing a single qubit state on the Bloch sphere with interactive rotation.",
    href: "https://editor.p5js.org/Falcyon/full/cDzpug0tm",
    thumbnail: "/media/thumbnails/qtouch.mp4",
  },
  {
    name: "Qubit 2",
    description: "Two entangled qubits rendered as coupled oscillations.",
    href: "https://editor.p5js.org/Falcyon/full/7Z2Dsncft",
    thumbnail: "/media/thumbnails/qtouch.mp4",
  },
  {
    name: "Quantum Superposition",
    description: "Superposition states visualized as overlapping probability clouds.",
    href: "https://editor.p5js.org/Falcyon/full/VbNi3YKbO",
    thumbnail: "/media/thumbnails/triptych2.mp4",
  },
  {
    name: "Face Mask Delaunay",
    description: "Delaunay triangulation mapped to facial landmarks in real time. Sketch for Stained Mask.",
    href: "https://editor.p5js.org/Falcyon/full/ouUtT5cHm",
    thumbnail: "/media/thumbnails/StainedMask.mp4",
  },
  {
    name: "Interference",
    description: "Wave interference patterns generated from two oscillating point sources.",
    href: "https://editor.p5js.org/Falcyon/full/O43Eb2nPb",
  },
  {
    name: "Circles Face",
    description: "Concentric circles that track and mirror facial features via webcam.",
    href: "https://editor.p5js.org/Falcyon/full/-qVxYZAlj",
  },
  {
    name: "Tree of Life",
    description: "Recursive fractal tree with randomized branching angles.",
    href: "https://editor.p5js.org/Falcyon/full/M9Ax006Hj",
  },
  {
    name: "Lost & Found",
    description: "Interactive particle system that responds to mouse position.",
    href: "https://editor.p5js.org/Falcyon/full/vUwgtrwcw",
  },
  {
    name: "Lost & Found Gesture",
    description: "Gesture-controlled variant using hand tracking.",
    href: "https://editor.p5js.org/Falcyon/full/9Hdo9m79M",
  },
  {
    name: "Frame Difference + Posenet",
    description: "Frame differencing combined with PoseNet for motion-reactive visuals.",
    href: "https://editor.p5js.org/Falcyon/full/dH-UsAsUb",
  },
  {
    name: "Exquisite Corpse",
    description: "Digital take on the surrealist drawing game — three segments composed independently.",
    href: "https://editor.p5js.org/Falcyon/full/xvA8bAxOC",
  },
  {
    name: "Clovers in My Eyes",
    description: "Kaleidoscopic clover patterns generated from webcam input.",
    href: "https://editor.p5js.org/Falcyon/full/7JHA02yau",
  },
  {
    name: "Comp Portrait",
    description: "Facial expression detection mapped to generative visual responses.",
    href: "https://editor.p5js.org/Falcyon/full/3_Ydio3ez",
  },
  {
    name: "Youtube Watch",
    description: "Time-based visualization synced to video playback.",
    href: "https://editor.p5js.org/Falcyon/full/lLubts4rp",
  },
];

function ExternalIcon() {
  return (
    <svg
      className={styles.extIcon}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 1.5H10.5V8.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 1.5L1.5 10.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function isExternal(href: string) {
  return href.startsWith("http");
}

export default function LabPage() {
  return (
    <main className={styles.lab}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lab</h1>
        <p className={styles.subtitle}>
          Interactive prototypes, p5.js sketches, and experiments.
        </p>
      </div>

      <ul className={styles.list}>
        {LAB_ITEMS.map((item) => (
          <li key={item.name} className={styles.row}>
            <div className={styles.thumbCell}>
              {item.thumbnail ? (
                item.thumbnail.endsWith(".mp4") ? (
                  <video
                    src={item.thumbnail}
                    className={styles.thumb}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className={styles.thumb}
                  />
                )
              ) : (
                <div className={styles.thumbPlaceholder}>
                  <span>p5</span>
                </div>
              )}
            </div>
            <a
              href={item.href}
              target={isExternal(item.href) ? "_blank" : undefined}
              rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
              className={styles.nameLink}
            >
              {item.name}
              <ExternalIcon />
            </a>
            <span className={styles.description}>{item.description}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
