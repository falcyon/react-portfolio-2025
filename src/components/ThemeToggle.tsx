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
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "50%",
                    background: "var(--foreground)",
                    position: "relative",
                    overflow: "visible", // allow rays to extend outside
                    transition:
                        "transform 0.6s cubic-bezier(.77,0,.18,1), background-color 0.4s ease",
                    transform:
                        theme === "dark"
                            ? "scale(1) rotate(0deg)"
                            : "scale(1.5) rotate(20deg)",
                }}
            >
                {/* Inner circle (exists in BOTH modes) */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background:
                            theme === "light"
                                ? "var(--background)"
                                : "var(--foreground)",
                        transform:
                            theme === "light"
                                ? "translateX(-35%)"
                                : "translateX(0)",
                        transition:
                            "transform 0.6s cubic-bezier(.77,0,.18,1) 0.4s ease",
                        zIndex: 2,
                    }}
                />

                {/* Sun rays (ONLY visible in dark mode) */}
                {theme === "dark" &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                width: "2px",
                                height: "0.6rem", // ray length outside circle
                                background: "var(--foreground)",
                                top: "-1.25rem",
                                left: "50%",
                                transform: `
            translateX(-50%)
            rotate(${i * 60}deg)
            translateY(+0.5rem)
          `,
                                transformOrigin: "center 2rem",
                                borderRadius: "999px",
                                zIndex: 1,
                            }}
                        />
                    ))}
            </div>



        </div>
    );
}
