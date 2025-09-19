import React from "react";
import styles from "./StarsBackground.module.css";

export default function StarsBackground() {
    // Generate random positions for 120 stars
    const stars = Array.from({ length: 120 }).map(() => ({
        top: Math.random() * 100,   // % from top
        left: Math.random() * 100,  // % from left
    }));

    return (
        <div className={styles.starsWrapper}>
            {stars.map((pos, i) => (
                <div
                    key={i}
                    className={styles.star}
                    style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                />
            ))}
        </div>
    );
}
