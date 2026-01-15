"use client";
import { useRouter, usePathname } from "next/navigation";
import styles from "./ProjectPage.module.css";

export default function CloseButton() {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = () => {
        // Track close button click with current project
        const projectSlug = pathname.split('/').pop() || 'unknown';
        window.umami?.track('close-button-click', { project: projectSlug });

        const referrer = document.referrer;
        const isFromHome = referrer.includes(window.location.origin + "/");

        if (isFromHome || window.history.length > 1) {
            router.back(); // preserves scroll position
        } else {
            router.push("/"); // scrolls to top
        }
    };

    return (
        <button className={styles.closeButton} onClick={handleClick}>
            ×
        </button>
    );
}
