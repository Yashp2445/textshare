"use client";

import { useState } from "react";
import { generateSlug } from "@/lib/slug";

export default function CreateGroupPage() {
  const [createdCode, setCreatedCode] = useState("");

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/group/create", { method: "POST", body: JSON.stringify({}) });
      const data = await res.json();
      if (data.accessCode) {
        setCreatedCode(data.accessCode);
      }
    } catch {
      alert("Failed to create room.");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(createdCode);
    alert("Copied!");
  };

  if (createdCode) {
    return (
      <div className="center-wrapper">
        <div className="form-card">
          <h1>Group Created</h1>
          <p>Share this access code with your group. They will need it to join the live session.</p>
          <div className="code-display">{createdCode}</div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button className="btn btn-secondary" onClick={copyCode}>Copy Code</button>
            <a href={`/group/join?code=${createdCode}`} className="btn btn-primary">Join Now</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="center-wrapper">
      <div className="form-card">
        <h1>Private Group</h1>
        <p>Create a secure, isolated live session. Only people with the generated access code can join and see the content.</p>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleCreate}>
          Generate Access Code
        </button>
        <div style={{ marginTop: "1.5rem" }}>
          <a href="/group/join" style={{ fontSize: "0.85rem", color: "var(--text-dim)", textDecoration: "underline" }}>
            Already have a code? Join a group
          </a>
        </div>
      </div>
    </div>
  );
}
