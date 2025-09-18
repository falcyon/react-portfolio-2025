"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            // duration: 0.3,
            // easing: (t: number) => 1 - Math.pow(1 - t, 3),
            // wheelMultiplier: 1.2,
            // touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
