import styles from "./Gallery.module.css";
import ProjectCard from "./ProjectCard";
import { projectsArray } from "../data/projects"; // Import data from external file


export default function Gallery() {

    return (
        <div className={styles.galleryDiv}>
            {projectsArray.map((project) => {
                const columns = project.columns ?? 1;
                return (
                    <div key={project.slug} className={styles[`columns-${columns}`]}>
                        <ProjectCard {...project} />
                    </div>
                )
            })}
        </div>
    );
}
