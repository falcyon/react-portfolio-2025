"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={toolbarStyle}>
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="B"
          fontWeight="bold"
        />
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="I"
          fontStyle="italic"
        />
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="U"
          textDecoration="underline"
        />
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={toggleLink}
          label="Link"
        />
      </div>
      <EditorContent editor={editor} style={editorStyle} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  fontWeight,
  fontStyle,
  textDecoration,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...toolbarBtnStyle,
        background: active ? "#555" : "#222",
        fontWeight,
        fontStyle,
        textDecoration,
      }}
    >
      {label}
    </button>
  );
}

const wrapperStyle: React.CSSProperties = {
  border: "1px solid #333",
  borderRadius: "4px",
  overflow: "hidden",
};

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  gap: "2px",
  padding: "4px",
  background: "#1a1a1a",
  borderBottom: "1px solid #333",
};

const toolbarBtnStyle: React.CSSProperties = {
  padding: "4px 10px",
  border: "1px solid #444",
  borderRadius: "3px",
  color: "#eee",
  cursor: "pointer",
  fontSize: "0.85rem",
};

const editorStyle: React.CSSProperties = {
  padding: "10px 12px",
  minHeight: "80px",
  background: "#111",
  color: "#eee",
  fontSize: "0.95rem",
  lineHeight: 1.5,
};
