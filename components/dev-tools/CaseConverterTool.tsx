"use client";

import React, { useState } from "react";
import { Copy, Check, FileSearch, Sparkles } from "lucide-react";
import { CalcToggleGroup } from "@/components/calculators/CalcSharedUI";

type CaseMode = "upper" | "lower" | "title" | "sentence" | "alt" | "camel" | "kebab" | "snake";

export function CaseConverterTool() {
  const [inputText, setInputText] = useState<string>(
    "LiveShare real-time text and file sharing application"
  );
  const [mode, setMode] = useState<CaseMode>("upper");
  const [copied, setCopied] = useState<boolean>(false);

  const convertCase = (str: string, type: CaseMode): string => {
    if (!str) return "";

    switch (type) {
      case "upper":
        return str.toUpperCase();
      case "lower":
        return str.toLowerCase();
      case "title":
        return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
      case "sentence":
        return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
      case "alt":
        return str
          .split("")
          .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
          .join("");
      case "camel":
        return str
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
      case "kebab":
        return str
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      case "snake":
        return str
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "");
      default:
        return str;
    }
  };

  const outputText = convertCase(inputText, mode);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="calc-form-grid">
      {/* Input */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Select Case Transformation</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "UPPERCASE", value: "upper" },
              { label: "lowercase", value: "lower" },
              { label: "Title Case", value: "title" },
              { label: "Sentence case", value: "sentence" },
              { label: "aLtErNaTiNg", value: "alt" },
              { label: "camelCase", value: "camel" },
              { label: "kebab-case", value: "kebab" },
              { label: "snake_case", value: "snake" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`calc-segmented-btn text-xs py-1.5 font-bold ${mode === opt.value ? "active-accent" : ""}`}
                onClick={() => setMode(opt.value as CaseMode)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label">Input Text</label>
          <div className="code-panel-box">
            <textarea
              className="code-panel-textarea"
              style={{ minHeight: "260px" }}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste text here to convert case..."
            />
          </div>
        </div>
      </div>

      {/* Transformed Output */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <FileSearch size={16} className="text-violet" />
            Transformed Output ({mode.toUpperCase()})
          </h3>

          <button
            type="button"
            className="calc-segmented-btn active-accent text-xs py-1 px-3 flex items-center gap-1.5"
            onClick={handleCopy}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>
        </div>

        <div className="code-panel-box" style={{ flex: 1, minHeight: "260px" }}>
          <pre className="code-panel-display font-mono text-emerald-400">
            {outputText}
          </pre>
        </div>
      </div>
    </div>
  );
}
