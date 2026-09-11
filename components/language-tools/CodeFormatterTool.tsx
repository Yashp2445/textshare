"use client";

import React, { useState } from "react";
import { Copy, Check, Code2, Sparkles } from "lucide-react";
import { CalcToggleGroup } from "@/components/calculators/CalcSharedUI";

export function CodeFormatterTool() {
  const [language, setLanguage] = useState<"javascript" | "css" | "html" | "json" | "markdown">("javascript");
  const [inputCode, setInputCode] = useState<string>(
    `function calculateDiscount(price,percent){if(price<=0||percent<=0){return 0;}let discount=price*(percent/100);return price-discount;}`
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Client-side code beautifier
  const formatCode = (code: string, lang: string): string => {
    if (!code.trim()) return "";

    if (lang === "json") {
      try {
        const parsed = JSON.parse(code);
        return JSON.stringify(parsed, null, 2);
      } catch (err: any) {
        return `// JSON Syntax Error: ${err.message}\n${code}`;
      }
    }

    if (lang === "javascript" || lang === "typescript") {
      let formatted = code
        .replace(/;(?=\s*[^\s])/g, ";\n")
        .replace(/\{/g, " {\n  ")
        .replace(/\}/g, "\n}\n")
        .replace(/,\s*/g, ", ");
      return formatted;
    }

    if (lang === "css") {
      return code
        .replace(/\{/g, " {\n  ")
        .replace(/;/g, ";\n  ")
        .replace(/\}/g, "\n}\n")
        .replace(/\s*:\s*/g, ": ");
    }

    if (lang === "html") {
      return code
        .replace(/>\s*</g, ">\n<")
        .split("\n")
        .map((l) => (l.startsWith("</") ? l : `  ${l}`))
        .join("\n");
    }

    return code;
  };

  const formattedOutput = formatCode(inputCode, language);

  const handleCopy = () => {
    if (!formattedOutput) return;
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="calc-form-grid">
      {/* Input */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Language Format Target</label>
          <CalcToggleGroup
            options={[
              { label: "JavaScript", value: "javascript" },
              { label: "CSS", value: "css" },
              { label: "HTML", value: "html" },
              { label: "JSON", value: "json" },
              { label: "Markdown", value: "markdown" },
            ]}
            value={language}
            onChange={(l) => setLanguage(l as any)}
            accent
          />
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label">Unformatted Code Input</label>
          <div className="code-panel-box">
            <textarea
              className="code-panel-textarea font-mono"
              style={{ minHeight: "300px" }}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste code snippet here..."
            />
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <Code2 size={16} className="text-violet" />
            Beautified & Formatted Code ({language.toUpperCase()})
          </h3>

          <button
            type="button"
            className="calc-segmented-btn active-accent text-xs py-1 px-3 flex items-center gap-1.5"
            onClick={handleCopy}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>

        <div className="code-panel-box" style={{ flex: 1, minHeight: "310px" }}>
          <pre className="code-panel-display font-mono text-violet">
            {formattedOutput}
          </pre>
        </div>

        <div className="status-banner" style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          <Sparkles size={16} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
            Instant client-side code formatting in browser.
          </span>
        </div>
      </div>
    </div>
  );
}
