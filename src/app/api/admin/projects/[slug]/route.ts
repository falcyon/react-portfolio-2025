import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { projectSchema } from "@/lib/projectSchema";

const projectsDir = path.join(process.cwd(), "src", "projects");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filePath = path.join(projectsDir, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filePath = path.join(projectsDir, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const body = await request.json();
  const result = projectSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // If slug changed, rename the file
  if (result.data.slug !== slug) {
    const newPath = path.join(projectsDir, `${result.data.slug}.json`);
    if (fs.existsSync(newPath)) {
      return NextResponse.json(
        { error: "A project with the new slug already exists" },
        { status: 409 }
      );
    }
    fs.unlinkSync(filePath);
    fs.writeFileSync(newPath, JSON.stringify(result.data, null, 2) + "\n");
  } else {
    fs.writeFileSync(filePath, JSON.stringify(result.data, null, 2) + "\n");
  }

  await regenerateProjectsArray();

  return NextResponse.json({ success: true, slug: result.data.slug });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filePath = path.join(projectsDir, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  await regenerateProjectsArray();

  return NextResponse.json({ success: true });
}

async function regenerateProjectsArray() {
  const { execSync } = await import("child_process");
  execSync("node scripts/generate-projects-array.mjs", {
    cwd: process.cwd(),
  });
}
