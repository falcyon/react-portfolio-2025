// TODO: undestand generate metadata, make changes if needed. 


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


interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({ params }: ProjectPageProps) {
    const { slug } = await params;

    const project = projectsArray.find((proj) => proj.slug === slug);

    if (!project) return notFound();

    // Dynamically import the project content based on the slug
    const content = await importProjectContent(slug);
    if (!content) return notFound();

    const projectWithContent = {
        ...project,
        ...content,
    };

    return <ProjectPage project={projectWithContent} />;
}

// ✅ Generate Static Params for all the projects
export async function generateStaticParams() {
    return projectsArray.map((project) => ({
        slug: project.slug,
    }));
}

// ✅ Generate Dynamic Metadata for SEO optimization
export async function generateMetadata({ params }: ProjectPageProps) {
    const { slug } = await params;

    const project = projectsArray.find((proj) => proj.slug === slug);
    if (!project) return {}; // Return empty metadata if project not found

    return {
        title: project.name, // Set dynamic title for the page
        description: project.description || "Project description not available", // Set a fallback description if content is missing
        openGraph: {
            title: project.name,
            description: project.description || "Project description not available",
            images: [
                {
                    url: `${project.thumbnail}`, // Ensure your images are in the /public folder
                    width: 1200,
                    height: 630,
                    alt: project.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image", // Twitter card type
            title: project.name,
            description: project.description || "Project description not available",
            images: [`${project.thumbnail}`], // Same as Open Graph image URL
        },
    };
}
