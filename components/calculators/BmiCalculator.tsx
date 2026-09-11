"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
} from "./CalcSharedUI";

export function BmiCalculator() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  // Metric: cm, kg
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);

  // Imperial: feet, inches, lbs
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weightLbs, setWeightLbs] = useState(154);

  let bmi = 0;

  if (unitSystem === "metric") {
    const hM = heightCm / 100;
    if (hM > 0) {
      bmi = weightKg / (hM * hM);
    }
  } else {
    const totalInches = heightFt * 12 + heightIn;
    if (totalInches > 0) {
      bmi = (weightLbs / (totalInches * totalInches)) * 703;
    }
  }

  let category = "Normal";
  let categoryColor = "#10b981";
  let pointerPct = 50;

  if (bmi < 18.5) {
    category = "Underweight";
    categoryColor = "#38bdf8";
    pointerPct = Math.max(5, (bmi / 18.5) * 25);
  } else if (bmi <= 24.9) {
    category = "Normal Weight";
    categoryColor = "#10b981";
    pointerPct = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
  } else if (bmi <= 29.9) {
    category = "Overweight";
    categoryColor = "#fbbf24";
    pointerPct = 50 + ((bmi - 25) / (29.9 - 25)) * 25;
  } else {
    category = "Obese";
    categoryColor = "#f43f5e";
    pointerPct = Math.min(95, 75 + ((bmi - 30) / 10) * 20);
  }

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Unit System</label>
          <CalcToggleGroup
            options={[
              { label: "Metric (cm, kg)", value: "metric" },
              { label: "Imperial (ft, in, lbs)", value: "imperial" },
            ]}
            value={unitSystem}
            onChange={setUnitSystem}
            accent
          />
        </div>

        {unitSystem === "metric" ? (
          <>
            <CalcInputSlider
              label="Height (cm)"
              value={heightCm}
              onChange={setHeightCm}
              min={100}
              max={230}
              step={1}
              suffix=" cm"
            />
            <CalcInputSlider
              label="Weight (kg)"
              value={weightKg}
              onChange={setWeightKg}
              min={30}
              max={200}
              step={0.5}
              suffix=" kg"
            />
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <CalcInputSlider
                label="Height (Feet)"
                value={heightFt}
                onChange={setHeightFt}
                min={3}
                max={7}
                step={1}
                suffix=" ft"
              />
              <CalcInputSlider
                label="Height (Inches)"
                value={heightIn}
                onChange={setHeightIn}
                min={0}
                max={11}
                step={1}
                suffix=" in"
              />
            </div>
            <CalcInputSlider
              label="Weight (lbs)"
              value={weightLbs}
              onChange={setWeightLbs}
              min={60}
              max={450}
              step={1}
              suffix=" lbs"
            />
          </>
        )}
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Body Mass Index (BMI)"
          value={bmi > 0 ? bmi.toFixed(1) : "0.0"}
          subtext={`Category: ${category}`}
        />

        <div className="bmi-scale-wrapper">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span>Underweight</span>
            <span style={{ color: categoryColor }}>{category}</span>
            <span>Obese</span>
          </div>

          <div className="bmi-scale-bar">
            <div
              className="bmi-scale-pointer"
              style={{ left: `${pointerPct}%`, borderColor: categoryColor }}
            />
          </div>

          <div className="bmi-scale-labels">
            <span>&lt; 18.5</span>
            <span>18.5 - 24.9</span>
            <span>25 - 29.9</span>
            <span>&ge; 30.0</span>
          </div>
        </div>

        <div className="calc-result-grid mt-2">
          <CalcResultStat
            label="Healthy BMI Range"
            value="18.5 - 24.9"
          />
          <CalcResultStat
            label="Primary Status"
            value={category}
          />
        </div>
      </div>
    </div>
  );
}
