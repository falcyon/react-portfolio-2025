import type { Metadata } from "next";
import Link from "next/link";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Leffin is a multidisciplinary New Media Artist whose work spans interactive installations, projection mapping, performance art, and AI-driven experiences.",
};

const EXHIBITIONS = [
  {
    venue: "Currents New Media Festival",
    work: "Ephemera",
    slug: "ephemera",
    location: "Santa Fe, NM",
    year: "2025",
    href: "https://currentsnewmedia.org",
  },
  {
    venue: "NYCxDesign",
    work: "Ephemera",
    slug: "ephemera",
    location: "New York, NY",
    year: "2025",
    href: "https://nycxdesign.org/event/what-comes-after-no-one-future-artifacts-for-a-final-generation/",
  },
  {
    venue: "LUMA Festival",
    work: "\u2026And Words Will Echo in My Soul",
    slug: "andWordsWillEchoInMySoul",
    location: "Binghamton, NY",
    year: "2024",
    href: "https://lumafestival.com/feature/but-words-will-echo-in-my-soul/",
  },
  {
    venue: "Grace Exhibition Space",
    work: "Palimpsest",
    slug: "palimpsest",
    location: "New York, NY",
    year: "2023",
    href: "https://pixelmouth.org/follow-the-machine",
  },
  {
    venue: "Parsons \u00D7 LG AI Research",
    work: "\u2026And Words Will Echo in My Soul",
    slug: "andWordsWillEchoInMySoul",
    location: "New York, NY",
    year: "2023",
    href: "https://tnsadai.com/artistss",
  },
  {
    venue: "AMT Moving Image Festival",
    work: "Human Condition",
    slug: "humanCondition",
    location: "New York, NY",
    year: "2023",
    href: "https://amtmovingimagefetival2023.webflow.io/",
  },
  {
    venue: "Entropy, Parsons MFA Thesis",
    work: "Palimpsest",
    slug: "palimpsest",
    location: "New York, NY",
    year: "2023",
    href: "https://parsons.edu/dt-2023/palimpsest/",
  },
];

const SPEAKING = [
  {
    event: "Parsons School of Design",
    role: "Guest Teacher",
    year: "2023",
    href: "https://www.newschool.edu/parsons/",
  },
  { event: "MIT Reality Hack", role: "Mentor, Hardware Track", year: "2023" },
  {
    event: "The New School \u00D7 IBM Qiskit",
    role: "Student Mentor, Quantum Design Jam",
    year: "2023",
    href: "https://innovationcenter.newschool.edu/speakers-and-mentors/",
  },
  { event: "IBM Quantum", role: "Mentor, Quantum Design Jam", year: "2022" },
];

const PRESS = [
  {
    publication: "Korea Herald",
    year: "2023",
    href: "https://www.koreaherald.com/article/2955333",
  },
  {
    publication: "The New School News",
    year: "2023",
    href: "https://blogs.newschool.edu/news/2023/12/parsons-school-of-design-and-lg-ai-research-present-exhibit-that-highlights-art-design-and-artificial-intelligence/",
  },
  {
    publication: "PRNewswire",
    year: "2022",
    href: "https://www.prnewswire.com/news-releases/lgs-super-giant-ai-exaone-become-a-pioneer-in-the-design-field-with-parsons--school-of-design-301622521.html",
  },
  {
    publication: "LUMA Festival",
    type: "Artist Feature",
    year: "2024",
    href: "https://lumafestival.com/feature/but-words-will-echo-in-my-soul/",
  },
  {
    publication: "Insight IIT Bombay",
    type: "Profile",
    year: "2016",
    href: "https://insightiitb.org/citi-bank-leffin-christopher-2/",
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

export default function AboutPage() {
  return (
    <main className={styles.about}>
      {/* Hero bio */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.name}>Leffin</h1>
          <p className={styles.summary}>
            Multidisciplinary New Media Artist building immersive, interactive
            installations that use AI and the human body to ask deeply
            introspective questions.
          </p>
          <div className={styles.credentials}>
            <div className={styles.credential}>
              <span className={styles.credLabel}>Education</span>
              <span>MFA Design & Technology, Parsons — <em>Honors</em></span>
              <span>B.Tech Aerospace, IIT Bombay — <em>Minor in Industrial Design</em></span>
            </div>
            <div className={styles.credential}>
              <span className={styles.credLabel}>Current</span>
              <span>Experience Design Lead, Citibank</span>
            </div>
          </div>
        </div>
        <div className={styles.heroLinks}>
          <a href="mailto:leffin7@gmail.com">Email</a>
          <a href="https://www.instagram.com/leff.in" target="_blank" rel="noopener noreferrer">Instagram <ExternalIcon /></a>
          <a href="https://www.linkedin.com/in/leffin" target="_blank" rel="noopener noreferrer">LinkedIn <ExternalIcon /></a>
          <a href="/leffin_resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
        </div>
      </section>

      {/* Exhibitions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Exhibitions & Festivals</h2>
        <ul className={styles.list}>
          {EXHIBITIONS.map((e) => (
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
          {SPEAKING.map((s) => (
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
          {PRESS.map((p) => (
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
