import Image from "next/image";
import Link from "next/link";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
    name: string;
    slug: string;
    thumbnail: string;
    year: string;
    tags: string[];
}

export default function ProjectCard({
    name,
    slug,
    thumbnail,
    year,
    tags
}: ProjectCardProps) {
    const isVideo = thumbnail.match(/\.(mp4|webm|ogg)$/i);
    const tagString = tags.join(", ");

    return (
        <article className={styles.projectCardWrapper}>
            <Link
                href={`/projects/${slug}`}
                aria-label={`View project ${name} from ${year}. Tags: ${tagString}`}
            >
                {isVideo ? (
                    <video
                        src={thumbnail}
                        loop
                        autoPlay
                        muted
                        playsInline
                        preload="metadata"
                        className={styles.projectVideo}
                        aria-label={`${name} project preview video (${year})`}
                    />
                ) : (
                    <Image
                        src={thumbnail}
                        alt={`${name} project thumbnail (${year})`}
                        width={500}
                        height={500}
                        className={styles.projectImage}
                    />
                )}

                {/* Invisible content for screen readers */}
                <h3 className="sr-only">{`${name} (${year})`}</h3>
                <p className="sr-only">{`Tags: ${tagString}`}</p>
            </Link>
        </article>
    );
}
