"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
} from "./CalcSharedUI";

export function HomeLoanPrepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState(250000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [remainingYears, setRemainingYears] = useState(20);
  const [prepaymentAmount, setPrepaymentAmount] = useState(30000);
  const [target, setTarget] = useState<"reduce_tenure" | "reduce_emi">(
    "reduce_tenure"
  );

  const months = remainingYears * 12;
  const r = interestRate / 12 / 100;

  // Original EMI and interest
  let origEmi = 0;
  if (r > 0 && months > 0) {
    origEmi =
      (loanAmount * r * Math.pow(1 + r, months)) /
      (Math.pow(1 + r, months) - 1);
  }
  const origTotalInterest = origEmi * months - loanAmount;

  // Post prepayment scenario
  const newBalance = Math.max(0, loanAmount - prepaymentAmount);

  let newEmi = origEmi;
  let newMonths = months;
  let newTotalInterest = 0;
  let interestSaved = 0;
  let monthsSaved = 0;

  if (target === "reduce_emi") {
    // Keep tenure same, lower EMI
    if (r > 0 && months > 0) {
      newEmi =
        (newBalance * r * Math.pow(1 + r, months)) /
        (Math.pow(1 + r, months) - 1);
    }
    newTotalInterest = newEmi * months - newBalance;
    interestSaved = Math.max(0, origTotalInterest - newTotalInterest);
  } else {
    // Keep EMI same, reduce tenure
    if (r > 0 && newEmi > 0 && newBalance > 0) {
      // log(EMI / (EMI - P * r)) / log(1 + r)
      const num = newEmi;
      const den = newEmi - newBalance * r;
      if (den > 0) {
        newMonths = Math.ceil(Math.log(num / den) / Math.log(1 + r));
      }
    }
    monthsSaved = Math.max(0, months - newMonths);
    newTotalInterest = newEmi * newMonths - newBalance;
    interestSaved = Math.max(0, origTotalInterest - newTotalInterest);
  }

  const formatCurrency = (val: number) =>
    "$" + Math.round(val).toLocaleString();

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Current Outstanding Loan Balance"
          value={loanAmount}
          onChange={setLoanAmount}
          min={10000}
          max={2000000}
          step={10000}
          prefix="$"
        />

        <CalcInputSlider
          label="Interest Rate"
          value={interestRate}
          onChange={setInterestRate}
          min={1}
          max={20}
          step={0.1}
          suffix="%"
        />

        <CalcInputSlider
          label="Remaining Loan Tenure"
          value={remainingYears}
          onChange={setRemainingYears}
          min={1}
          max={30}
          step={1}
          suffix=" Years"
        />

        <CalcInputSlider
          label="One-Time Prepayment Amount"
          value={prepaymentAmount}
          onChange={setPrepaymentAmount}
          min={1000}
          max={loanAmount}
          step={5000}
          prefix="$"
        />

        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Prepayment Optimization Target</label>
          <CalcToggleGroup
            options={[
              { label: "Reduce Loan Tenure", value: "reduce_tenure" },
              { label: "Reduce Monthly EMI", value: "reduce_emi" },
            ]}
            value={target}
            onChange={setTarget}
            accent
          />
        </div>
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Total Interest Saved"
          value={formatCurrency(interestSaved)}
          subtext={
            target === "reduce_tenure"
              ? `Loan paid off ${Math.floor(monthsSaved / 12)} years ${monthsSaved % 12} months earlier!`
              : `Monthly EMI reduced from ${formatCurrency(origEmi)} to ${formatCurrency(newEmi)}`
          }
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Original Monthly EMI"
            value={formatCurrency(origEmi)}
          />
          <CalcResultStat
            label="New Monthly EMI"
            value={formatCurrency(newEmi)}
          />
          <CalcResultStat
            label="New Remaining Tenure"
            value={`${(newMonths / 12).toFixed(1)} Years (${newMonths} mos)`}
          />
          <CalcResultStat
            label="Tenure Time Saved"
            value={`${Math.floor(monthsSaved / 12)} yrs ${monthsSaved % 12} mos`}
          />
        </div>
      </div>
    </div>
  );
}
