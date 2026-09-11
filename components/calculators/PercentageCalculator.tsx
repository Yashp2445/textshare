"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
} from "./CalcSharedUI";

export function PercentageCalculator() {
  const [mode, setMode] = useState<"pct_of" | "what_pct" | "change">("pct_of");

  // Mode 1: What is X% of Y?
  const [percentVal, setPercentVal] = useState(15);
  const [ofVal, setOfVal] = useState(250);

  // Mode 2: X is what % of Y?
  const [partVal, setPartVal] = useState(45);
  const [totalVal, setTotalVal] = useState(180);

  // Mode 3: % Increase/Decrease from X to Y
  const [fromVal, setFromVal] = useState(100);
  const [toVal, setToVal] = useState(125);

  let resultPrimary = "";
  let resultSub = "";

  if (mode === "pct_of") {
    const res = (percentVal / 100) * ofVal;
    resultPrimary = res.toLocaleString(undefined, { maximumFractionDigits: 4 });
    resultSub = `${percentVal}% of ${ofVal} is ${resultPrimary}`;
  } else if (mode === "what_pct") {
    const pct = totalVal !== 0 ? (partVal / totalVal) * 100 : 0;
    resultPrimary = `${pct.toFixed(2)}%`;
    resultSub = `${partVal} is ${resultPrimary} of ${totalVal}`;
  } else {
    const diff = toVal - fromVal;
    const pctChange = fromVal !== 0 ? (diff / Math.abs(fromVal)) * 100 : 0;
    resultPrimary = `${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(2)}%`;
    resultSub =
      diff >= 0
        ? `Increase of ${diff} (+${pctChange.toFixed(2)}%)`
        : `Decrease of ${Math.abs(diff)} (${pctChange.toFixed(2)}%)`;
  }

  return (
    <div className="calc-form-grid">
      {/* Mode Selector & Inputs */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Select Percentage Mode</label>
          <CalcToggleGroup
            options={[
              { label: "% of Number", value: "pct_of" },
              { label: "X is % of Y", value: "what_pct" },
              { label: "% Change", value: "change" },
            ]}
            value={mode}
            onChange={setMode}
            accent
          />
        </div>

        {mode === "pct_of" && (
          <>
            <CalcInputSlider
              label="Percentage (X%)"
              value={percentVal}
              onChange={setPercentVal}
              min={0}
              max={500}
              step={1}
              suffix="%"
            />
            <CalcInputSlider
              label="Total Amount (Y)"
              value={ofVal}
              onChange={setOfVal}
              min={0}
              max={100000}
              step={10}
            />
          </>
        )}

        {mode === "what_pct" && (
          <>
            <CalcInputSlider
              label="Partial Value (X)"
              value={partVal}
              onChange={setPartVal}
              min={0}
              max={100000}
              step={5}
            />
            <CalcInputSlider
              label="Total Value (Y)"
              value={totalVal}
              onChange={setTotalVal}
              min={1}
              max={100000}
              step={5}
            />
          </>
        )}

        {mode === "change" && (
          <>
            <CalcInputSlider
              label="Initial Value (X)"
              value={fromVal}
              onChange={setFromVal}
              min={0}
              max={100000}
              step={5}
            />
            <CalcInputSlider
              label="New Value (Y)"
              value={toVal}
              onChange={setToVal}
              min={0}
              max={100000}
              step={5}
            />
          </>
        )}
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Calculated Result"
          value={resultPrimary}
          subtext={resultSub}
        />

        <div className="calc-result-grid">
          {mode === "pct_of" && (
            <>
              <CalcResultStat label="Original Value" value={ofVal.toLocaleString()} />
              <CalcResultStat label="Percentage" value={`${percentVal}%`} />
              <CalcResultStat
                label="Amount After Adding X%"
                value={(ofVal + (percentVal / 100) * ofVal).toLocaleString()}
              />
              <CalcResultStat
                label="Amount After Subtracting X%"
                value={(ofVal - (percentVal / 100) * ofVal).toLocaleString()}
              />
            </>
          )}

          {mode === "what_pct" && (
            <>
              <CalcResultStat label="Part Value" value={partVal.toLocaleString()} />
              <CalcResultStat label="Total Value" value={totalVal.toLocaleString()} />
              <CalcResultStat
                label="Remaining Difference"
                value={(totalVal - partVal).toLocaleString()}
              />
              <CalcResultStat
                label="Remaining Percentage"
                value={`${(100 - (partVal / (totalVal || 1)) * 100).toFixed(2)}%`}
              />
            </>
          )}

          {mode === "change" && (
            <>
              <CalcResultStat label="Initial Value" value={fromVal.toLocaleString()} />
              <CalcResultStat label="Final Value" value={toVal.toLocaleString()} />
              <CalcResultStat
                label="Absolute Difference"
                value={Math.abs(toVal - fromVal).toLocaleString()}
              />
              <CalcResultStat
                label="Multiplier Ratio"
                value={`${(toVal / (fromVal || 1)).toFixed(3)}x`}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
