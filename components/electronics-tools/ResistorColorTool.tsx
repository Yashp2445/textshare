"use client";

import React, { useState } from "react";
import { CalcToggleGroup, CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";
import { Cpu } from "lucide-react";

interface ColorBand {
  name: string;
  color: string;
  textDark?: boolean;
  digit?: number;
  multiplier: number;
  tolerance?: number;
}

const COLOR_MAP: Record<string, ColorBand> = {
  black: { name: "Black", color: "#18181b", digit: 0, multiplier: 1 },
  brown: { name: "Brown", color: "#78350f", digit: 1, multiplier: 10, tolerance: 1 },
  red: { name: "Red", color: "#dc2626", digit: 2, multiplier: 100, tolerance: 2 },
  orange: { name: "Orange", color: "#ea580c", digit: 3, multiplier: 1000 },
  yellow: { name: "Yellow", color: "#eab308", textDark: true, digit: 4, multiplier: 10000 },
  green: { name: "Green", color: "#16a34a", digit: 5, multiplier: 100000, tolerance: 0.5 },
  blue: { name: "Blue", color: "#2563eb", digit: 6, multiplier: 1000000, tolerance: 0.25 },
  violet: { name: "Violet", color: "#9333ea", digit: 7, multiplier: 10000000, tolerance: 0.1 },
  grey: { name: "Grey", color: "#6b7280", digit: 8, multiplier: 100000000, tolerance: 0.05 },
  white: { name: "White", color: "#f8fafc", textDark: true, digit: 9, multiplier: 1000000000 },
  gold: { name: "Gold", color: "#d97706", textDark: true, multiplier: 0.1, tolerance: 5 },
  silver: { name: "Silver", color: "#94a3b8", textDark: true, multiplier: 0.01, tolerance: 10 },
};

export function ResistorColorTool() {
  const [band1, setBand1] = useState<string>("brown");
  const [band2, setBand2] = useState<string>("black");
  const [band3, setBand3] = useState<string>("red");
  const [band4, setBand4] = useState<string>("gold"); // Multiplier/Tolerance

  const b1 = COLOR_MAP[band1];
  const b2 = COLOR_MAP[band2];
  const b3 = COLOR_MAP[band3];
  const b4 = COLOR_MAP[band4];

  const digitsVal = (b1.digit || 0) * 10 + (b2.digit || 0);
  const resistanceVal = digitsVal * (b3.multiplier || 1);
  const toleranceVal = b4.tolerance || 5;

  const formatResistance = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)} MΩ`;
    if (val >= 1000) return `${(val / 1000).toFixed(2)} kΩ`;
    return `${val.toFixed(1)} Ω`;
  };

  return (
    <div className="calc-form-grid">
      {/* Band Selection Column */}
      <div className="flex flex-col gap-4">
        <div className="calc-input-box">
          <label className="calc-input-label">Band 1 (1st Digit)</label>
          <div className="grid grid-cols-5 gap-1.5 mt-1">
            {Object.entries(COLOR_MAP)
              .filter(([_, b]) => b.digit !== undefined && b.name !== "Black")
              .map(([key, band]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBand1(key)}
                  className={`py-1.5 px-1 rounded text-[11px] font-bold border transition-all text-center ${
                    band1 === key ? "ring-2 ring-violet border-white scale-105" : "border-transparent"
                  }`}
                  style={{
                    background: band.color,
                    color: band.textDark ? "#111" : "#fff",
                  }}
                >
                  {band.name}
                </button>
              ))}
          </div>
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label">Band 2 (2nd Digit)</label>
          <div className="grid grid-cols-5 gap-1.5 mt-1">
            {Object.entries(COLOR_MAP)
              .filter(([_, b]) => b.digit !== undefined)
              .map(([key, band]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBand2(key)}
                  className={`py-1.5 px-1 rounded text-[11px] font-bold border transition-all text-center ${
                    band2 === key ? "ring-2 ring-violet border-white scale-105" : "border-transparent"
                  }`}
                  style={{
                    background: band.color,
                    color: band.textDark ? "#111" : "#fff",
                  }}
                >
                  {band.name}
                </button>
              ))}
          </div>
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label">Band 3 (Multiplier)</label>
          <div className="grid grid-cols-5 gap-1.5 mt-1">
            {Object.entries(COLOR_MAP).map(([key, band]) => (
              <button
                key={key}
                type="button"
                onClick={() => setBand3(key)}
                className={`py-1.5 px-1 rounded text-[11px] font-bold border transition-all text-center ${
                  band3 === key ? "ring-2 ring-violet border-white scale-105" : "border-transparent"
                }`}
                style={{
                  background: band.color,
                  color: band.textDark ? "#111" : "#fff",
                }}
              >
                {band.name}
              </button>
            ))}
          </div>
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label">Band 4 (Tolerance)</label>
          <div className="grid grid-cols-5 gap-1.5 mt-1">
            {Object.entries(COLOR_MAP)
              .filter(([_, b]) => b.tolerance !== undefined)
              .map(([key, band]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBand4(key)}
                  className={`py-1.5 px-1 rounded text-[11px] font-bold border transition-all text-center ${
                    band4 === key ? "ring-2 ring-violet border-white scale-105" : "border-transparent"
                  }`}
                  style={{
                    background: band.color,
                    color: band.textDark ? "#111" : "#fff",
                  }}
                >
                  ±{band.tolerance}%
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* SVG Resistor Visual & Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Calculated Resistance Value"
          value={formatResistance(resistanceVal)}
          subtext={`Tolerance Rating: ±${toleranceVal}%`}
        />

        {/* SVG Resistor Graphic */}
        <div className="glass-chart-wrapper py-6">
          <svg viewBox="0 0 320 80" className="w-full h-24 max-w-sm">
            {/* Wire Leads */}
            <line x1="10" y1="40" x2="60" y2="40" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <line x1="260" y1="40" x2="310" y2="40" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />

            {/* Resistor Body */}
            <path
              d="M 60 20 Q 80 15 100 20 L 220 20 Q 240 15 260 20 L 260 60 Q 240 65 220 60 L 100 60 Q 80 65 60 60 Z"
              fill="#d97706"
              fillOpacity="0.8"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />

            {/* Color Bands */}
            <rect x="90" y="16" width="12" height="48" fill={b1.color} rx="2" />
            <rect x="130" y="18" width="12" height="44" fill={b2.color} rx="2" />
            <rect x="170" y="18" width="12" height="44" fill={b3.color} rx="2" />
            <rect x="220" y="16" width="12" height="48" fill={b4.color} rx="2" />
          </svg>

          <div className="flex justify-between w-full text-xs text-dim px-4 font-mono">
            <span>Band 1: {b1.name}</span>
            <span>Band 2: {b2.name}</span>
            <span>Multiplier: {b3.name}</span>
            <span>Tolerance: ±{toleranceVal}%</span>
          </div>
        </div>

        <div className="calc-result-grid">
          <CalcResultStat label="Min Expected" value={formatResistance(resistanceVal * (1 - toleranceVal / 100))} />
          <CalcResultStat label="Max Expected" value={formatResistance(resistanceVal * (1 + toleranceVal / 100))} />
        </div>
      </div>
    </div>
  );
}
