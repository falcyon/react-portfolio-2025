import Image from "next/image";
import styles from "./ProjectPage.module.css";
import UnderConstruction from "./UnderConstruction";
import CloseButton from "./CloseButton";
import PagePreloader from "./PagePreloader";
import ResponsiveVideo from "./ResponsiveVideo";

interface Section {
    type: "text" | "image" | "video";
    size: "h" | "f" | "t" | "t2" | "q" | "s";
    text?: string[];
    src?: string;
    alt?: string;
    style?: string;
}

interface ProjectProps {
    project: {
        name: string;
        tags: string[];
        description: string;
        year: number;
        thumbnail: string;
        thumbnailWidth?: number;
        thumbnailHeight?: number;
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
                <div className={styles.projectHeader}>
                    <div className={styles.headerText}>
                        <h1>{project.name}</h1>
                        <h2>{project.description}</h2>
                        <h2>[{project.year}]</h2>
                    </div>
                    {project.thumbnail && (
                        <div className={styles.headerThumbnail}>
                            {/\.(mp4|webm|ogg)$/i.test(project.thumbnail) ? (
                                <video
                                    src={project.thumbnail}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className={styles.headerMedia}
                                />
                            ) : (
                                <Image
                                    src={project.thumbnail}
                                    alt={`${project.name} thumbnail`}
                                    width={project.thumbnailWidth || 600}
                                    height={project.thumbnailHeight || 600}
                                    className={styles.headerMedia}
                                />
                            )}
                        </div>
                    )}
                </div>

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
                                                    <Image
                                                        src={section.src || ""}
                                                        alt={section.alt ?? ""}
                                                        width={1200}
                                                        height={800}
                                                        className={styles.image}
                                                        style={section.style ? Object.fromEntries(section.style.split(";").filter(Boolean).map(s => { const [k, v] = s.split(":").map(x => x.trim()); return [k, v]; })) : undefined}
                                                    />
                                                </div>
                                            );
                                        case "video":
                                            return (
                                                <div key={idx} className={`${styles[section.size]} ${styles.videoSection}`}>
                                                    <ResponsiveVideo src={section.src || ""} />
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
