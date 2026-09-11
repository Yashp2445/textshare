"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
  GlassDonutChart,
} from "./CalcSharedUI";

export function FdRdCalculator() {
  const [type, setType] = useState<"fd" | "rd">("fd");
  const [amount, setAmount] = useState(50000); // Principal for FD, Monthly for RD
  const [rate, setRate] = useState(7.0);
  const [tenureYears, setTenureYears] = useState(3);

  let totalDeposit = 0;
  let maturityVal = 0;
  let totalInterest = 0;

  if (type === "fd") {
    totalDeposit = amount;
    // Standard quarterly compounding for FDs
    const n = 4;
    const r = rate / 100;
    maturityVal = amount * Math.pow(1 + r / n, n * tenureYears);
    totalInterest = Math.max(0, maturityVal - totalDeposit);
  } else {
    // Recurring Deposit (RD) monthly deposit calculation
    const months = tenureYears * 12;
    totalDeposit = amount * months;
    const r = rate / 100;
    // Standard quarterly compounding formula for RD
    let sum = 0;
    for (let m = 1; m <= months; m++) {
      const timeInYears = (months - m + 1) / 12;
      sum += amount * Math.pow(1 + r / 4, 4 * timeInYears);
    }
    maturityVal = sum;
    totalInterest = Math.max(0, maturityVal - totalDeposit);
  }

  const formatCurrency = (val: number) =>
    "$" + Math.round(val).toLocaleString();

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Deposit Type</label>
          <CalcToggleGroup
            options={[
              { label: "Fixed Deposit (FD)", value: "fd" },
              { label: "Recurring Deposit (RD)", value: "rd" },
            ]}
            value={type}
            onChange={setType}
            accent
          />
        </div>

        <CalcInputSlider
          label={type === "fd" ? "Lump-Sum Investment Amount" : "Monthly Deposit Amount"}
          value={amount}
          onChange={setAmount}
          min={type === "fd" ? 5000 : 500}
          max={type === "fd" ? 1000000 : 100000}
          step={type === "fd" ? 5000 : 500}
          prefix="$"
        />

        <CalcInputSlider
          label="Interest Rate per Annum"
          value={rate}
          onChange={setRate}
          min={1}
          max={18}
          step={0.1}
          suffix="%"
        />

        <CalcInputSlider
          label="Tenure Period"
          value={tenureYears}
          onChange={setTenureYears}
          min={1}
          max={10}
          step={1}
          suffix=" Years"
        />
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label={`${type.toUpperCase()} Maturity Amount`}
          value={formatCurrency(maturityVal)}
          subtext={`Includes ${formatCurrency(totalInterest)} in total interest earned`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Total Amount Deposited"
            value={formatCurrency(totalDeposit)}
          />
          <CalcResultStat
            label="Total Interest Earned"
            value={formatCurrency(totalInterest)}
          />
          <CalcResultStat
            label="Investment Tenure"
            value={`${tenureYears * 12} Months`}
          />
          <CalcResultStat
            label="Return on Investment"
            value={`${((totalInterest / (totalDeposit || 1)) * 100).toFixed(1)}%`}
          />
        </div>

        <GlassDonutChart
          val1={totalDeposit}
          val2={totalInterest}
          label1="Principal Deposited"
          label2="Interest Earned"
          color1="#38bdf8"
          color2="#10b981"
          centerVal={formatCurrency(totalInterest)}
          centerLabel="Interest"
        />
      </div>
    </div>
  );
}
