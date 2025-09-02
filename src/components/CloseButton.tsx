"use client";
import { useRouter } from "next/navigation";
import styles from "./ProjectPage.module.css";

export default function CloseButton() {
    const router = useRouter();

    const handleClick = () => {
        const referrer = document.referrer;
        const isFromHome = referrer.includes(window.location.origin + "/");

        if (isFromHome) {
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
