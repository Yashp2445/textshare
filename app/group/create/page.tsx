"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Lock, Copy, Check, ArrowRight, QrCode } from "lucide-react";

export default function CreateGroupPage() {
  const [createdCode, setCreatedCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

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

  const directJoinUrl = `${origin}/group/join?code=${createdCode}`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(createdCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(directJoinUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  if (createdCode) {
    return (
      <div className="center-wrapper">
        <div className="form-card private-group-card">
          <div className="card-accent-badge">
            <Lock size={20} className="text-amber" />
          </div>
          <h1>Private Group Ready</h1>
          <p>Share this access code or QR code with your group. Scanning takes them directly to the join screen.</p>
          
          <div className="code-display-box">
            <span className="code-label">Access Code</span>
            <div className="code-value">{createdCode}</div>
          </div>

          {/* QR Code Scoped to this Private Group */}
          <div className="group-qr-wrapper">
            <div className="group-qr-box">
              <QRCodeSVG 
                value={directJoinUrl} 
                size={160} 
                bgColor="transparent" 
                fgColor="currentColor"
                level="M"
              />
            </div>
            <div className="group-qr-hint">
              <QrCode size={14} className="text-amber" />
              <span>Scan to open Join screen with code prefilled</span>
            </div>
          </div>

          <div className="group-action-row">
            <button className="btn btn-secondary btn-full" onClick={copyCode}>
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
              {copiedCode ? "Code Copied!" : "Copy Code"}
            </button>
            <button className="btn btn-secondary btn-full" onClick={copyLink}>
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              {copiedLink ? "Link Copied!" : "Copy Join Link"}
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <a href={`/group/join?code=${createdCode}`} className="btn btn-primary btn-full">
              <span>Enter Session Now</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="center-wrapper">
      <div className="form-card">
        <div className="card-accent-badge">
          <Lock size={20} className="text-amber" />
        </div>
        <h1>Create Private Group</h1>
        <p>Generate a password-protected, isolated live session. Only people with your generated code or QR code can join.</p>
        <button className="btn btn-primary btn-full" onClick={handleCreate}>
          Generate Access Code & QR
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
