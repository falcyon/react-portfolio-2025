"use client";

import type { NewsItem } from "@/data/news";
import styles from "./NewsSection.module.css";

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

export default function NewsSection({ items }: { items: NewsItem[] }) {
  const now = Date.now();
  const current = items.filter(
    (item) => now - new Date(item.date).getTime() < SIX_MONTHS_MS
  );

  if (current.length === 0) return null;

  // Repeat enough times to guarantee no gaps on wide screens
  const reps = Array.from({ length: 6 }, (_, r) =>
    current.map((item, i) => (
      <span key={`${r}-${i}`} className={styles.tickerItem}>
        <span className={styles.bullet} />
        <span className={styles.itemText}>{item.text}</span>
        {item.link && (
          <a
            href={item.link}
            className={styles.link}
            onClick={(e) => e.stopPropagation()}
            {...(item.link.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {item.linkText || "Learn more"}
          </a>
        )}
      </span>
    ))
  );

  return (
    <section className={styles.ticker}>
      <div className={styles.tickerTrack}>
        <div className={styles.tickerContent}>{reps}</div>
      </div>
    </section>
  );
}
