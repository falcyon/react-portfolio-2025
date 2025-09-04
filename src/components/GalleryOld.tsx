import styles from "./GalleryOld.module.css";
import ProjectCard from "./ProjectCard";
import { projectsArray } from "../data/projects"; // Import data from external file


const getGridStyles = (size: string, position: number | undefined) => {
    let gridColumnStart: number | string;
    let gridColumnEnd: number | string;

    switch (size) {
        case "f":
            gridColumnStart = 1;
            gridColumnEnd = -1; // Stretch across all columns
            break;
        case "1":
            gridColumnStart = 1;
            gridColumnEnd = -1; // Stretch across all columns but offset by 2
            break;
        case "h":
            // Set gridColumnStart based on position
            switch (position) {
                case 1:
                    gridColumnStart = 1;
                    break;
                case 2:
                    gridColumnStart = 4;
                    break;
                case 3:
                    gridColumnStart = 7;
                    break;
                default:
                    gridColumnStart = 1; // Fallback if position is unknown
            }
            gridColumnEnd = gridColumnStart + 6;
            break;
        case "t":
            switch (position) {
                case 1:
                    gridColumnStart = 1;
                    break;
                case 2:
                    gridColumnStart = 5;
                    break;
                case 3:
                    gridColumnStart = 9;
                    break;
                default:
                    gridColumnStart = 1;
            }
            gridColumnEnd = gridColumnStart + 4; // Default gridColumnEnd for "h" type is just 1 column wide
            break;
        case "q":
            switch (position) {
                case 1:
                    gridColumnStart = 1;
                    break;
                case 2:
                    gridColumnStart = 4;
                    break;
                case 3:
                    gridColumnStart = 7;
                    break;
                case 4:
                    gridColumnStart = 10;
                    break;
                default:
                    gridColumnStart = 1;
            }
            gridColumnEnd = gridColumnStart + 3; // Default gridColumnEnd for "h" type is just 1 column wide
            break;
        default:
            gridColumnStart = 1;
            gridColumnEnd = -1;
    }
    return { gridColumnStart: 4, gridColumnEnd: 10 }
    return { gridColumnStart, gridColumnEnd };
};


export default function Gallery() {

    return (
        <div className={styles.galleryDiv}>
            {projectsArray.map((project) => {
                // Use position and width to calculate grid-column values
                const { gridColumnStart, gridColumnEnd } = getGridStyles(project.size, project.position);

                return (
                    <div
                        key={project.slug}
                        className={styles.galleryItem}
                        style={{
                            gridColumnStart: gridColumnStart,
                            gridColumnEnd: gridColumnEnd
                        }}
                    >
                        <ProjectCard {...project} />
                    </div>
                )
            })}
        </div>
    );
}
