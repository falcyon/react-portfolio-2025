"use client";

import { useState, useRef } from "react";

interface MediaUploaderProps {
  slug: string;
  subfolder?: string;
  onUpload: (result: UploadResult) => void;
  accept?: string;
  label?: string;
}

export interface UploadResult {
  path: string;
  type: "image" | "video";
  variants?: { quality: string; path: string; width: number; height: number }[];
  processingError?: string;
}

export default function MediaUploader({
  slug,
  subfolder,
  onUpload,
  accept = "image/*,video/*",
  label = "Upload file",
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    setUploading(true);
    setProgress("Uploading...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", slug);
    if (subfolder) formData.append("subfolder", subfolder);

    try {
      const isVideo = file.type.startsWith("video/");
      if (isVideo) {
        setProgress("Uploading & processing video (this may take a while)...");
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const result: UploadResult = await res.json();
      setProgress(
        result.processingError
          ? `Uploaded (processing warning: ${result.processingError})`
          : "Uploaded!"
      );
      onUpload(result);
    } catch (err) {
      setProgress(`Error: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={wrapperStyle}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        style={{ display: "none" }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={buttonStyle}
      >
        {uploading ? "Processing..." : label}
      </button>
      {progress && (
        <span style={{ fontSize: "0.8rem", color: "#aaa" }}>{progress}</span>
      )}
      {preview && (
        <div style={previewStyle}>
          {preview.includes("video") ? (
            <video src={preview} style={previewMediaStyle} muted autoPlay loop />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" style={previewMediaStyle} />
          )}
        </div>
      )}
    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  border: "1px dashed #555",
  borderRadius: "4px",
  background: "#1a1a1a",
  color: "#aaa",
  cursor: "pointer",
  fontSize: "0.9rem",
};

const previewStyle: React.CSSProperties = {
  maxWidth: "200px",
  maxHeight: "150px",
  overflow: "hidden",
  borderRadius: "4px",
  border: "1px solid #333",
};

const previewMediaStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
