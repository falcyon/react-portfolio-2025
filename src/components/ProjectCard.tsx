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
    const aspectRatio = (height / width) * 100;

    return (
        <div className={styles.projectCardDiv}>
            <Link href={`/projects/${slug}`}>

                <div className={styles.thumbnailContainer} style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: `${aspectRatio}%`, // This creates the aspect ratio padding trick
                    backgroundColor: '#f0f0f0', // Optional: You can use a placeholder color while video is loading
                }}>
                    {thumbnailType === "image" ? (
                        // <div className={styles.test}></div>
                        <Image src={thumbnail} alt={name} quality={100} layout="fill" objectFit="cover" />
                    ) : (
                        // <div className={styles.test}></div>
                        <video src={thumbnail} loop autoPlay muted playsInline preload="metadata" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ensures the video covers the container without stretching
                        }}
                        />
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
