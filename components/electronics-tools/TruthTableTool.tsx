"use client";

import React, { useState } from "react";
import { Terminal, Sparkles } from "lucide-react";

export function TruthTableTool() {
  const [expression, setExpression] = useState<string>("(A AND B) OR (NOT C)");

  // Evaluate boolean expression for A, B, C values
  const evaluateExpr = (expr: string, a: boolean, b: boolean, c: boolean): boolean => {
    try {
      let sanitized = expr
        .toUpperCase()
        .replace(/\bA\b/g, a ? "true" : "false")
        .replace(/\bB\b/g, b ? "true" : "false")
        .replace(/\bC\b/g, c ? "true" : "false")
        .replace(/\bAND\b/g, "&&")
        .replace(/\bOR\b/g, "||")
        .replace(/\bNOT\b/g, "!")
        .replace(/\bXOR\b/g, "^");

      const fn = new Function(`return (${sanitized});`);
      return Boolean(fn());
    } catch {
      return false;
    }
  };

  // Generate 8 truth combinations for A, B, C
  const combinations = [
    { a: false, b: false, c: false },
    { a: false, b: false, c: true },
    { a: false, b: true, c: false },
    { a: false, b: true, c: true },
    { a: true, b: false, c: false },
    { a: true, b: false, c: true },
    { a: true, b: true, c: false },
    { a: true, b: true, c: true },
  ];

  return (
    <div className="calc-form-grid">
      {/* Input */}
      <div className="flex flex-col gap-4">
        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <Terminal size={16} className="text-violet" />
            Boolean Expression (Supports A, B, C with AND, OR, NOT, XOR)
          </label>
          <div className="calc-num-input-wrapper">
            <input
              type="text"
              className="calc-num-input uppercase font-mono"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. (A AND B) OR NOT C"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {["A AND B", "A OR B", "(A AND B) OR (NOT C)", "A XOR B"].map((preset) => (
            <button
              key={preset}
              type="button"
              className={`calc-segmented-btn text-xs py-1 ${expression === preset ? "active" : ""}`}
              onClick={() => setExpression(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Truth Table Output */}
      <div className="calc-results-column">
        <div className="border border-dim rounded-md overflow-hidden bg-input">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-surface border-b border-dim text-violet font-bold">
                <th className="p-2.5 text-center">A</th>
                <th className="p-2.5 text-center">B</th>
                <th className="p-2.5 text-center">C</th>
                <th className="p-2.5 text-center text-main">{expression}</th>
              </tr>
            </thead>
            <tbody>
              {combinations.map((comb, idx) => {
                const res = evaluateExpr(expression, comb.a, comb.b, comb.c);
                return (
                  <tr key={idx} className="border-b border-dim/50 hover:bg-hover">
                    <td className="p-2 text-center text-muted">{comb.a ? "1" : "0"}</td>
                    <td className="p-2 text-center text-muted">{comb.b ? "1" : "0"}</td>
                    <td className="p-2 text-center text-muted">{comb.c ? "1" : "0"}</td>
                    <td className={`p-2 text-center font-bold ${res ? "text-emerald-400" : "text-zinc-500"}`}>
                      {res ? "1 (HIGH)" : "0 (LOW)"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
