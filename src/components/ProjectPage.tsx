import styles from "./ProjectPage.module.css";
import UnderConstruction from "./UnderConstruction";
import CloseButton from "./CloseButton";
import PagePreloader from "./PagePreloader";

interface Section {
    type: "text" | "image" | "video";
    size: "h" | "f" | "t";
    text?: string[];
    src?: string;
    alt?: string;
}

interface ProjectProps {
    project: {
        name: string;
        tags: string[];
        description: string;
        year: number;
        content: {
            sections: Section[];
        }[];
    };
}

export default function ProjectPage({ project }: ProjectProps) {

    const hasContent = project.content && project.content.length > 0;

    return (
        <>
            <PagePreloader />
            <div className={styles.projectPageDiv}>
                <CloseButton />
                <div className={styles.tagsContainer}>
                    {project.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                </div>
                <h1>{project.name}</h1>
                <h2>{project.description}</h2>
                <h2>[{project.year}]</h2>

                <div className={styles.contentContainer}>
                    {hasContent ? (
                        project.content?.map((sectionGroup, index) => (
                            <div key={index} className={styles.sectionGroup}>
                                {sectionGroup.sections.map((section, idx) => {
                                    switch (section.type) {
                                        case "text":
                                            return (
                                                <div key={idx} className={`${styles[section.size]} ${styles.textSection}`}>
                                                    {section.text?.map((paragraph, pIndex) => (
                                                        <p key={pIndex}>{paragraph}</p>
                                                    ))}
                                                </div>
                                            );
                                        case "image":
                                            return (
                                                <div key={idx} className={`${styles[section.size]} ${styles.imageSection}`}>
                                                    <img
                                                        src={section.src}
                                                        alt={section.alt ?? "Image"}
                                                        className={styles.image}
                                                    />
                                                </div>
                                            );
                                        case "video":
                                            return (
                                                <div key={idx} className={`${styles[section.size]} ${styles.videoSection}`}>
                                                    <video src={section.src} loop autoPlay muted playsInline preload="metadata" style={{
                                                    }}
                                                    />
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })}

                            </div>
                        ))
                    ) : (
                        <UnderConstruction />
                    )}
                </div>
                <div className={styles.endOfPage}>
                    <hr />
                </div>


            </div>
        </>
    );
}
