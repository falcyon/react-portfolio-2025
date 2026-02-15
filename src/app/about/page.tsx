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
          <a href={aboutData.contact.instagram} target="_blank" rel="noopener noreferrer">Instagram <ExternalIcon className={styles.extIcon} /></a>
          <a href={aboutData.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ExternalIcon className={styles.extIcon} /></a>
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
                    {e.venue} <ExternalIcon className={styles.extIcon} />
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
                    {s.event} <ExternalIcon className={styles.extIcon} />
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
                    {p.publication} <ExternalIcon className={styles.extIcon} />
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

      {/* Professional Experience */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Professional Experience</h2>
        <ul className={styles.list}>
          {aboutData.experience.map((e) => (
            <li key={e.company + e.period} className={styles.row}>
              <div className={styles.rowMain}>
                <span className={styles.rowName}>{e.title}</span>
              </div>
              <span className={styles.rowMeta}>{e.company}</span>
              <span className={styles.rowYear}>{e.period}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
