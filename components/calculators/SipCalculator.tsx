"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcResultHero,
  CalcResultStat,
  GlassLineChart,
} from "./CalcSharedUI";

export function SipCalculator() {
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);

  const months = years * 12;
  const i = annualReturn / 12 / 100;

  let maturityVal = 0;
  let totalInvested = monthlyInvest * months;

  if (i > 0) {
    maturityVal =
      monthlyInvest * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
  } else {
    maturityVal = totalInvested;
  }

  const estimatedReturns = Math.max(0, maturityVal - totalInvested);

  // Generate annual growth data for line chart
  const growthData = [];
  for (let y = 1; y <= years; y++) {
    const m = y * 12;
    const inv = monthlyInvest * m;
    const val =
      i > 0
        ? monthlyInvest * ((Math.pow(1 + i, m) - 1) / i) * (1 + i)
        : inv;
    growthData.push({
      year: y,
      invested: Math.round(inv),
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
          label="Monthly Investment"
          value={monthlyInvest}
          onChange={setMonthlyInvest}
          min={500}
          max={500000}
          step={500}
          prefix="$"
        />

        <CalcInputSlider
          label="Expected Annual Return Rate"
          value={annualReturn}
          onChange={setAnnualReturn}
          min={1}
          max={30}
          step={0.5}
          suffix="%"
        />

        <CalcInputSlider
          label="Investment Duration"
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
          label="Total Expected Value"
          value={formatCurrency(maturityVal)}
          subtext={`Compounded over ${years} years`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Total Invested"
            value={formatCurrency(totalInvested)}
          />
          <CalcResultStat
            label="Estimated Returns"
            value={formatCurrency(estimatedReturns)}
          />
          <CalcResultStat
            label="Wealth Gain Ratio"
            value={`${(maturityVal / (totalInvested || 1)).toFixed(2)}x`}
          />
          <CalcResultStat
            label="Profit Percentage"
            value={`${((estimatedReturns / (totalInvested || 1)) * 100).toFixed(1)}%`}
          />
        </div>

        <GlassLineChart
          data={growthData}
          label1="Invested Amount"
          label2="Total Value"
        />
      </div>
    </div>
  );
}
