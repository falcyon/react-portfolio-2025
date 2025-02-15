import { notFound } from "next/navigation";
import { projectsArray } from "@/data/projects";
import ProjectPage from "@/components/ProjectPage";

interface ProjectPageProps {
    params: { slug: string };
}

// ✅ Server Component (for static pre-rendering)
export default function Page({ params }: ProjectPageProps) {
    const project = projectsArray.find((proj) => proj.slug === params.slug);

    if (!project) return notFound(); // Show 404 if project isn't found

    return <ProjectPage project={project} />;
}

// ✅ Generate Static Paths (SSG)
export async function generateStaticParams() {
    return projectsArray.map((project) => ({ slug: project.slug }));
}
