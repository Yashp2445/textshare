"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
} from "./CalcSharedUI";

export function CgpaPercentageCalculator() {
  const [direction, setDirection] = useState<"cgpa_to_pct" | "pct_to_cgpa">(
    "cgpa_to_pct"
  );
  const [cgpa, setCgpa] = useState(8.5);
  const [percentage, setPercentage] = useState(80.75);
  const [multiplier, setMultiplier] = useState(9.5); // CBSE/Standard factor 9.5

  let calculatedPct = 0;
  let calculatedCgpa = 0;

  if (direction === "cgpa_to_pct") {
    calculatedPct = Math.min(100, Math.max(0, cgpa * multiplier));
  } else {
    calculatedCgpa = Math.min(10, Math.max(0, percentage / (multiplier || 1)));
  }

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Conversion Mode</label>
          <CalcToggleGroup
            options={[
              { label: "CGPA → Percentage", value: "cgpa_to_pct" },
              { label: "Percentage → CGPA", value: "pct_to_cgpa" },
            ]}
            value={direction}
            onChange={setDirection}
            accent
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="calc-input-label">Grading Multiplier Factor</span>
            <span className="calc-input-value-badge">{multiplier}</span>
          </div>

          <div className="flex gap-2 mb-1">
            {[9.5, 10.0, 9.0].map((fact) => (
              <button
                key={fact}
                type="button"
                className={`calc-segmented-btn ${multiplier === fact ? "active" : ""}`}
                onClick={() => setMultiplier(fact)}
              >
                Factor {fact}
              </button>
            ))}
          </div>

          <CalcInputSlider
            label=""
            value={multiplier}
            onChange={setMultiplier}
            min={5}
            max={15}
            step={0.1}
          />
        </div>

        {direction === "cgpa_to_pct" ? (
          <CalcInputSlider
            label="Cumulative Grade Point Average (CGPA)"
            value={cgpa}
            onChange={setCgpa}
            min={0}
            max={10}
            step={0.05}
          />
        ) : (
          <CalcInputSlider
            label="Percentage (%)"
            value={percentage}
            onChange={setPercentage}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
          />
        )}
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label={direction === "cgpa_to_pct" ? "Equivalent Percentage" : "Equivalent CGPA"}
          value={
            direction === "cgpa_to_pct"
              ? `${calculatedPct.toFixed(2)}%`
              : `${calculatedCgpa.toFixed(2)} / 10`
          }
          subtext={`Calculated using ${multiplier}x scale factor`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label={direction === "cgpa_to_pct" ? "Input CGPA" : "Input Percentage"}
            value={
              direction === "cgpa_to_pct"
                ? `${cgpa} / 10`
                : `${percentage}%`
            }
          />
          <CalcResultStat
            label="Scale Multiplier"
            value={`${multiplier}x`}
          />
          <CalcResultStat
            label="Approx Class Grade"
            value={
              (direction === "cgpa_to_pct" ? calculatedPct : percentage) >= 75
                ? "First Class with Distinction"
                : (direction === "cgpa_to_pct" ? calculatedPct : percentage) >= 60
                ? "First Class"
                : (direction === "cgpa_to_pct" ? calculatedPct : percentage) >= 50
                ? "Second Class"
                : "Pass Grade"
            }
          />
          <CalcResultStat
            label="Max Possible Value"
            value={direction === "cgpa_to_pct" ? "100%" : "10.0 CGPA"}
          />
        </div>
      </div>
    </div>
  );
}
