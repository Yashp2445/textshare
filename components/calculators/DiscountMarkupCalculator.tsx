"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
} from "./CalcSharedUI";

export function DiscountMarkupCalculator() {
  const [mode, setMode] = useState<"discount" | "markup">("discount");
  const [price, setPrice] = useState(150);
  const [percent, setPercent] = useState(20);

  const deltaAmount = price * (percent / 100);
  const finalPrice =
    mode === "discount" ? Math.max(0, price - deltaAmount) : price + deltaAmount;

  const formatCurrency = (val: number) =>
    "$" + (Math.round(val * 100) / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Calculation Mode</label>
          <CalcToggleGroup
            options={[
              { label: "Discount (Price Off)", value: "discount" },
              { label: "Markup (Price Increase)", value: "markup" },
            ]}
            value={mode}
            onChange={setMode}
            accent
          />
        </div>

        <CalcInputSlider
          label="Original Base Price"
          value={price}
          onChange={setPrice}
          min={1}
          max={10000}
          step={5}
          prefix="$"
        />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="calc-input-label">
              {mode === "discount" ? "Discount Percentage" : "Markup Percentage"}
            </span>
            <span className="calc-input-value-badge">{percent}%</span>
          </div>

          <div className="flex gap-2 mb-1">
            {[10, 15, 20, 25, 50].map((pct) => (
              <button
                key={pct}
                type="button"
                className={`calc-segmented-btn ${percent === pct ? "active" : ""}`}
                onClick={() => setPercent(pct)}
              >
                {pct}%
              </button>
            ))}
          </div>

          <CalcInputSlider
            label=""
            value={percent}
            onChange={setPercent}
            min={0}
            max={100}
            step={1}
            suffix="%"
          />
        </div>
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label={mode === "discount" ? "Discounted Final Price" : "Marked-Up Final Price"}
          value={formatCurrency(finalPrice)}
          subtext={
            mode === "discount"
              ? `You save ${formatCurrency(deltaAmount)} (${percent}% OFF)`
              : `Added profit ${formatCurrency(deltaAmount)} (+${percent}%)`
          }
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Original Price"
            value={formatCurrency(price)}
          />
          <CalcResultStat
            label={mode === "discount" ? "Amount Saved" : "Markup Amount"}
            value={formatCurrency(deltaAmount)}
          />
          <CalcResultStat
            label="Percentage Applied"
            value={`${percent}%`}
          />
          <CalcResultStat
            label="Effective Multiplier"
            value={`${(finalPrice / (price || 1)).toFixed(2)}x`}
          />
        </div>
      </div>
    </div>
  );
}
