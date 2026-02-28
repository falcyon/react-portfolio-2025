import type { Metadata } from "next";
import Link from "next/link";
import aboutData from "@/content/about.json";
import ExternalIcon from "@/components/ExternalIcon";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Leffin is a multidisciplinary New Media Artist whose work spans interactive installations, projection mapping, performance art, and AI-driven experiences.",
};

export default function AboutPage() {
  return (
    <main className={styles.about}>
      {/* Hero bio */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.tagline}>
            <span className={styles.tagArt}>Artist.</span>{' '}
            <span className={styles.tagEng}>Engineer.</span>{' '}
            <span className={styles.tagDesign}>Designer.</span>
          </p>
          <p className={`${styles.summary} ${styles.summaryArt}`}>{aboutData.summaryArt}</p>
          <p className={`${styles.summary} ${styles.summaryCorp}`}>{aboutData.summaryCorp}</p>
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
        <div className={styles.heroAside}>
          <div className={styles.heroLinks}>
          <a href={`mailto:${aboutData.contact.email}`}>Email</a>
          <a href={aboutData.contact.instagram} target="_blank" rel="noopener noreferrer">Instagram <ExternalIcon className={styles.heroExtIcon} /></a>
          <a href={aboutData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ExternalIcon className={styles.heroExtIcon} /></a>
          <a href={aboutData.contact.github} target="_blank" rel="noopener noreferrer">GitHub <ExternalIcon className={styles.heroExtIcon} /></a>
          </div>
        </div>
      </section>

      {/* Exhibitions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Exhibitions & Festivals</h2>
        <ul className={styles.list}>
          {aboutData.exhibitions.map((e) => (
            <li key={e.venue + e.year} className={styles.exhibRow}>
              {e.href ? (
                <a href={e.href} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                  {e.venue}
                </a>
              ) : (
                <span className={styles.rowName}>{e.venue}</span>
              )}
              <Link href={`/projects/${e.slug}`} className={styles.workLink}>
                {e.work}
              </Link>
              <span className={styles.rowMeta}>{e.location}</span>
              <span className={styles.rowYear}>{e.year}</span>
              {e.href && <ExternalIcon className={styles.extIcon} />}
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
              {s.href ? (
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                  {s.event}
                </a>
              ) : (
                <span className={styles.rowName}>{s.event}</span>
              )}
              <span className={styles.rowDesc}>{s.role}</span>
              <span />
              <span className={styles.rowYear}>{s.year}</span>
              {s.href && <ExternalIcon className={styles.extIcon} />}
            </li>
          ))}
        </ul>
      </section>

      {/* Press — commented out for now
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Press & Media</h2>
        <ul className={styles.list}>
          {aboutData.press.map((p) => (
            <li key={p.publication + p.year} className={styles.row}>
              <div className={styles.rowMain}>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className={styles.rowLink}>
                    {p.publication}
                  </a>
                ) : (
                  <span className={styles.rowName}>{p.publication}</span>
                )}
                {p.type && <span className={styles.rowType}>{p.type}</span>}
              </div>
              <span className={styles.rowYear}>{p.year}</span>
              {p.href && <ExternalIcon className={styles.extIcon} />}
            </li>
          ))}
        </ul>
      </section>
      */}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Professional Experience</h2>
        <ul className={styles.list}>
          {aboutData.experience.map((e) => (
            <li key={e.company + e.period} className={styles.exhibRow}>
              <span className={styles.rowName}>{e.title}</span>
              <span className={styles.rowDesc}>{e.description}</span>
              <span className={styles.rowMeta}>{e.company}</span>
              <span className={styles.rowYear}>{e.period}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
