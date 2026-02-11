"use client";

import { useState, useEffect } from "react";
import ProjectForm from "@/components/admin/ProjectForm";

interface ProjectSummary {
  name: string;
  slug: string;
  year: number;
  tags: string[];
  description: string;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (slug: string) => {
    setEditSlug(slug);
    setView("form");
  };

  const handleNew = () => {
    setEditSlug(null);
    setView("form");
  };

  const handleSaved = () => {
    setView("list");
    setEditSlug(null);
    loadProjects();
  };

  const handleCancel = () => {
    setView("list");
    setEditSlug(null);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;

    await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
    loadProjects();
  };

  if (view === "form") {
    return (
      <div style={pageStyle}>
        <ProjectForm
          editSlug={editSlug}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#eee" }}>
          Projects
        </h1>
        <button onClick={handleNew} style={newBtnStyle}>
          + New Project
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading...</p>
      ) : (
        <div style={listStyle}>
          {projects.map((project) => (
            <div key={project.slug} style={itemStyle}>
              <div style={{ flex: 1 }}>
                <div style={itemNameStyle}>{project.name}</div>
                <div style={itemMetaStyle}>
                  {project.year} &middot; {project.tags.join(", ")}
                </div>
                <div style={itemDescStyle}>{project.description}</div>
              </div>
              <div style={itemActionsStyle}>
                <button
                  onClick={() => handleEdit(project.slug)}
                  style={editBtnStyle}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.slug)}
                  style={deleteBtnStyle}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  padding: "30px",
  maxWidth: "1000px",
  margin: "0 auto",
  fontFamily: "system-ui, sans-serif",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const newBtnStyle: React.CSSProperties = {
  padding: "8px 18px",
  background: "#1a5c2a",
  border: "1px solid #2a8c3a",
  borderRadius: "4px",
  color: "#eee",
  cursor: "pointer",
  fontSize: "0.95rem",
};

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "14px 16px",
  background: "#111",
  border: "1px solid #222",
  borderRadius: "6px",
};

const itemNameStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#eee",
};

const itemMetaStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#888",
  marginTop: "2px",
};

const itemDescStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#666",
  marginTop: "4px",
};

const itemActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: "6px",
  flexShrink: 0,
};

const editBtnStyle: React.CSSProperties = {
  padding: "6px 14px",
  background: "#222",
  border: "1px solid #444",
  borderRadius: "3px",
  color: "#eee",
  cursor: "pointer",
  fontSize: "0.85rem",
};

const deleteBtnStyle: React.CSSProperties = {
  padding: "6px 14px",
  background: "#2a1515",
  border: "1px solid #5c2a2a",
  borderRadius: "3px",
  color: "#e88",
  cursor: "pointer",
  fontSize: "0.85rem",
};
