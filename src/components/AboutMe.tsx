import styles from './AboutMe.module.css';

import Link from 'next/link';

export default function AboutMe() {
    return (
        <section className={styles.aboutMeDiv}>
            <div className={styles.aboutMeHeader}>
                <h2>I&apos;m Leffin,</h2>
                <h2>a multi-discplinary Artist with a background in</h2>
                <h2>Design, Engineering, Data Science & Finance.</h2>
            </div>
            <div className={styles.aboutMeContent}>
                <p>
                    I have a background in Design, Engineering, Data Science & Finance. I design interactive experiences (physical & digital) using user research & data to craft impactful installations.
                </p>
                <p>
                    My multidisciplinary skills (code, design, analysis) bring my vision to life. Having been brought up in multiple cultures, I am curious about the differences and similarities that make us human. I aim to engage my audience in introspection by making them look underneath the glass, figure out where the wires go, and understand what is behind the curtain.
                </p>
                <p>
                    Recently, I have been exploring the combination of AI and anthropology through physical manifestations.
                </p>
                <p>
                    I hold a Bachelors in Aerospace Engineering with a minor in Industrial Design from IIT Bombay and a Masters in Design & Technology from Parsons School of Design, New York.
                </p>
                <p>
                    You can connect with me on{' '}
                    <Link href="https://www.linkedin.com/in/leffin/">
                        LinkedIn
                    </Link>{' '}
                    or{' '}
                    <Link href="https://www.instagram.com/leffinc">
                        Instagram
                    </Link>{' '}
                    or check out my{' '}
                    <Link href="/resume">
                        Resumé
                    </Link>.
                </p>
            </div>

        </section>
    )
}