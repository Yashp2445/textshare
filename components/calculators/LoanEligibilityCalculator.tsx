"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcResultHero,
  CalcResultStat,
} from "./CalcSharedUI";
import { Info } from "lucide-react";

export function LoanEligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(8000);
  const [existingEmis, setExistingEmis] = useState(1200);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [foirLimit, setFoirLimit] = useState(50); // Debt-to-income assumption (50%)

  const maxAllowedEmi = Math.max(0, monthlyIncome * (foirLimit / 100) - existingEmis);
  const tenureMonths = tenureYears * 12;
  const monthlyRate = interestRate / 12 / 100;

  let maxLoanAmount = 0;
  if (monthlyRate > 0 && tenureMonths > 0 && maxAllowedEmi > 0) {
    maxLoanAmount =
      (maxAllowedEmi * (Math.pow(1 + monthlyRate, tenureMonths) - 1)) /
      (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths));
  }

  const formatCurrency = (val: number) =>
    "$" + Math.round(val).toLocaleString();

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Net Monthly Income"
          value={monthlyIncome}
          onChange={setMonthlyIncome}
          min={1000}
          max={100000}
          step={500}
          prefix="$"
        />

        <CalcInputSlider
          label="Existing Monthly Obligations / EMIs"
          value={existingEmis}
          onChange={setExistingEmis}
          min={0}
          max={monthlyIncome}
          step={100}
          prefix="$"
        />

        <CalcInputSlider
          label="Expected Interest Rate"
          value={interestRate}
          onChange={setInterestRate}
          min={1}
          max={25}
          step={0.1}
          suffix="%"
        />

        <CalcInputSlider
          label="Desired Loan Tenure"
          value={tenureYears}
          onChange={setTenureYears}
          min={1}
          max={30}
          step={1}
          suffix=" Years"
        />
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Estimated Max Loan Amount"
          value={formatCurrency(maxLoanAmount)}
          subtext={`Based on ${foirLimit}% max debt-to-income ratio`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Available Monthly Capacity"
            value={formatCurrency(maxAllowedEmi)}
          />
          <CalcResultStat
            label="Current Debt Ratio"
            value={`${((existingEmis / (monthlyIncome || 1)) * 100).toFixed(1)}%`}
          />
          <CalcResultStat
            label="Tenure Period"
            value={`${tenureMonths} Months`}
          />
          <CalcResultStat
            label="Rate of Interest"
            value={`${interestRate}%`}
          />
        </div>

        <div className="status-banner" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-dim)" }}>
          <Info size={18} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: "1.4" }}>
            Note: This is an estimated calculation based on a standard {foirLimit}% Debt-to-Income (FOIR) limit. Final loan eligibility depends on your credit score, employer category, and lender evaluation.
          </span>
        </div>
      </div>
    </div>
  );
}
