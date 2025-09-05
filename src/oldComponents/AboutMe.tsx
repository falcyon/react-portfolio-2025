import styles from './AboutMe.module.css';

export default function AboutMe() {
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
            <div className={styles.stage1}>
                <h1 className={styles.centeredAbsolute} style={{ top: '700px' }}>
                    Welcome to
                </h1>
                <h1 className={styles.centeredAbsolute} style={{ top: '1200px' }}>
                    A gallery in the ether
                </h1>
            </div>

            <div className={styles.aboutMeHeader}>
                <h2 className={styles.centeredAbsolute} style={{ top: '1700px' }}>
                    I am
                </h2>
                <h2 className={styles.centeredAbsolute} style={{ top: '2200px' }}>
                    a multi-disciplinary Artist with a background in Design, Engineering, Data Science & Finance
                </h2>
            </div>
        </section>
    );
}
