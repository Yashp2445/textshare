"use client";

import React, { useState } from "react";
import { CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";
import { Cpu } from "lucide-react";

export function CapacitorCodeTool() {
  const [code, setCode] = useState<string>("104");

  const decodeCapacitor = (cStr: string) => {
    const clean = cStr.trim();
    if (clean.length < 3 || isNaN(Number(clean.slice(0, 3)))) {
      return { pf: 0, nf: 0, uf: 0, valid: false };
    }

    const d1 = parseInt(clean[0], 10);
    const d2 = parseInt(clean[1], 10);
    const multiplier = Math.pow(10, parseInt(clean[2], 10));

    const pf = (d1 * 10 + d2) * multiplier;
    const nf = pf / 1000;
    const uf = pf / 1000000;

    return { pf, nf, uf, valid: true };
  };

  const res = decodeCapacitor(code);

  return (
    <div className="calc-form-grid">
      {/* Input */}
      <div className="flex flex-col gap-5">
        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <Cpu size={16} className="text-violet" />
            3-Digit Capacitor Marking Code (e.g., 104, 223, 472)
          </label>
          <div className="calc-num-input-wrapper">
            <input
              type="text"
              className="calc-num-input uppercase"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 104"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {["103 (10nF)", "104 (100nF)", "223 (22nF)", "472 (4.7nF)"].map((preset) => {
            const pCode = preset.split(" ")[0];
            return (
              <button
                key={pCode}
                type="button"
                className={`calc-segmented-btn text-xs py-1 ${code === pCode ? "active" : ""}`}
                onClick={() => setCode(pCode)}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Decoded Capacitance Value"
          value={
            res.valid
              ? res.uf >= 1
                ? `${res.uf.toFixed(2)} µF`
                : res.nf >= 1
                ? `${res.nf.toFixed(2)} nF`
                : `${res.pf.toLocaleString()} pF`
              : "Invalid Code"
          }
          subtext={`Code "${code}" multiplier: 10^${code[2] || 0}`}
        />

        <div className="calc-result-grid">
          <CalcResultStat label="Picofarads (pF)" value={`${res.pf.toLocaleString()} pF`} />
          <CalcResultStat label="Nanofarads (nF)" value={`${res.nf} nF`} />
          <CalcResultStat label="Microfarads (µF)" value={`${res.uf} µF`} />
          <CalcResultStat label="Standard Code Format" value="3-Digit EIA" />
        </div>
      </div>
    </div>
  );
}
