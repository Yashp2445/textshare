"use client";

import React, { useState } from "react";
import { CalcInputSlider, CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";

export function VoltageDividerTool() {
  const [vin, setVin] = useState<number>(12);
  const [r1, setR1] = useState<number>(10000); // 10k
  const [r2, setR2] = useState<number>(10000); // 10k

  const totalR = r1 + r2;
  const vout = totalR > 0 ? vin * (r2 / totalR) : 0;
  const current = totalR > 0 ? vin / totalR : 0;

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Input Voltage (Vin)"
          value={vin}
          onChange={setVin}
          min={1}
          max={60}
          step={0.5}
          suffix=" V"
        />

        <CalcInputSlider
          label="Resistor 1 (R1)"
          value={r1}
          onChange={setR1}
          min={100}
          max={100000}
          step={500}
          suffix=" Ω"
        />

        <CalcInputSlider
          label="Resistor 2 (R2)"
          value={r2}
          onChange={setR2}
          min={100}
          max={100000}
          step={500}
          suffix=" Ω"
        />
      </div>

      {/* Results & Diagram */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Output Voltage (Vout)"
          value={`${vout.toFixed(2)} V`}
          subtext={`Divider Ratio: ${((vout / (vin || 1)) * 100).toFixed(1)}% of Vin`}
        />

        <div className="calc-result-grid">
          <CalcResultStat label="Input Voltage (Vin)" value={`${vin} V`} />
          <CalcResultStat label="Total Resistance" value={`${(totalR / 1000).toFixed(2)} kΩ`} />
          <CalcResultStat label="Circuit Current" value={`${(current * 1000).toFixed(2)} mA`} />
          <CalcResultStat label="Power Dissipation" value={`${(vin * current * 1000).toFixed(1)} mW`} />
        </div>

        {/* SVG Voltage Divider Circuit Diagram */}
        <div className="glass-chart-wrapper py-4">
          <svg viewBox="0 0 200 120" className="w-full h-24 max-w-xs">
            <line x1="30" y1="20" x2="30" y2="100" stroke="#a855f7" strokeWidth="3" />
            <line x1="30" y1="20" x2="100" y2="20" stroke="#a855f7" strokeWidth="3" />
            {/* R1 */}
            <rect x="90" y="30" width="20" height="30" fill="#38bdf8" rx="2" />
            <text x="120" y="48" fill="#f8fafc" fontSize="10" fontFamily="monospace">
              R1 = {(r1 / 1000).toFixed(1)}k
            </text>

            <line x1="100" y1="20" x2="100" y2="100" stroke="#a855f7" strokeWidth="3" />
            {/* R2 */}
            <rect x="90" y="70" width="20" height="30" fill="#38bdf8" rx="2" />
            <text x="120" y="88" fill="#f8fafc" fontSize="10" fontFamily="monospace">
              R2 = {(r2 / 1000).toFixed(1)}k
            </text>

            {/* Vout Pick line */}
            <line x1="100" y1="65" x2="170" y2="65" stroke="#10b981" strokeWidth="3" />
            <circle cx="170" cy="65" r="4" fill="#10b981" />
            <text x="175" y="69" fill="#10b981" fontSize="11" fontWeight="bold">
              Vout
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
