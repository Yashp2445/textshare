"use client";

import React, { useState } from "react";
import { CalcToggleGroup, CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";
import { Layers, Power } from "lucide-react";

type GateType = "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR";

export function LogicGateSimTool() {
  const [gate, setGate] = useState<GateType>("AND");
  const [inputA, setInputA] = useState<boolean>(true);
  const [inputB, setInputB] = useState<boolean>(true);

  // Evaluate logic gate
  const evaluateGate = (type: GateType, a: boolean, b: boolean): boolean => {
    switch (type) {
      case "AND": return a && b;
      case "OR": return a || b;
      case "NOT": return !a;
      case "NAND": return !(a && b);
      case "NOR": return !(a || b);
      case "XOR": return a !== b;
      case "XNOR": return a === b;
      default: return false;
    }
  };

  const outputSignal = evaluateGate(gate, inputA, inputB);

  return (
    <div className="calc-form-grid">
      {/* Controls */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Select Logic Gate Type</label>
          <div className="grid grid-cols-4 gap-2">
            {(["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR"] as GateType[]).map((g) => (
              <button
                key={g}
                type="button"
                className={`calc-segmented-btn text-xs py-2 font-bold ${gate === g ? "active-accent" : ""}`}
                onClick={() => setGate(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Signal Input Toggles */}
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-surface border border-dim">
          <span className="text-xs font-bold text-main uppercase tracking-wider">
            Input Signal Toggles
          </span>

          <div className="flex items-center justify-between p-2.5 rounded bg-input">
            <span className="font-mono text-sm text-main font-semibold">Input A Signal</span>
            <button
              type="button"
              className={`calc-segmented-btn py-1 px-4 text-xs font-bold transition-all ${
                inputA ? "bg-emerald-500 text-black shadow-glow" : "bg-zinc-700 text-zinc-300"
              }`}
              onClick={() => setInputA(!inputA)}
            >
              {inputA ? "HIGH (1)" : "LOW (0)"}
            </button>
          </div>

          {gate !== "NOT" && (
            <div className="flex items-center justify-between p-2.5 rounded bg-input">
              <span className="font-mono text-sm text-main font-semibold">Input B Signal</span>
              <button
                type="button"
                className={`calc-segmented-btn py-1 px-4 text-xs font-bold transition-all ${
                  inputB ? "bg-emerald-500 text-black shadow-glow" : "bg-zinc-700 text-zinc-300"
                }`}
                onClick={() => setInputB(!inputB)}
              >
                {inputB ? "HIGH (1)" : "LOW (0)"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logic Gate Canvas & Output */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Output Signal Result (Q)"
          value={outputSignal ? "HIGH (1)" : "LOW (0)"}
          subtext={`Gate logic evaluation: ${gate}`}
        />

        {/* Interactive Schematic Diagram */}
        <div className="glass-chart-wrapper py-6">
          <svg viewBox="0 0 280 120" className="w-full h-28 max-w-sm">
            {/* Input Wires */}
            <line
              x1="20"
              y1="40"
              x2="90"
              y2="40"
              stroke={inputA ? "#10b981" : "#475569"}
              strokeWidth="4"
            />
            <text x="25" y="32" fill={inputA ? "#10b981" : "#94a3b8"} fontSize="11" fontWeight="bold">
              A: {inputA ? "1" : "0"}
            </text>

            {gate !== "NOT" && (
              <>
                <line
                  x1="20"
                  y1="80"
                  x2="90"
                  y2="80"
                  stroke={inputB ? "#10b981" : "#475569"}
                  strokeWidth="4"
                />
                <text x="25" y="98" fill={inputB ? "#10b981" : "#94a3b8"} fontSize="11" fontWeight="bold">
                  B: {inputB ? "1" : "0"}
                </text>
              </>
            )}

            {/* Gate Body Symbol */}
            <rect
              x="90"
              y="25"
              width="80"
              height="70"
              rx="8"
              fill="#18181b"
              stroke="#a855f7"
              strokeWidth="2.5"
            />
            <text x="130" y="66" textAnchor="middle" fill="#a855f7" fontSize="15" fontWeight="bold" fontFamily="monospace">
              {gate}
            </text>

            {/* Output Wire & LED indicator */}
            <line
              x1="170"
              y1="60"
              x2="240"
              y2="60"
              stroke={outputSignal ? "#10b981" : "#475569"}
              strokeWidth="4"
            />
            <circle
              cx="245"
              cy="60"
              r="10"
              fill={outputSignal ? "#10b981" : "#18181b"}
              stroke={outputSignal ? "#34d399" : "#475569"}
              strokeWidth="3"
            />
            <text x="245" y="90" textAnchor="middle" fill={outputSignal ? "#10b981" : "#94a3b8"} fontSize="11" fontWeight="bold">
              LED Q
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
