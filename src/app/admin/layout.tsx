"use client";

import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_auth");
    if (stored === "true") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem("admin_auth", "true");
      setAuthenticated(true);
    } else {
      setError("Incorrect password");
    }
  };

  if (checking) {
    return (
      <div style={containerStyle}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div style={containerStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            style={inputStyle}
          />
          {error && <p style={{ color: "#e55", margin: 0 }}>{error}</p>}
          <button type="submit" style={buttonStyle}>
            Enter
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  fontFamily: "system-ui, sans-serif",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "300px",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "1rem",
  border: "1px solid #333",
  borderRadius: "4px",
  background: "#111",
  color: "#eee",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "1rem",
  border: "1px solid #555",
  borderRadius: "4px",
  background: "#222",
  color: "#eee",
  cursor: "pointer",
};
