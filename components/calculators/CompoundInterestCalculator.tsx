"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
  GlassLineChart,
} from "./CalcSharedUI";

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7.5);
  const [frequency, setFrequency] = useState<"1" | "2" | "4" | "12">("1");
  const [years, setYears] = useState(10);

  const n = parseInt(frequency, 10);
  const r = rate / 100;

  const maturityValue = principal * Math.pow(1 + r / n, n * years);
  const totalInterest = Math.max(0, maturityValue - principal);

  // Growth data for line chart
  const growthData = [];
  for (let y = 1; y <= years; y++) {
    const val = principal * Math.pow(1 + r / n, n * y);
    growthData.push({
      year: y,
      invested: principal,
      total: Math.round(val),
    });
  }

  const formatCurrency = (val: number) =>
    "$" + Math.round(val).toLocaleString();

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Principal Amount"
          value={principal}
          onChange={setPrincipal}
          min={1000}
          max={1000000}
          step={1000}
          prefix="$"
        />

        <CalcInputSlider
          label="Annual Interest Rate"
          value={rate}
          onChange={setRate}
          min={0.5}
          max={25}
          step={0.25}
          suffix="%"
        />

        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Compounding Frequency</label>
          <CalcToggleGroup
            options={[
              { label: "Annual", value: "1" },
              { label: "Semi-Annual", value: "2" },
              { label: "Quarterly", value: "4" },
              { label: "Monthly", value: "12" },
            ]}
            value={frequency}
            onChange={setFrequency}
            accent
          />
        </div>

        <CalcInputSlider
          label="Time Horizon (Years)"
          value={years}
          onChange={setYears}
          min={1}
          max={40}
          step={1}
          suffix=" Years"
        />
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Total Compound Maturity Value"
          value={formatCurrency(maturityValue)}
          subtext={`Includes ${formatCurrency(totalInterest)} compound interest`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Initial Deposit"
            value={formatCurrency(principal)}
          />
          <CalcResultStat
            label="Total Interest Earned"
            value={formatCurrency(totalInterest)}
          />
          <CalcResultStat
            label="Effective APY Yield"
            value={`${((Math.pow(1 + r / n, n) - 1) * 100).toFixed(2)}%`}
          />
          <CalcResultStat
            label="Growth Multiple"
            value={`${(maturityValue / (principal || 1)).toFixed(2)}x`}
          />
        </div>

        <GlassLineChart
          data={growthData}
          label1="Principal"
          label2="Compounded Value"
        />
      </div>
    </div>
  );
}
