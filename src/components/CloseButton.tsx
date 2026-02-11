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

        const cameFromLanding = sessionStorage.getItem('navigated-from-landing');
        if (cameFromLanding) {
            sessionStorage.removeItem('navigated-from-landing');
            window.history.back();
        } else {
            router.push("/");
        }
    };

    return (
        <button className={styles.closeButton} onClick={handleClick}>
            ×
        </button>
    );
}
