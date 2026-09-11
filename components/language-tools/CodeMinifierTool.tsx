"use client";

import React, { useState } from "react";
import { Copy, Check, Binary, Sparkles } from "lucide-react";
import { CalcToggleGroup, CalcResultStat } from "@/components/calculators/CalcSharedUI";

export function CodeMinifierTool() {
  const [lang, setLang] = useState<"js" | "css">("js");
  const [inputCode, setInputCode] = useState<string>(
    `/* LiveShare Sample Script */\nfunction addNumbers(a, b) {\n    // Return total sum\n    let sum = a + b;\n    console.log("Sum calculated:", sum);\n    return sum;\n}\n\naddNumbers(10, 20);`
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Client-side minifier logic
  const minifyCode = (code: string, type: "js" | "css"): string => {
    if (!code.trim()) return "";

    if (type === "css") {
      return code
        .replace(/\/\*[\s\S]*?\*\//g, "") // strip comments
        .replace(/\s+/g, " ") // collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, "$1") // strip spaces around punctuation
        .trim();
    } else {
      return code
        .replace(/\/\*[\s\S]*?\*\//g, "") // multi-line comments
        .replace(/\/\/.*/g, "") // single-line comments
        .replace(/\s+/g, " ") // collapse whitespace
        .replace(/\s*([=+\-*/{}();,])\s*/g, "$1")
        .trim();
    }
  };

  const minifiedOutput = minifyCode(inputCode, lang);

  const origSize = new Blob([inputCode]).size;
  const minSize = new Blob([minifiedOutput]).size;
  const savingsBytes = Math.max(0, origSize - minSize);
  const savingsPct = origSize > 0 ? ((savingsBytes / origSize) * 100).toFixed(1) : "0.0";

  const handleCopy = () => {
    if (!minifiedOutput) return;
    navigator.clipboard.writeText(minifiedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="calc-form-grid">
      {/* Input */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Minification Target</label>
          <CalcToggleGroup
            options={[
              { label: "JavaScript (JS)", value: "js" },
              { label: "Cascading Style Sheets (CSS)", value: "css" },
            ]}
            value={lang}
            onChange={(val) => setLang(val as any)}
            accent
          />
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label">Source Code Input</label>
          <div className="code-panel-box">
            <textarea
              className="code-panel-textarea font-mono"
              style={{ minHeight: "300px" }}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste JS or CSS code here..."
            />
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <Binary size={16} className="text-violet" />
            Minified Output ({lang.toUpperCase()})
          </h3>

          <button
            type="button"
            className="calc-segmented-btn active-accent text-xs py-1 px-3 flex items-center gap-1.5"
            onClick={handleCopy}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy Minified"}</span>
          </button>
        </div>

        <div className="calc-result-grid">
          <CalcResultStat label="Original Size" value={`${origSize} Bytes`} />
          <CalcResultStat label="Minified Size" value={`${minSize} Bytes`} />
          <CalcResultStat label="Space Saved" value={`${savingsBytes} Bytes`} />
          <CalcResultStat label="Compression %" value={`${savingsPct}%`} />
        </div>

        <div className="code-panel-box" style={{ flex: 1, minHeight: "220px" }}>
          <pre className="code-panel-display font-mono text-emerald-400">
            {minifiedOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
