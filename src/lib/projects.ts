import fs from "fs";
import path from "path";
import { projectSchema, type ProjectData, type ProjectMeta } from "./projectSchema";

const projectsDir = path.join(process.cwd(), "src", "projects");

/**
 * Read and validate all project JSON files from src/projects/.
 * Returns the full project data including content.
 */
export function loadAllProjects(): ProjectData[] {
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".json"));
  const projects: ProjectData[] = [];

  for (const file of files) {
    const filePath = path.join(projectsDir, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const result = projectSchema.safeParse(raw);

    if (!result.success) {
      console.error(
        `Validation error in ${file}:`,
        result.error.flatten().fieldErrors
      );
      throw new Error(`Invalid project data in ${file}`);
    }

    projects.push(result.data);
  }

  return projects;
}

/**
 * Get the project metadata array (without content) for listings.
 * Sorted by position within each size group, matching the original projectsArray order.
 */
export function getProjectsArray(): ProjectMeta[] {
  return loadAllProjects().map(({ content, ...meta }) => meta);
}

/**
 * Load a single project by slug, including full content.
 */
export function loadProjectBySlug(slug: string): ProjectData | null {
  const filePath = path.join(projectsDir, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const result = projectSchema.safeParse(raw);

  if (!result.success) {
    console.error(
      `Validation error in ${slug}.json:`,
      result.error.flatten().fieldErrors
    );
    return null;
  }

  return result.data;
}
