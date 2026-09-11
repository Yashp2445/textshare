"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
  GlassDonutChart,
} from "./CalcSharedUI";

export function GstCalculator() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<"forward" | "backward">("forward");

  let baseAmount = 0;
  let gstAmount = 0;
  let finalTotal = 0;

  if (mode === "forward") {
    // Add GST to base amount
    baseAmount = amount;
    gstAmount = amount * (gstRate / 100);
    finalTotal = baseAmount + gstAmount;
  } else {
    // Extract GST from total amount
    finalTotal = amount;
    baseAmount = amount / (1 + gstRate / 100);
    gstAmount = finalTotal - baseAmount;
  }

  const formatCurrency = (val: number) =>
    "$" + (Math.round(val * 100) / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="calc-form-grid">
      {/* Form Controls */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">GST Calculation Mode</label>
          <CalcToggleGroup
            options={[
              { label: "Add GST (Exclusive)", value: "forward" },
              { label: "Extract GST (Inclusive)", value: "backward" },
            ]}
            value={mode}
            onChange={setMode}
            accent
          />
        </div>

        <CalcInputSlider
          label={mode === "forward" ? "Initial Net Amount" : "Total Gross Amount"}
          value={amount}
          onChange={setAmount}
          min={10}
          max={1000000}
          step={10}
          prefix="$"
        />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="calc-input-label">GST Tax Rate</span>
            <span className="calc-input-value-badge">{gstRate}%</span>
          </div>

          {/* Quick preset buttons */}
          <div className="flex gap-2 mb-1">
            {[5, 12, 18, 28].map((rate) => (
              <button
                key={rate}
                type="button"
                className={`calc-segmented-btn ${gstRate === rate ? "active" : ""}`}
                onClick={() => setGstRate(rate)}
              >
                {rate}%
              </button>
            ))}
          </div>

          <CalcInputSlider
            label=""
            value={gstRate}
            onChange={setGstRate}
            min={0}
            max={50}
            step={0.5}
            suffix="%"
          />
        </div>
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label={mode === "forward" ? "Final Total (Incl. GST)" : "Extracted Base Amount"}
          value={formatCurrency(mode === "forward" ? finalTotal : baseAmount)}
          subtext={`GST Rate applied: ${gstRate}%`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Base Amount"
            value={formatCurrency(baseAmount)}
          />
          <CalcResultStat
            label="GST Tax Amount"
            value={formatCurrency(gstAmount)}
          />
          <CalcResultStat
            label="Gross Total"
            value={formatCurrency(finalTotal)}
          />
          <CalcResultStat
            label="Effective Tax Ratio"
            value={`${((gstAmount / (finalTotal || 1)) * 100).toFixed(1)}%`}
          />
        </div>

        <GlassDonutChart
          val1={baseAmount}
          val2={gstAmount}
          label1="Base Price"
          label2="GST Tax"
          color1="#a855f7"
          color2="#f43f5e"
          centerVal={formatCurrency(gstAmount)}
          centerLabel="Tax Amount"
        />
      </div>
    </div>
  );
}
