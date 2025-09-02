import styles from './AboutMe.module.css';
import Link from 'next/link';

export default function AboutMe() {
    const gridOverlayStyle: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // let clicks pass through
        backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 200px)",
        // each step = 200px (instead of 20vh)
        zIndex: 10,
    };

    const labelStyle: React.CSSProperties = {
        position: "absolute",
        left: 0,
        transform: "translateY(-50%)",
        fontSize: "12px",
        color: "blue",
    };

    // Generate labels every 200px up to 2000px
    const markers = Array.from({ length: 15 }, (_, i) => i * 200);

    return (
        <section
            className={styles.aboutMeDiv}
            style={{
                height: "3000px",
                minHeight: "3000px",
                maxHeight: "3000px",
                position: "relative",
                fontSize: "24px",
            }}
        >
            {/* Grid overlay */}
            <div style={gridOverlayStyle}>
                {markers.map((px, i) => (
                    <div
                        key={i}
                        style={{
                            ...labelStyle,
                            top: `${px}px`, // pixel-based labels
                        }}
                    >
                        {px}px
                    </div>
                ))}
            </div>

            <div className={styles.stage1}>
                <h1 style={{ position: 'absolute', top: '800px', left: '20vw' }}>Welcome to</h1>
                <h1 style={{ position: 'absolute', top: '1200px', left: '20vw' }}>A gallery in the ether</h1>
            </div>

            <div className={styles.aboutMeHeader}>
                <h2 style={{ position: 'absolute', top: '1800px', left: '20vw' }}>I am</h2>
                <h2 style={{ position: 'absolute', top: '2200px', left: '20vw' }}>a multi-discplinary Artist with a background in Design, Engineering, Data Science & Finance</h2>

            </div>


            {/* <div className={styles.aboutMeContent} style={{ position: 'absolute', top: '2000px', left: '50vw' }}>
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
            </div> */}
        </section>
    );
}
