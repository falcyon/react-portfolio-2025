import { notFound } from "next/navigation";
import { projectsArray } from "@/data/projects";
import aboutData from "@/content/about.json";
import ProjectPage from "@/components/ProjectPage";
import type { Metadata } from "next";

const importProjectContent = async (slug: string) => {
    try {
        const content = await import(`@/content/projects/${slug}.json`);
        return content.default; // JSON will be exported as default in Next.js
    } catch (error) {
        console.error("Error loading project content:", error);
        return null;
    }
};

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

// ✅ Generate metadata dynamically per project
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    const project = projectsArray.find((proj) => proj.slug === slug);
    if (!project) return { title: "Project Not Found" };

    const content = await importProjectContent(slug);
    if (!content) return { title: "Project Not Found" };

    const projectWithContent = {
        ...project,
        ...content,
    };

    return {
        title: projectWithContent.name,
        description: projectWithContent.description,
    };
}

export default async function Page({ params }: ProjectPageProps) {
    const { slug } = await params;

    const project = projectsArray.find((proj) => proj.slug === slug);
    if (!project) return notFound();

    const content = await importProjectContent(slug);
    if (!content) return notFound();

    const projectWithContent = {
        ...project,
        ...content,
    };

    const exhibitions = aboutData.exhibitions.filter((e) => e.slug === slug);

    return <ProjectPage project={projectWithContent} exhibitions={exhibitions} />;
}

// ✅ Generate Static Params for all the projects
export async function generateStaticParams() {
    return projectsArray.map((project) => ({
        slug: project.slug,
    }));
}
