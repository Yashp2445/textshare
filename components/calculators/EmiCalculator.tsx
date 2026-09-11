"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
  GlassDonutChart,
} from "./CalcSharedUI";

export function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(15);
  const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");

  const tenureInMonths = tenureUnit === "years" ? tenure * 12 : tenure;
  const monthlyRate = interestRate / 12 / 100;

  let emi = 0;
  let totalAmount = 0;
  let totalInterest = 0;

  if (monthlyRate > 0 && tenureInMonths > 0) {
    emi =
      (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, tenureInMonths)) /
      (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
    totalAmount = emi * tenureInMonths;
    totalInterest = totalAmount - loanAmount;
  } else if (tenureInMonths > 0) {
    emi = loanAmount / tenureInMonths;
    totalAmount = loanAmount;
    totalInterest = 0;
  }

  const formatCurrency = (val: number) =>
    "$" + Math.round(val).toLocaleString();

  return (
    <div className="calc-form-grid">
      {/* Input Form Column */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Loan Amount"
          value={loanAmount}
          onChange={setLoanAmount}
          min={10000}
          max={20000000}
          step={10000}
          prefix="$"
        />

        <CalcInputSlider
          label="Annual Interest Rate"
          value={interestRate}
          onChange={setInterestRate}
          min={1}
          max={25}
          step={0.1}
          suffix="%"
        />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="calc-input-label">Tenure</span>
            <div className="w-36">
              <CalcToggleGroup
                options={[
                  { label: "Years", value: "years" },
                  { label: "Months", value: "months" },
                ]}
                value={tenureUnit}
                onChange={setTenureUnit}
              />
            </div>
          </div>
          <CalcInputSlider
            label=""
            value={tenure}
            onChange={setTenure}
            min={1}
            max={tenureUnit === "years" ? 30 : 360}
            step={1}
            suffix={` ${tenureUnit}`}
          />
        </div>
      </div>

      {/* Results Column */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Monthly EMI"
          value={formatCurrency(emi)}
          subtext={`Over ${tenureInMonths} total payments`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Principal Amount"
            value={formatCurrency(loanAmount)}
          />
          <CalcResultStat
            label="Total Interest"
            value={formatCurrency(totalInterest)}
          />
          <CalcResultStat
            label="Total Amount Payable"
            value={formatCurrency(totalAmount)}
          />
          <CalcResultStat
            label="Interest % of Total"
            value={`${((totalInterest / (totalAmount || 1)) * 100).toFixed(1)}%`}
          />
        </div>

        <GlassDonutChart
          val1={loanAmount}
          val2={totalInterest}
          label1="Principal"
          label2="Interest"
          centerVal={formatCurrency(emi)}
          centerLabel="EMI / mo"
        />
      </div>
    </div>
  );
}
