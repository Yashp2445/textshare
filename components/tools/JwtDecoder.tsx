"use client";

import React, { useState } from "react";
import { KeyRound, Copy, Check, AlertTriangle, Info } from "lucide-react";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(
    Array.from(atob(base64))
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function renderSyntaxHighlightedJson(jsonStr: string) {
  const safe = jsonStr
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const highlighted = safe.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "syn-num";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "syn-key";
        } else {
          cls = "syn-str";
        }
      } else if (/true|false/.test(match)) {
        cls = "syn-bool";
      } else if (/null/.test(match)) {
        cls = "syn-null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );

  return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
}

export function JwtDecoder() {
  const [tokenInput, setTokenInput] = useState<string>(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIERvZSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  let headerObj: any = null;
  let payloadObj: any = null;
  let signatureRaw: string = "";
  let errorMsg: string | null = null;

  const trimmed = tokenInput.trim();
  if (trimmed) {
    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      errorMsg = "Invalid JWT structure. A JWT must consist of three dot-separated parts (Header.Payload.Signature).";
    } else {
      try {
        const headerStr = base64UrlDecode(parts[0]);
        headerObj = JSON.parse(headerStr);
      } catch (err) {
        errorMsg = "Invalid base64/JSON in JWT Header component.";
      }

      try {
        const payloadStr = base64UrlDecode(parts[1]);
        payloadObj = JSON.parse(payloadStr);
      } catch (err) {
        errorMsg = "Invalid base64/JSON in JWT Payload component.";
      }

      signatureRaw = parts[2];
    }
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const headerFormatted = headerObj ? JSON.stringify(headerObj, null, 2) : "";
  const payloadFormatted = payloadObj ? JSON.stringify(payloadObj, null, 2) : "";

  return (
    <div className="tool-card-glass">
      <div className="tool-header">
        <div className="tool-title-group">
          <h1 className="tool-title">
            <KeyRound size={22} className="text-violet" />
            JWT Decoder
          </h1>
          <p className="tool-subtitle">
            Instantly decode JSON Web Token headers, payloads, and signatures client-side.
          </p>
        </div>
      </div>

      {/* Input Field */}
      <div className="jwt-section-card">
        <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          Encoded JWT Token Input
        </label>
        <textarea
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste JWT string (eyJhbGci...)"
          className="code-panel-textarea"
          style={{ minHeight: "110px", fontSize: "0.85rem" }}
          spellCheck={false}
        />
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="status-banner error">
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Decoded Sections */}
      {!errorMsg && trimmed && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Header */}
          <div className="jwt-section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="jwt-header-badge">HEADER: ALGORITHM & TOKEN TYPE</span>
              <button
                type="button"
                onClick={() => copyToClipboard(headerFormatted, "header")}
                className="btn btn-secondary btn-sm"
              >
                {copiedKey === "header" ? <Check size={14} /> : <Copy size={14} />}
                {copiedKey === "header" ? "Copied" : "Copy Header"}
              </button>
            </div>
            <div className="code-panel-box" style={{ marginTop: "0.5rem" }}>
              <div className="code-panel-display" style={{ minHeight: "auto", maxHeight: "240px" }}>
                {renderSyntaxHighlightedJson(headerFormatted)}
              </div>
            </div>
          </div>

          {/* Payload */}
          <div className="jwt-section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="jwt-payload-badge">PAYLOAD: DATA CLAIMS</span>
              <button
                type="button"
                onClick={() => copyToClipboard(payloadFormatted, "payload")}
                className="btn btn-secondary btn-sm"
              >
                {copiedKey === "payload" ? <Check size={14} /> : <Copy size={14} />}
                {copiedKey === "payload" ? "Copied" : "Copy Payload"}
              </button>
            </div>
            <div className="code-panel-box" style={{ marginTop: "0.5rem" }}>
              <div className="code-panel-display" style={{ minHeight: "auto", maxHeight: "320px" }}>
                {renderSyntaxHighlightedJson(payloadFormatted)}
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="jwt-section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="jwt-signature-badge">SIGNATURE (Shown As-Is)</span>
              <button
                type="button"
                onClick={() => copyToClipboard(signatureRaw, "signature")}
                className="btn btn-secondary btn-sm"
              >
                {copiedKey === "signature" ? <Check size={14} /> : <Copy size={14} />}
                {copiedKey === "signature" ? "Copied" : "Copy Signature"}
              </button>
            </div>
            <div 
              className="code-panel-box" 
              style={{ padding: "0.75rem 1rem", marginTop: "0.5rem", wordBreak: "break-all" }}
            >
              {signatureRaw}
            </div>

            {/* Disclaimer */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
              <Info size={14} />
              <span>
                Signature is displayed for inspection only and is <strong>not cryptographically verified</strong> against a secret.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
