import type { Metadata } from "next";
import labItems from "@/content/lab.json";
import styles from "./lab.module.css";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Interactive prototypes, p5.js sketches, and experiments by Leffin.",
};

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
        {labItems.map((item) => (
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
