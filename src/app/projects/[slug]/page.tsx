// TODO: undestand generate metadata, make changes if needed. 


import { notFound } from "next/navigation";
import { projectsArray } from "@/data/projects";
import ProjectPage from "@/components/ProjectPage";

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({ params }: ProjectPageProps) {
    const { slug } = await params; // Ensure params is awaited

    const project = projectsArray.find((proj) => proj.slug === slug);

    if (!project) return notFound(); // Show 404 if project isn't found

    return <ProjectPage project={project} />;
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
