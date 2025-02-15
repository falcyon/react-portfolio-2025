import styles from "./ProjectCard.module.css";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
    name: string;
    slug: string;
    thumbnail: string;
    thumbnailType: "image" | "video";
    tags: string[];
}

export default function ProjectCard({ name, slug, thumbnail, thumbnailType, tags }: ProjectCardProps) {
    return (
        <div className={styles.projectCardDiv}>
            <Link href={`/projects/${slug}`}>
                <div className={styles.thumbnailContainer}>
                    {thumbnailType === "image" ? (
                        <Image src={thumbnail} alt={name} width={300} height={200} />
                    ) : (
                        <video src={thumbnail} controls width="300" height="200" />
                    )}
                </div>
                <h3>{name}</h3>
                <div className={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                </div>
            </Link>
        </div>
    );
}
