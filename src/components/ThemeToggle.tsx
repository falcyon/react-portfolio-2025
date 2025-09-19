"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const saved = localStorage.getItem("theme") as "light" | "dark" | null;
        const initial = saved ?? (prefersDark ? "dark" : "light");
        setTheme(initial);
        document.documentElement.setAttribute("data-theme", initial);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <div
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            style={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                zIndex: 999,
                width: "3rem",
                height: "3rem",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
            }}
        >
            <div
                style={{
                    width: "2rem",
                    height: "2rem",
                    background: "var(--foreground)",
                    borderRadius: "50%",
                    position: "relative",
                    transition:
                        "clip-path 0.6s cubic-bezier(.77,0,.18,1), transform 0.6s cubic-bezier(.77,0,.18,1), background-color 0.4s ease",
                    clipPath:
                        theme === "light"
                            ? "circle(50% at 50% 50%)" // full circle (sun)
                            : "circle(50% at 65% 50%)", // shifted circle (moon crescent effect)
                    transform: theme === "light" ? "scale(1) rotate(0deg)" : "scale(1.2) rotate(25deg)",
                }}
            >
                {/* inner cutout for sun ring effect */}
                {theme === "light" && (
                    <div
                        style={{
                            content: '""',
                            position: "absolute",
                            inset: "0.3rem",
                            borderRadius: "50%",
                            background: "var(--background)",
                        }}
                    />
                )}
            </div>
        </div>
    );
}
