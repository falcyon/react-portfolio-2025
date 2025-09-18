import { notFound } from "next/navigation";
import { projectsArray } from "@/data/projects";
import ProjectPage from "@/components/ProjectPage";

const importProjectContent = async (slug: string) => {
    try {
        const content = await import(`@/projects/${slug}.json`);
        return content.default; // JSON will be exported as default in Next.js
    } catch (error) {
        console.error("Error loading project content:", error);
        return null;
    }
};

interface PageProps {
    params: { slug: string };
}

// --------------------------
// Generate Dynamic Metadata
// --------------------------
export async function generateMetadata({ params }: PageProps) {
    const { slug } = params;

    const project = projectsArray.find((proj) => proj.slug === slug);
    if (!project) return {}; // Return empty metadata if project not found

    return {
        title: project.name, // Dynamic page title
        description: project.description || "Project description not available",
        openGraph: {
            title: project.name,
            description: project.description || "Project description not available",
            images: project.thumbnail
                ? [
                    {
                        url: project.thumbnail,
                        width: 1200,
                        height: 630,
                        alt: project.name,
                    },
                ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: project.name,
            description: project.description || "Project description not available",
            images: project.thumbnail ? [project.thumbnail] : [],
        },
    };
}

// --------------------------
// Main Page Component
// --------------------------
export default async function Page({ params }: PageProps) {
    const { slug } = params;

    const project = projectsArray.find((proj) => proj.slug === slug);
    if (!project) return notFound();

    const content = await importProjectContent(slug);
    if (!content) return notFound();

    const projectWithContent = {
        ...project,
        ...content,
    };

    return <ProjectPage project={projectWithContent} />;
}

// --------------------------
// Generate Static Params
// --------------------------
export async function generateStaticParams() {
    return projectsArray.map((project) => ({
        slug: project.slug,
    }));
}
