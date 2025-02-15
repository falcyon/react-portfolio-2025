import styles from "./ProjectPage.module.css";

interface ProjectProps {
    project: {
        name: string;
        tags: string[];
        description?: string;
    };
}

export default function ProjectPage({ project }: ProjectProps) {
    return (
        <div className={styles.projectPageDiv}>
            <h1>{project.name}</h1>
            <div className={styles.tagsContainer}>
                {project.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                ))}
            </div>
            <p>{project.description ?? "Under Construction"}</p>
        </div>
    );
}
