"use client";

import React, { useState } from "react";
import { CalcInputSlider, CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";
import { Zap } from "lucide-react";

export function OhmsLawTool() {
  const [voltage, setVoltage] = useState<number>(12); // V
  const [current, setCurrent] = useState<number>(2); // I (Amps)

  // Derived values: V = I * R, P = V * I
  const r = current > 0 ? voltage / current : 0;
  const p = voltage * current;

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Voltage (V)"
          value={voltage}
          onChange={setVoltage}
          min={0.1}
          max={240}
          step={0.1}
          suffix=" V"
        />

        <CalcInputSlider
          label="Current (I)"
          value={current}
          onChange={setCurrent}
          min={0.01}
          max={50}
          step={0.01}
          suffix=" A"
        />
      </div>

      {/* Results & Relation Graphic */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Calculated Power (P)"
          value={`${p.toFixed(2)} W`}
          subtext={`Resistance (R) = ${r.toFixed(2)} Ω`}
        />

        <div className="calc-result-grid">
          <CalcResultStat label="Voltage (V)" value={`${voltage.toFixed(2)} V`} />
          <CalcResultStat label="Current (I)" value={`${current.toFixed(2)} A`} />
          <CalcResultStat label="Resistance (R)" value={`${r.toFixed(2)} Ω`} />
          <CalcResultStat label="Power Dissipation (P)" value={`${p.toFixed(2)} W`} />
        </div>

        {/* Ohm's Law Wheel Graphic */}
        <div className="glass-chart-wrapper py-4">
          <div className="text-xs font-bold text-violet mb-2 uppercase tracking-wider">
            Ohm's Law Relationship Equations
          </div>
          <div className="grid grid-cols-2 gap-2 w-full text-xs font-mono text-center">
            <div className="p-2 rounded bg-surface border border-dim">V = I × R</div>
            <div className="p-2 rounded bg-surface border border-dim">I = V / R</div>
            <div className="p-2 rounded bg-surface border border-dim">R = V / I</div>
            <div className="p-2 rounded bg-surface border border-dim">P = V × I</div>
          </div>
        </div>
      </div>
    </div>
  );
}
