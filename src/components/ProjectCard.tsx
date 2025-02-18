import styles from "./ProjectCard.module.css";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
    name: string;
    slug: string;
    thumbnail: string;
    width: number;
    height: number;
    tags: string[];
    description: string;
    year: number;
}

const getThumbnailType = (thumbnail: string) => {
    const ext = thumbnail.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
        return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(ext || '')) {
        return 'video';
    }
    return 'image'; // Default to image if no match
};

export default function ProjectCard({ name, slug, thumbnail, width, height, tags, description, year }: ProjectCardProps) {
    const thumbnailType = getThumbnailType(thumbnail);


    return (
        <div className={styles.projectCardDiv}>
            <Link href={`/projects/${slug}`}>
                <div className={styles.thumbnailContainer}>
                    {thumbnailType === "image" ? (
                        // <div className={styles.test}></div>
                        <Image src={thumbnail} alt={name} quality={100} width={width} height={height} />
                    ) : (
                        // <div className={styles.test}></div>
                        <video src={thumbnail} loop autoPlay muted playsInline width="100%" height="100%" />
                    )}
                </div>
                <div className={styles.headerContainer}>
                    <h3>{name} - {year}</h3>
                    <div className={styles.tagsContainer}>
                        {tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>{tag}</span>
                        ))}
                    </div>
                </div>
                <h4>{description}</h4>
            </Link>
        </div>
    );
}
