"use client";

import React, { useState } from "react";
import { Binary, Copy, Check, ArrowRightLeft, AlertTriangle } from "lucide-react";

export function Base64UrlTool() {
  const [mode, setMode] = useState<"base64" | "url">("base64");
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState<string>("Hello, LiveShare Liquid Glass!");
  const [copied, setCopied] = useState(false);

  let output = "";
  let errorMsg: string | null = null;

  try {
    if (input) {
      if (mode === "base64") {
        if (direction === "encode") {
          output = btoa(
            encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
              String.fromCharCode(parseInt(p1, 16))
            )
          );
        } else {
          // Decode
          const binaryStr = atob(input.trim());
          output = decodeURIComponent(
            Array.from(binaryStr)
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
        }
      } else {
        // URL Mode
        if (direction === "encode") {
          output = encodeURIComponent(input);
        } else {
          output = decodeURIComponent(input);
        }
      }
    }
  } catch (err: any) {
    errorMsg = mode === "base64"
      ? "Invalid Base64 string during decoding."
      : "Malformed URL encoded sequence.";
  }

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwap = () => {
    if (output && !errorMsg) {
      setInput(output);
      setDirection((prev) => (prev === "encode" ? "decode" : "encode"));
    }
  };

  return (
    <div className="tool-card-glass">
      <div className="tool-header">
        <div className="tool-title-group">
          <h1 className="tool-title">
            <Binary size={22} className="text-violet" />
            Base64 & URL Encoder / Decoder
          </h1>
          <p className="tool-subtitle">
            Encode and decode plain text or data strings to/from Base64 or URL component format in real time.
          </p>
        </div>

        <div className="tool-action-group">
          <button
            type="button"
            onClick={handleSwap}
            disabled={!output || !!errorMsg}
            className="btn btn-secondary btn-sm"
          >
            <ArrowRightLeft size={14} />
            Swap Input/Output
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!output || !!errorMsg}
            className="btn btn-primary btn-sm"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy Output"}
          </button>
        </div>
      </div>

      {/* Mode & Direction Controls */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* Mode Selector */}
        <div className="header-segmented-nav">
          <button
            type="button"
            onClick={() => setMode("base64")}
            className={`nav-segment-item ${mode === "base64" ? "active" : ""}`}
          >
            Base64
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`nav-segment-item ${mode === "url" ? "active" : ""}`}
          >
            URL Encoding
          </button>
        </div>

        {/* Direction Selector */}
        <div className="header-segmented-nav">
          <button
            type="button"
            onClick={() => setDirection("encode")}
            className={`nav-segment-item ${direction === "encode" ? "active" : ""}`}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => setDirection("decode")}
            className={`nav-segment-item ${direction === "decode" ? "active" : ""}`}
          >
            Decode
          </button>
        </div>
      </div>

      {/* Inline Error State */}
      {errorMsg && (
        <div className="status-banner error">
          <AlertTriangle size={16} />
          <span>{errorMsg} Check input formatting for {direction} mode.</span>
        </div>
      )}

      {/* Two-Panel View */}
      <div className="calc-layout-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Input */}
        <div className="code-panel-box">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter text to ${direction}...`}
            className="code-panel-textarea"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="code-panel-box">
          <div className="code-panel-display">
            {errorMsg ? (
              <span className="text-muted" style={{ fontStyle: "italic" }}>
                Execution stopped due to formatting error.
              </span>
            ) : output ? (
              output
            ) : (
              <span className="text-muted" style={{ fontStyle: "italic" }}>
                Result will appear here live...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
