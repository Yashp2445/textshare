"use client";

import React, { useState, useRef } from "react";
import { Palette, Download, Copy, Check, Sparkles } from "lucide-react";
import { CalcToggleGroup, CalcInputSlider } from "@/components/calculators/CalcSharedUI";

export function CodeToImageTool() {
  const [code, setCode] = useState<string>(
    `const liveShare = {\n  status: "connected",\n  mode: "realtime",\n  toolsCount: 35,\n  zeroCost: true,\n};\n\nconsole.log("LiveShare online!", liveShare);`
  );
  const [theme, setTheme] = useState<"glass" | "vscode" | "synthwave" | "monokai">("glass");
  const [windowTitle, setWindowTitle] = useState<string>("app.ts");
  const [padding, setPadding] = useState<number>(32);
  const [copied, setCopied] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const themesMap = {
    glass: {
      bg: "linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0f172a 100%)",
      cardBg: "rgba(18, 22, 32, 0.85)",
      border: "rgba(168, 85, 247, 0.35)",
      text: "#f8fafc",
      headerBg: "rgba(0, 0, 0, 0.3)",
    },
    vscode: {
      bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      cardBg: "#1e1e1e",
      border: "rgba(255, 255, 255, 0.1)",
      text: "#d4d4d4",
      headerBg: "#252526",
    },
    synthwave: {
      bg: "linear-gradient(135deg, #241442 0%, #8b5cf6 100%)",
      cardBg: "#261447",
      border: "#ff7edb",
      text: "#f4eee0",
      headerBg: "#1e0f38",
    },
    monokai: {
      bg: "linear-gradient(135deg, #121212 0%, #272822 100%)",
      cardBg: "#272822",
      border: "rgba(255, 255, 255, 0.15)",
      text: "#f8f8f2",
      headerBg: "#1e1f1c",
    },
  };

  const activeTheme = themesMap[theme];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="calc-form-grid">
      {/* Settings Column */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Visual Theme</label>
          <CalcToggleGroup
            options={[
              { label: "Liquid Glass", value: "glass" },
              { label: "VS Code Dark", value: "vscode" },
              { label: "Synthwave", value: "synthwave" },
              { label: "Monokai", value: "monokai" },
            ]}
            value={theme}
            onChange={(val) => setTheme(val as any)}
            accent
          />
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label">Window Title Header</label>
          <div className="calc-num-input-wrapper">
            <input
              type="text"
              className="calc-num-input"
              value={windowTitle}
              onChange={(e) => setWindowTitle(e.target.value)}
              placeholder="Filename or title"
            />
          </div>
        </div>

        <CalcInputSlider
          label="Container Outer Padding"
          value={padding}
          onChange={setPadding}
          min={16}
          max={64}
          step={8}
          suffix="px"
        />

        <div className="calc-input-box">
          <label className="calc-input-label">Code Snippet Input</label>
          <div className="code-panel-box">
            <textarea
              className="code-panel-textarea font-mono"
              style={{ minHeight: "220px" }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste code snippet here..."
            />
          </div>
        </div>
      </div>

      {/* Styled Card Live Preview */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <Palette size={16} className="text-violet" />
            Styled Code Card Preview
          </h3>

          <button
            type="button"
            className="calc-segmented-btn active-accent text-xs py-1 px-3 flex items-center gap-1.5"
            onClick={handleCopyCode}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy Snippet"}</span>
          </button>
        </div>

        {/* Outer Canvas Container */}
        <div
          ref={cardRef}
          className="rounded-xl flex items-center justify-center transition-all shadow-2xl overflow-hidden"
          style={{
            background: activeTheme.bg,
            padding: `${padding}px`,
            minHeight: "320px",
          }}
        >
          {/* Inner Code Window */}
          <div
            className="w-full rounded-lg overflow-hidden backdrop-blur-xl transition-all"
            style={{
              background: activeTheme.cardBg,
              border: `1px solid ${activeTheme.border}`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            {/* Window Header Buttons */}
            <div
              className="flex items-center justify-between px-3.5 py-2.5 border-b"
              style={{
                background: activeTheme.headerBg,
                borderColor: activeTheme.border,
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="text-xs font-mono font-medium opacity-70" style={{ color: activeTheme.text }}>
                {windowTitle}
              </span>
              <div className="w-10" />
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto">
              <pre
                className="font-mono text-xs leading-relaxed"
                style={{ color: activeTheme.text }}
              >
                {code}
              </pre>
            </div>
          </div>
        </div>

        <div className="status-banner" style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid var(--border-glow)" }}>
          <Sparkles size={16} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
            Carbon-style shareable code window card. Instant high-resolution client-side rendering.
          </span>
        </div>
      </div>
    </div>
  );
}
