import ProjectCard from "./ProjectCard";
import { projectsArray } from "../data/projects";

export default function Gallery() {
    const galleryGridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1fr", // single column
        width: "100%",
        position: "relative", // for absolute lines
    };

    const galleryItemStyle: React.CSSProperties = {
        height: "1000px",           // fixed pixel height
        display: "grid",           // make item itself a grid
        placeItems: "center",      // center child both horizontally & vertically
    };

    // Calculate how tall the gallery is in px
    const galleryHeight = projectsArray.length * 1000; // each project is 800px

    // Build debug grid lines every 200px
    const gridLines = [];
    for (let i = 0; i <= galleryHeight; i += 200) {
        const pxMark = 3000 + i; // start at 2000px because AboutMe is 2000px tall
        gridLines.push(
            <div
                key={pxMark}
                style={{
                    position: "absolute",
                    top: `${i}px`,
                    left: 0,
                    width: "100%",
                    borderTop: "1px dashed rgba(0,0,0,0.3)",
                    fontSize: "12px",
                    color: "blue",
                }}
            >
                <span style={{ position: "absolute", left: "5px", top: "-10px" }}>
                    {pxMark}px
                </span>
            </div>
        );
    }

    return (
        <div style={{ ...galleryGridStyle, minHeight: `${galleryHeight}px` }}>
            {/* Debug Grid Lines */}
            {gridLines}

            {projectsArray.map((project) => (
                <div key={project.slug} style={galleryItemStyle}>
                    <ProjectCard {...project} />
                </div>
            ))}
        </div>
    );
}
