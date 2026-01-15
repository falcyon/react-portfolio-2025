"use client";

import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function SocialLinks() {
    const containerStyle: React.CSSProperties = {
        position: "absolute",
        top: "2430px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "16px",
        zIndex: 1,
    };

    const iconStyle: React.CSSProperties = {
        color: "var(--foreground)",
        transition: "color 0.3s",
        cursor: "pointer",
    };

    return (
        <div style={containerStyle}>
            <a
                href="https://www.instagram.com/leffinc/"
                target="_blank"
                rel="noopener noreferrer"
                style={iconStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E1306C")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                onClick={() => window.umami?.track('social-click', { platform: 'instagram' })}
            >
                <FaInstagram size={24} />
            </a>

            <a
                href="mailto:leffin7@gmail.com"
                style={iconStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#007bff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                onClick={() => window.umami?.track('social-click', { platform: 'email' })}
            >
                <MdEmail size={24} />
            </a>

            <a
                href="https://www.linkedin.com/in/leffin/"
                target="_blank"
                rel="noopener noreferrer"
                style={iconStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0A66C2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                onClick={() => window.umami?.track('social-click', { platform: 'linkedin' })}
            >
                <FaLinkedin size={24} />
            </a>
        </div>
    );
}
