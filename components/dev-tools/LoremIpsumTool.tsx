"use client";

import React, { useState } from "react";
import { Copy, Check, FileText, Sparkles } from "lucide-react";
import { CalcToggleGroup, CalcInputSlider } from "@/components/calculators/CalcSharedUI";

export function LoremIpsumTool() {
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState<number>(3);
  const [copied, setCopied] = useState<boolean>(false);

  const LOREM_WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
    "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
  ];

  const generateLorem = (): string => {
    if (unit === "words") {
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      return result.join(" ") + ".";
    }

    if (unit === "sentences") {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        const sentenceWords = [];
        const numWords = 8 + (i % 6);
        for (let j = 0; j < numWords; j++) {
          sentenceWords.push(LOREM_WORDS[(i * 7 + j) % LOREM_WORDS.length]);
        }
        const s = sentenceWords.join(" ");
        sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + ".");
      }
      return sentences.join(" ");
    }

    // Paragraphs
    const paragraphs = [];
    for (let p = 0; p < count; p++) {
      const sentences = [];
      for (let s = 0; s < 4; s++) {
        const sentenceWords = [];
        const numWords = 9 + ((p + s) % 5);
        for (let j = 0; j < numWords; j++) {
          sentenceWords.push(LOREM_WORDS[(p * 13 + s * 7 + j) % LOREM_WORDS.length]);
        }
        const str = sentenceWords.join(" ");
        sentences.push(str.charAt(0).toUpperCase() + str.slice(1) + ".");
      }
      paragraphs.push(sentences.join(" "));
    }
    return paragraphs.join("\n\n");
  };

  const outputText = generateLorem();

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="calc-form-grid">
      {/* Settings */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Generation Mode</label>
          <CalcToggleGroup
            options={[
              { label: "Paragraphs", value: "paragraphs" },
              { label: "Sentences", value: "sentences" },
              { label: "Words", value: "words" },
            ]}
            value={unit}
            onChange={(val) => setUnit(val as any)}
            accent
          />
        </div>

        <CalcInputSlider
          label={`Number of ${unit}`}
          value={count}
          onChange={setCount}
          min={1}
          max={unit === "words" ? 200 : 20}
          step={1}
        />
      </div>

      {/* Output */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <FileText size={16} className="text-violet" />
            Placeholder Text Output
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
          <pre className="code-panel-display font-sans text-sm text-main leading-relaxed">
            {outputText}
          </pre>
        </div>
      </div>
    </div>
  );
}
