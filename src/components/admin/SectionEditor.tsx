"use client";

import { useState } from "react";
import RichTextEditor from "./RichTextEditor";
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

interface SectionEditorProps {
  content: SectionGroup[];
  onChange: (content: SectionGroup[]) => void;
  slug: string;
}

const SIZE_OPTIONS = [
  { value: "f", label: "Full (100%)" },
  { value: "h", label: "Half (50%)" },
  { value: "t", label: "Third (33%)" },
  { value: "t2", label: "Two-thirds (66%)" },
  { value: "q", label: "Quarter (25%)" },
];

export default function SectionEditor({
  content,
  onChange,
  slug,
}: SectionEditorProps) {
  const updateGroup = (groupIdx: number, group: SectionGroup) => {
    const updated = [...content];
    updated[groupIdx] = group;
    onChange(updated);
  };

  const addGroup = () => {
    onChange([
      ...content,
      { sections: [{ type: "text", size: "h", text: [""] }] },
    ]);
  };

  const removeGroup = (groupIdx: number) => {
    onChange(content.filter((_, i) => i !== groupIdx));
  };

  const moveGroup = (groupIdx: number, direction: -1 | 1) => {
    const newIdx = groupIdx + direction;
    if (newIdx < 0 || newIdx >= content.length) return;
    const updated = [...content];
    [updated[groupIdx], updated[newIdx]] = [updated[newIdx], updated[groupIdx]];
    onChange(updated);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h3 style={sectionHeading}>Content Sections</h3>

      {content.map((group, groupIdx) => (
        <div key={groupIdx} style={groupStyle}>
          <div style={groupHeaderStyle}>
            <span style={{ fontSize: "0.85rem", color: "#888" }}>
              Row {groupIdx + 1}
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              <SmallButton
                onClick={() => moveGroup(groupIdx, -1)}
                disabled={groupIdx === 0}
                label="↑"
              />
              <SmallButton
                onClick={() => moveGroup(groupIdx, 1)}
                disabled={groupIdx === content.length - 1}
                label="↓"
              />
              <SmallButton
                onClick={() => removeGroup(groupIdx)}
                label="✕"
                danger
              />
            </div>
          </div>

          <SectionGroupEditor
            group={group}
            onChange={(g) => updateGroup(groupIdx, g)}
            slug={slug}
          />
        </div>
      ))}

      <button type="button" onClick={addGroup} style={addButtonStyle}>
        + Add Row
      </button>
    </div>
  );
}

function SectionGroupEditor({
  group,
  onChange,
  slug,
}: {
  group: SectionGroup;
  onChange: (group: SectionGroup) => void;
  slug: string;
}) {
  const updateSection = (idx: number, section: Section) => {
    const updated = [...group.sections];
    updated[idx] = section;
    onChange({ sections: updated });
  };

  const addSection = () => {
    onChange({
      sections: [
        ...group.sections,
        { type: "text", size: "h", text: [""] },
      ],
    });
  };

  const removeSection = (idx: number) => {
    onChange({ sections: group.sections.filter((_, i) => i !== idx) });
  };

  const moveSection = (idx: number, direction: -1 | 1) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= group.sections.length) return;
    const updated = [...group.sections];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    onChange({ sections: updated });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {group.sections.map((section, idx) => (
        <SectionItemEditor
          key={idx}
          section={section}
          onChange={(s) => updateSection(idx, s)}
          onRemove={() => removeSection(idx)}
          onMove={(dir) => moveSection(idx, dir)}
          isFirst={idx === 0}
          isLast={idx === group.sections.length - 1}
          slug={slug}
        />
      ))}
      <button type="button" onClick={addSection} style={addSectionBtnStyle}>
        + Add Section to Row
      </button>
    </div>
  );
}

