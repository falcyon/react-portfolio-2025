import type { Metadata } from "next";
import Link from "next/link";
import aboutData from "@/content/about.json";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Leffin is a multidisciplinary New Media Artist whose work spans interactive installations, projection mapping, performance art, and AI-driven experiences.",
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

export default function AboutPage() {
  return (
    <main className={styles.about}>
      {/* Hero bio */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.name}>{aboutData.name}</h1>
          <p className={styles.summary}>{aboutData.summary}</p>
          <div className={styles.credentials}>
            <div className={styles.credential}>
              <span className={styles.credLabel}>Education</span>
              {aboutData.credentials.education.map((ed) => (
                <span key={ed.text}>{ed.text} — <em>{ed.note}</em></span>
              ))}
            </div>
            <div className={styles.credential}>
              <span className={styles.credLabel}>Current</span>
              <span>{aboutData.credentials.current}</span>
            </div>
          </div>
        </div>
        <div className={styles.heroLinks}>
          <a href={`mailto:${aboutData.contact.email}`}>Email</a>
          <a href={aboutData.contact.instagram} target="_blank" rel="noopener noreferrer">Instagram <ExternalIcon /></a>
          <a href={aboutData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ExternalIcon /></a>
          <a href={aboutData.contact.resume} target="_blank" rel="noopener noreferrer">Resume</a>
        </div>
      </section>

      {/* Exhibitions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Exhibitions & Festivals</h2>
        <ul className={styles.list}>
          {aboutData.exhibitions.map((e) => (
            <li key={e.venue + e.year} className={styles.exhibRow}>
              <div className={styles.rowMain}>
                {e.href ? (
                  <a href={e.href} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                    {e.venue} <ExternalIcon />
                  </a>
                ) : (
                  <span className={styles.rowName}>{e.venue}</span>
                )}
              </div>
              <Link href={`/projects/${e.slug}`} className={styles.workLink}>
                {e.work}
              </Link>
              <span className={styles.rowMeta}>{e.location}</span>
              <span className={styles.rowYear}>{e.year}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Speaking */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Speaking & Teaching</h2>
        <ul className={styles.list}>
          {aboutData.speaking.map((s) => (
            <li key={s.event + s.year} className={styles.exhibRow}>
              <div className={styles.rowMain}>
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                    {s.event} <ExternalIcon />
                  </a>
                ) : (
                  <span className={styles.rowName}>{s.event}</span>
                )}
              </div>
              <span className={styles.rowMeta}>{s.role}</span>
              <span className={styles.rowYear}>{s.year}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Press */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Press & Media</h2>
        <ul className={styles.list}>
          {aboutData.press.map((p) => (
            <li key={p.publication + p.year} className={styles.row}>
              <div className={styles.rowMain}>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                    {p.publication} <ExternalIcon />
                  </a>
                ) : (
                  <span className={styles.rowName}>{p.publication}</span>
                )}
                {p.type && <span className={styles.rowType}>{p.type}</span>}
              </div>
              <span className={styles.rowYear}>{p.year}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
