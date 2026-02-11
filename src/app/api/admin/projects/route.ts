import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { projectSchema } from "@/lib/projectSchema";

const projectsDir = path.join(process.cwd(), "src", "projects");

export async function GET() {
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".json"));
  const projects = files.map((file) => {
    const raw = JSON.parse(
      fs.readFileSync(path.join(projectsDir, file), "utf-8")
    );
    return {
      name: raw.name,
      slug: raw.slug,
      year: raw.year,
      tags: raw.tags,
      description: raw.description,
    };
  });

  // Sort by year descending, then name
  projects.sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = projectSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const filePath = path.join(projectsDir, `${result.data.slug}.json`);

  if (fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Project with this slug already exists" },
      { status: 409 }
    );
  }

  fs.writeFileSync(filePath, JSON.stringify(result.data, null, 2) + "\n");

  // Regenerate the static projects array
  await regenerateProjectsArray();

  return NextResponse.json({ success: true, slug: result.data.slug }, { status: 201 });
}

async function regenerateProjectsArray() {
  const { execSync } = await import("child_process");
  execSync("node scripts/generate-projects-array.mjs", {
    cwd: process.cwd(),
  });
}
