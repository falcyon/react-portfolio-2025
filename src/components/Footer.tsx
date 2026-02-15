import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <span>&copy; 2026 | Designed and coded by Leffin</span>
      </div>
      <div className={styles.center}>
        <div className={styles.linkGroup}>
          <a href="mailto:leffin7@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/leffin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.instagram.com/leffinc/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className={styles.links}>
        Portfolio Archives:
        <a href="https://2025.leff.in" target="_blank" rel="noopener noreferrer"> 2025</a>
      </div>
    </footer>
  );
}
