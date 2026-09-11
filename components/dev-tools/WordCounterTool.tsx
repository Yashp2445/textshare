"use client";

import React, { useState } from "react";
import { Type, Sparkles, Clock, FileText } from "lucide-react";
import { CalcResultStat } from "@/components/calculators/CalcSharedUI";

export function WordCounterTool() {
  const [text, setText] = useState<string>(
    "LiveShare is a high-performance collaborative live text editor and developer utility suite. It runs 100% client-side with zero backend database costs."
  );

  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s+/g, "").length;

  const wordsArray = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const wordCount = text.trim() === "" ? 0 : wordsArray.length;

  const sentencesArray = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0);
  const sentenceCount = text.trim() === "" ? 0 : sentencesArray.length;

  const paragraphsArray = text
    .split(/\n+/)
    .filter((p) => p.trim().length > 0);
  const paragraphCount = text.trim() === "" ? 0 : paragraphsArray.length;

  // Reading time assumption: 200 words per minute
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  return (
    <div className="calc-form-grid">
      {/* Input */}
      <div className="flex flex-col gap-4">
        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <Type size={16} className="text-violet" />
            Text Content Input
          </label>
          <div className="code-panel-box">
            <textarea
              className="code-panel-textarea"
              style={{ minHeight: "320px" }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste text here to analyze word and character statistics live..."
            />
          </div>
        </div>
      </div>

      {/* Real-time Statistics */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <FileText size={16} className="text-violet" />
            Text Analysis Summary
          </h3>
        </div>

        <div className="calc-result-grid">
          <CalcResultStat label="Word Count" value={wordCount.toLocaleString()} />
          <CalcResultStat label="Chars (With Spaces)" value={charCountWithSpaces.toLocaleString()} />
          <CalcResultStat label="Chars (No Spaces)" value={charCountNoSpaces.toLocaleString()} />
          <CalcResultStat label="Sentence Count" value={sentenceCount.toLocaleString()} />
          <CalcResultStat label="Paragraph Count" value={paragraphCount.toLocaleString()} />
          <CalcResultStat label="Estimated Reading Time" value={`~${readingTimeMinutes} min`} />
        </div>

        <div className="status-banner" style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid var(--border-glow)" }}>
          <Clock size={16} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
            Calculates character, word, sentence density and reading speed dynamically as you type.
          </span>
        </div>
      </div>
    </div>
  );
}
