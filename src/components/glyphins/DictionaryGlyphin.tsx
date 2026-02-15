"use client";

import styles from "./DictionaryGlyphin.module.css";

export default function DictionaryGlyphin() {
  return (
    <div className={styles.entry}>
      <div className={styles.headword}>
        Leffin <span className={styles.phonetic}>/ˈlɛf.ɪn/</span>
      </div>
      <div className={styles.pos}>noun</div>

      <ol className={styles.definitions}>
        <li>
          A multidisciplinary artist-engineer who builds immersive, interactive
          installations that use AI and the human body to ask deeply
          introspective questions.
          <span className={styles.example}>
            &ldquo;Have you seen the Leffin at Currents?&rdquo;
          </span>
        </li>
        <li>
          The act of relentlessly bridging aerospace engineering, data science,
          and new media art.
          <span className={styles.example}>
            &ldquo;She&rsquo;s really leffin it with that projection-mapped
            installation.&rdquo;
          </span>
        </li>
      </ol>

      <div className={styles.origin}>
        <span className={styles.originLabel}>Origin</span> IIT Bombay &rarr;
        Citibank &rarr; Parsons MFA (2024)
      </div>
    </div>
  );
}
