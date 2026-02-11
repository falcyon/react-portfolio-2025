"use client";

import { useState, useEffect } from "react";
import SectionEditor from "./SectionEditor";
import MediaUploader from "./MediaUploader";

interface Section {
  type: "text" | "image" | "video";
  size: string;
  text?: string[];
  src?: string;
  alt?: string;
  style?: string;
}

interface SectionGroup {
  sections: Section[];
}

interface ProjectFormData {
  name: string;
  slug: string;
  year: number;
  tags: string[];
  description: string;
  thumbnail: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  size: string;
  position?: number;
  content: SectionGroup[];
}

interface ProjectFormProps {
  /** Slug of existing project to edit, or null for new project */
  editSlug: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

const EMPTY_PROJECT: ProjectFormData = {
  name: "",
  slug: "",
  year: new Date().getFullYear(),
  tags: [],
  description: "",
  thumbnail: "",
  thumbnailWidth: 1080,
  thumbnailHeight: 1080,
  size: "q",
  content: [],
};

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProjectForm({
  editSlug,
  onSaved,
  onCancel,
}: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>(EMPTY_PROJECT);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing project for editing
  useEffect(() => {
    if (!editSlug) {
      setForm(EMPTY_PROJECT);
      setSlugManuallyEdited(false);
      return;
    }

    setLoading(true);
    fetch(`/api/admin/projects/${editSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          year: data.year || new Date().getFullYear(),
          tags: data.tags || [],
          description: data.description || "",
          thumbnail: data.thumbnail || "",
          thumbnailWidth: data.thumbnailWidth || 1080,
          thumbnailHeight: data.thumbnailHeight || 1080,
          size: data.size || "q",
          position: data.position,
          content: data.content || [],
        });
        setSlugManuallyEdited(true); // Don't auto-generate slug for existing projects
      })
      .finally(() => setLoading(false));
  }, [editSlug]);

  // Auto-generate slug from name (unless manually edited)
  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      ...(slugManuallyEdited ? {} : { slug: nameToSlug(name) }),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({ ...prev, slug }));
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editSlug
        ? `/api/admin/projects/${editSlug}`
        : "/api/admin/projects";
      const method = editSlug ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          err.error ||
            (err.details
              ? `Validation: ${JSON.stringify(err.details)}`
              : "Save failed")
        );
      }

      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ color: "#888" }}>Loading project...</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ margin: 0, color: "#eee" }}>
        {editSlug ? `Edit: ${form.name}` : "New Project"}
      </h2>

      {/* Name */}
      <label style={labelStyle}>
        Name
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          style={inputStyle}
        />
      </label>

      {/* Slug */}
      <label style={labelStyle}>
        Slug
        <input
          type="text"
          value={form.slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          required
          style={inputStyle}
          placeholder="auto-generated-from-name"
        />
        {!slugManuallyEdited && form.slug && (
          <span style={{ fontSize: "0.75rem", color: "#666" }}>
            Auto-generated from name
          </span>
        )}
      </label>

      {/* Year + Size + Position */}
      <div style={rowStyle}>
        <label style={{ ...labelStyle, flex: 1 }}>
          Year
          <input
            type="number"
            value={form.year}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, year: parseInt(e.target.value) || 0 }))
            }
            required
            style={inputStyle}
          />
        </label>
        <label style={{ ...labelStyle, flex: 1 }}>
          Grid Size
          <select
            value={form.size}
            onChange={(e) => setForm((prev) => ({ ...prev, size: e.target.value }))}
            style={inputStyle}
          >
            <option value="s">Small</option>
            <option value="q">Square</option>
            <option value="t">Tall</option>
            <option value="h">Horizontal</option>
            <option value="1">Wide</option>
            <option value="f">Full</option>
          </select>
        </label>
        <label style={{ ...labelStyle, flex: 1 }}>
          Position
          <input
            type="number"
            value={form.position ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                position: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
            min={1}
            max={6}
            style={inputStyle}
            placeholder="Optional"
          />
        </label>
      </div>

      {/* Description */}
      <label style={labelStyle}>
        Description
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          required
          rows={2}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>

      {/* Tags */}
      <label style={labelStyle}>
        Tags
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {form.tags.map((tag) => (
            <span key={tag} style={tagStyle}>
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                style={tagRemoveStyle}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            placeholder="Type a tag and press Enter"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={() => addTag(tagInput)}
            style={smallActionBtnStyle}
          >
            Add
          </button>
        </div>
      </label>

      {/* Thumbnail */}
      <label style={labelStyle}>
        Thumbnail
        {form.thumbnail && (
          <span style={{ fontSize: "0.85rem", color: "#888" }}>
            Current: {form.thumbnail}
          </span>
        )}
        <MediaUploader
          slug={form.slug || "new-project"}
          subfolder="thumbnails"
          onUpload={(result) =>
            setForm((prev) => ({ ...prev, thumbnail: result.path }))
          }
          label="Upload thumbnail"
        />
        <input
          type="text"
          value={form.thumbnail}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, thumbnail: e.target.value }))
          }
          placeholder="Or enter path manually"
          style={inputStyle}
        />
        <div style={rowStyle}>
          <label style={{ ...labelStyle, flex: 1 }}>
            Width
            <input
              type="number"
              value={form.thumbnailWidth}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  thumbnailWidth: parseInt(e.target.value) || 0,
                }))
              }
              style={inputStyle}
            />
          </label>
          <label style={{ ...labelStyle, flex: 1 }}>
            Height
            <input
              type="number"
              value={form.thumbnailHeight}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  thumbnailHeight: parseInt(e.target.value) || 0,
                }))
              }
              style={inputStyle}
            />
          </label>
        </div>
      </label>

      {/* Content Sections */}
      <SectionEditor
        content={form.content}
        onChange={(content) => setForm((prev) => ({ ...prev, content }))}
        slug={form.slug || "new-project"}
      />

      {/* Actions */}
      {error && <p style={{ color: "#e55", margin: 0 }}>{error}</p>}
      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit" disabled={saving} style={submitBtnStyle}>
          {saving ? "Saving..." : editSlug ? "Update Project" : "Create Project"}
        </button>
        <button type="button" onClick={onCancel} style={cancelBtnStyle}>
          Cancel
        </button>
      </div>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxWidth: "900px",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "0.9rem",
  color: "#aaa",
};

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  background: "#111",
  color: "#eee",
  border: "1px solid #333",
  borderRadius: "4px",
  fontSize: "0.95rem",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
};

const tagStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 10px",
  background: "#222",
  border: "1px solid #444",
  borderRadius: "20px",
  fontSize: "0.85rem",
  color: "#eee",
};

const tagRemoveStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#888",
  cursor: "pointer",
  padding: "0 2px",
  fontSize: "0.75rem",
};

const smallActionBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  background: "#222",
  border: "1px solid #444",
  borderRadius: "4px",
  color: "#eee",
  cursor: "pointer",
  fontSize: "0.85rem",
};

const submitBtnStyle: React.CSSProperties = {
  padding: "10px 24px",
  background: "#1a5c2a",
  border: "1px solid #2a8c3a",
  borderRadius: "4px",
  color: "#eee",
  cursor: "pointer",
  fontSize: "1rem",
};

const cancelBtnStyle: React.CSSProperties = {
  padding: "10px 24px",
  background: "#333",
  border: "1px solid #555",
  borderRadius: "4px",
  color: "#aaa",
  cursor: "pointer",
  fontSize: "1rem",
};
