import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
    name: string;
    slug: string;
    thumbnail: string;
}

export default function ProjectCard({ name, slug, thumbnail }: ProjectCardProps) {
    const isVideo = thumbnail.match(/\.(mp4|webm|ogg)$/i);

    return (
        <Link className={styles.projectCardWrapper} href={`/projects/${slug}`}>

            {isVideo ? (
                <video
                    src={thumbnail}
                    loop
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    className={styles.projectVideo}
                />
            ) : (
                <Image
                    src={thumbnail}
                    alt={name}
                    width={500}
                    height={500}
                    className={styles.projectImage}
                />
            )}

        </Link>
    );
}
