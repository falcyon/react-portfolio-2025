"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./GridOverlay.module.css";

export default function GridOverlay() {
    const pathname = usePathname(); // triggers rerender on route change
    const [lines, setLines] = useState<React.ReactNode[]>([]);
    const step = 200;


    useEffect(() => {
        let lastRendered = 0;
        const offset = pathname === "/" ? 600 : 0; // dynamic offset

        const generateLines = () => {
            const scrollBottom = window.scrollY + window.innerHeight;
            const newLines: React.ReactNode[] = [];

            while (lastRendered <= scrollBottom) {
                const pxMark = lastRendered - offset;
                newLines.push(
                    <div
                        key={lastRendered}
                        className={styles.gridLine}
                        style={{ top: `${lastRendered}px` }}
                    >
                        <span className={styles.gridLabel}>{pxMark}px</span>
                    </div>
                );
                lastRendered += step;
            }

            if (newLines.length > 0) {
                setLines(prev => [...prev, ...newLines]);
            }
        };

        // Reset lines whenever the route changes
        setLines([]);
        lastRendered = 0;

        generateLines();

        window.addEventListener("scroll", generateLines);
        window.addEventListener("resize", generateLines);

        return () => {
            window.removeEventListener("scroll", generateLines);
            window.removeEventListener("resize", generateLines);
        };
    }, [pathname]); // rerun effect on route change

    return <div className={styles.gridOverlay}>{lines}</div>;
}
