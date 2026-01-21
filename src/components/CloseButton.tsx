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
        const isFromOwnSite = referrer.includes(window.location.origin);

        if (isFromOwnSite) {
            router.back(); // came from our site, go back to preserve scroll
        } else {
            router.push("/"); // came directly or from external, go to home
        }
    };

    return (
        <button className={styles.closeButton} onClick={handleClick}>
            ×
        </button>
    );
}
