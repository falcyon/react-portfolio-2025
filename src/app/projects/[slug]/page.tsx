import { notFound } from "next/navigation";
import { projectsArray } from "@/data/projects";
import ProjectPage from "@/components/ProjectPage";
// import type { PageProps as NextPageProps } from 'next/app';

const importProjectContent = async (slug: string) => {
    try {
        const content = await import(`@/projects/${slug}.json`);
        return content.default;
    } catch (error) {
        console.error("Error loading project content:", error);
        return null;
    }
};

export default async function Page({
    params,
}: {
    params: { slug: string };
}) {
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

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;

    const project = projectsArray.find((proj) => proj.slug === slug);
    if (!project) return {};

    return {
        title: project.name,
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


export async function generateStaticParams() {
    return projectsArray.map((project) => ({
        slug: project.slug,
    }));
}
