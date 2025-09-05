import ProjectCard from "../components/ProjectCard";
import { projectsArray } from "../data/projects";
import styles from "./Gallery.module.css";

export default function Gallery() {
    const galleryItemStyle: React.CSSProperties = {
        height: "1000px",
        display: "grid",
        placeItems: "center",
    };

    return (
        <div>
            <h2 className={styles.galleryTitle}>PROJECTS</h2>
            {projectsArray.map((project) => (
                <div key={project.slug} style={galleryItemStyle}>
                    <ProjectCard {...project} />
                </div>
            ))}
        </div>
    );
}
