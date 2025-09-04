// import styles from "./Gallery.module.css";
import ProjectCard from "./ProjectCard";
import { projectsArray } from "../data/projects";

export default function Gallery() {

    const galleryItemStyle: React.CSSProperties = {
        height: "1000px",           // fixed pixel height
        display: "grid",           // make item itself a grid
        placeItems: "center",      // center child both horizontally & vertically
    };



    return (
        <div>
            {projectsArray.map((project) => (
                <div key={project.slug} style={galleryItemStyle}>
                    <ProjectCard {...project} />
                </div>
            ))}
        </div>
    );
}
