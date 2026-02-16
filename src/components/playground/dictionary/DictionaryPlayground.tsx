"use client";

import styles from "./DictionaryPlayground.module.css";

export default function DictionaryPlayground() {
  return (
    <div className={styles.entry}>
      <div className={styles.headword}>
        Leffin <span className={styles.phonetic}>/ˈlɛf.ɪn/</span>
      </div>
      <div className={styles.pos}>noun</div>

      <ol className={styles.definitions}>
        <li>
          A new media artist building interactive installations with AI, the
          human body, and introspective questions.
          <span className={styles.example}>
            &ldquo;Have you seen the Leffin at Currents?&rdquo;
          </span>
        </li>
        <li>
          A creative technologist who bridges code, physical materials, and
          human experience into immersive work.
          <span className={styles.example}>
            &ldquo;We need a Leffin for the interactive exhibit.&rdquo;
          </span>
        </li>
        <li>
          A product lead and engineer who ships things from concept to reality.
          <span className={styles.example}>
            &ldquo;She&rsquo;s the Leffin on this project.&rdquo;
          </span>
        </li>
      </ol>

      <div className={styles.pos}>verb</div>

      <ol className={styles.definitions} start={4}>
        <li>
          To relentlessly bridge disciplines that aren&rsquo;t supposed to go
          together.
          <span className={styles.example}>
            &ldquo;She really leffin&rsquo;d that projection-mapped
            installation.&rdquo;
          </span>
        </li>
      </ol>

      <div className={styles.synonyms}>
        <span className={styles.synonymsLabel}>Synonyms</span>
        multidisciplinary, interactive, technologist, introspective, embodied,
        immersive, experimental, human, storyteller, builder
      </div>

      <div className={styles.origin}>
        <span className={styles.originLabel}>Origin</span> IIT Bombay &rarr;
        Citibank &rarr; Parsons MFA (2024)
      </div>
    </div>
  );
}
