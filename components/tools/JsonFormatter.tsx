"use client";

import React, { useState, useTransition } from "react";
import { Code2, Copy, Check, Minimize2, FolderTree, AlignLeft, AlertTriangle, CheckCircle2 } from "lucide-react";

interface TreeNodeProps {
  data: any;
  label?: string;
  isLast?: boolean;
}

function JsonTreeNode({ data, label, isLast = true }: TreeNodeProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (data === null) {
    return (
      <div className="tree-node">
        {label && <span className="syn-key">"{label}": </span>}
        <span className="syn-null">null</span>
        {!isLast && ","}
      </div>
    );
  }

  if (typeof data === "boolean") {
    return (
      <div className="tree-node">
        {label && <span className="syn-key">"{label}": </span>}
        <span className="syn-bool">{data ? "true" : "false"}</span>
        {!isLast && ","}
      </div>
    );
  }

  if (typeof data === "number") {
    return (
      <div className="tree-node">
        {label && <span className="syn-key">"{label}": </span>}
        <span className="syn-num">{data}</span>
        {!isLast && ","}
      </div>
    );
  }

  if (typeof data === "string") {
    return (
      <div className="tree-node">
        {label && <span className="syn-key">"{label}": </span>}
        <span className="syn-str">"{data}"</span>
        {!isLast && ","}
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const keys = Object.keys(data);
  const openBracket = isArray ? "[" : "{";
  const closeBracket = isArray ? "]" : "}";

  return (
    <div className="tree-node">
      <button 
        type="button" 
        onClick={() => setCollapsed(!collapsed)} 
        className="tree-toggle-btn"
      >
        {collapsed ? "▶" : "▼"}
      </button>
      {label && <span className="syn-key">"{label}": </span>}
      <span className="text-muted">{openBracket}</span>
      {collapsed ? (
        <span className="text-muted"> ... {closeBracket}{!isLast && ","}</span>
      ) : (
        <>
          <div style={{ paddingLeft: "1rem" }}>
            {keys.map((k, idx) => (
              <JsonTreeNode 
                key={k} 
                data={data[k]} 
                label={isArray ? undefined : k} 
                isLast={idx === keys.length - 1} 
              />
            ))}
          </div>
          <span className="text-muted">{closeBracket}{!isLast && ","}</span>
        </>
      )}
    </div>
  );
}

function renderSyntaxHighlighted(jsonStr: string) {
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

export function JsonFormatter() {
  const [input, setInput] = useState<string>(`{
  "name": "LiveShare DevTools",
  "version": 1.0,
  "features": ["Realtime Text", "Scientific Calc", "JSON Validator"],
  "settings": {
    "theme": "liquid-glass",
    "active": true,
    "maxSize": 1048576
  }
}`);
  const [viewMode, setViewMode] = useState<"formatted" | "tree">("formatted");
  const [copied, setCopied] = useState(false);

  let parsed: any = null;
  let errorMsg: string | null = null;
  let errorLine: number | null = null;

  try {
    if (input.trim()) {
      parsed = JSON.parse(input);
    }
  } catch (err: any) {
    errorMsg = err.message || "Invalid JSON syntax";
    // Attempt to extract position/line number from error message
    const match = errorMsg?.match(/at position (\d+)/) || errorMsg?.match(/line (\d+) column (\d+)/);
    if (match) {
      if (match[1] && match[2]) {
        errorLine = parseInt(match[1], 10);
      } else if (match[1]) {
        const pos = parseInt(match[1], 10);
        const lines = input.substring(0, pos).split("\n");
        errorLine = lines.length;
      }
    }
  }

  const formattedStr = parsed !== null ? JSON.stringify(parsed, null, 2) : "";
  const minifiedStr = parsed !== null ? JSON.stringify(parsed) : "";

  const handleCopy = () => {
    if (formattedStr) {
      navigator.clipboard.writeText(formattedStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMinify = () => {
    if (minifiedStr) {
      setInput(minifiedStr);
    }
  };

  const handleFormatInput = () => {
    if (formattedStr) {
      setInput(formattedStr);
    }
  };

  return (
    <div className="tool-card-glass">
      <div className="tool-header">
        <div className="tool-title-group">
          <h1 className="tool-title">
            <Code2 size={22} className="text-violet" />
            JSON Formatter & Validator
          </h1>
          <p className="tool-subtitle">
            Validate, format, highlight, and inspect nested JSON tree structures instantly in real-time.
          </p>
        </div>

        <div className="tool-action-group">
          <button 
            type="button" 
            onClick={handleFormatInput}
            disabled={!parsed}
            className="btn btn-secondary btn-sm"
          >
            <AlignLeft size={14} />
            Auto-Format
          </button>
          <button 
            type="button" 
            onClick={handleMinify}
            disabled={!parsed}
            className="btn btn-secondary btn-sm"
          >
            Minify
          </button>
          <button 
            type="button" 
            onClick={handleCopy}
            disabled={!parsed}
            className="btn btn-primary btn-sm"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy Output"}
          </button>
        </div>
      </div>

      {/* Validation Status Indicator */}
      {errorMsg ? (
        <div className="status-banner error">
          <AlertTriangle size={16} />
          <span>
            <strong>Invalid JSON:</strong> {errorMsg} {errorLine ? `(Line ${errorLine})` : ""}
          </span>
        </div>
      ) : input.trim() ? (
        <div className="status-banner success">
          <CheckCircle2 size={16} />
          <span>Valid JSON structure. Ready to copy or inspect tree view.</span>
        </div>
      ) : null}

      {/* Two-Panel Layout */}
      <div className="calc-layout-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Left Input */}
        <div className="code-panel-box">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste raw JSON here..."
            className="code-panel-textarea"
            spellCheck={false}
          />
        </div>

        {/* Right Output */}
        <div className="code-panel-box" style={{ display: "flex", flexDirection: "column" }}>
          <div 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              padding: "0.5rem 1rem", 
              borderBottom: "1px solid var(--border-dim)",
              background: "var(--bg-surface)",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)"
            }}
          >
            <span className="text-muted">Output Preview</span>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                type="button"
                onClick={() => setViewMode("formatted")}
                className={`calc-mode-btn ${viewMode === "formatted" ? "active" : ""}`}
              >
                Code
              </button>
              <button
                type="button"
                onClick={() => setViewMode("tree")}
                className={`calc-mode-btn ${viewMode === "tree" ? "active" : ""}`}
                disabled={!parsed}
              >
                Tree View
              </button>
            </div>
          </div>

          <div className="code-panel-display" style={{ flex: 1 }}>
            {errorMsg ? (
              <span className="text-muted" style={{ fontStyle: "italic" }}>
                Fix validation errors on the left to preview formatted JSON output.
              </span>
            ) : !input.trim() ? (
              <span className="text-muted" style={{ fontStyle: "italic" }}>
                Formatted output will appear here...
              </span>
            ) : viewMode === "tree" && parsed !== null ? (
              <JsonTreeNode data={parsed} />
            ) : (
              renderSyntaxHighlighted(formattedStr)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