function SectionItemEditor({
  section,
  onChange,
  onRemove,
  onMove,
  isFirst,
  isLast,
  slug,
}: {
  section: Section;
  onChange: (section: Section) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  isFirst: boolean;
  isLast: boolean;
  slug: string;
}) {
  // Convert text array to HTML for editor, and back
  const textToHtml = (text?: string[]) =>
    (text || []).map((p) => `<p>${p}</p>`).join("");

  const htmlToText = (html: string): string[] => {
    // Strip tags, split by paragraph boundaries
    return html
      .split(/<\/?p[^>]*>/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  return (
    <div style={sectionItemStyle}>
      <div style={sectionItemHeaderStyle}>
        <select
          value={section.type}
          onChange={(e) =>
            onChange({
              ...section,
              type: e.target.value as Section["type"],
              ...(e.target.value === "text" ? { text: [""], src: undefined } : {}),
              ...(e.target.value !== "text" ? { src: section.src || "", text: undefined } : {}),
            })
          }
          style={selectStyle}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>

        <select
          value={section.size}
          onChange={(e) => onChange({ ...section, size: e.target.value })}
          style={selectStyle}
        >
          {SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
          <SmallButton onClick={() => onMove(-1)} disabled={isFirst} label="←" />
          <SmallButton onClick={() => onMove(1)} disabled={isLast} label="→" />
          <SmallButton onClick={onRemove} label="✕" danger />
        </div>
      </div>

      {section.type === "text" && (
        <RichTextEditor
          content={textToHtml(section.text)}
          onChange={(html) => onChange({ ...section, text: htmlToText(html) })}
        />
      )}

      {(section.type === "image" || section.type === "video") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {section.src && (
            <div style={{ fontSize: "0.85rem", color: "#888" }}>
              Current: {section.src}
            </div>
          )}
          <MediaUploader
            slug={slug}
            onUpload={(result) => onChange({ ...section, src: result.path })}
            accept={section.type === "image" ? "image/*" : "video/*"}
            label={`Upload ${section.type}`}
          />
          <input
            type="text"
            value={section.alt || ""}
            onChange={(e) => onChange({ ...section, alt: e.target.value })}
            placeholder="Alt text"
            style={inputStyle}
          />
          {section.src && (
            <input
              type="text"
              value={section.src}
              onChange={(e) => onChange({ ...section, src: e.target.value })}
              placeholder="Or enter path manually"
              style={inputStyle}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SmallButton({
  onClick,
  label,
  disabled,
  danger,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...smallBtnStyle,
        opacity: disabled ? 0.3 : 1,
        color: danger ? "#e55" : "#aaa",
      }}
    >
      {label}
    </button>
  );
}

const sectionHeading: React.CSSProperties = {
  margin: 0,
  fontSize: "1.1rem",
  color: "#ccc",
};

const groupStyle: React.CSSProperties = {
  border: "1px solid #333",
  borderRadius: "6px",
  padding: "12px",
  background: "#0d0d0d",
};

const groupHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const sectionItemStyle: React.CSSProperties = {
  border: "1px solid #222",
  borderRadius: "4px",
  padding: "10px",
  background: "#151515",
};

const sectionItemHeaderStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  marginBottom: "10px",
};

const selectStyle: React.CSSProperties = {
  padding: "6px 8px",
  background: "#111",
  color: "#eee",
  border: "1px solid #333",
  borderRadius: "3px",
  fontSize: "0.85rem",
};

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  background: "#111",
  color: "#eee",
  border: "1px solid #333",
  borderRadius: "3px",
  fontSize: "0.9rem",
};

const smallBtnStyle: React.CSSProperties = {
  padding: "2px 8px",
  background: "#222",
  border: "1px solid #444",
  borderRadius: "3px",
  cursor: "pointer",
  fontSize: "0.85rem",
};

const addButtonStyle: React.CSSProperties = {
  padding: "10px",
  border: "2px dashed #444",
  borderRadius: "6px",
  background: "transparent",
  color: "#888",
  cursor: "pointer",
  fontSize: "0.95rem",
};

const addSectionBtnStyle: React.CSSProperties = {
  padding: "6px",
  border: "1px dashed #333",
  borderRadius: "4px",
  background: "transparent",
  color: "#666",
  cursor: "pointer",
  fontSize: "0.85rem",
};
