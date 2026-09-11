"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcToggleGroup,
  CalcResultHero,
  CalcResultStat,
  GlassDonutChart,
} from "./CalcSharedUI";

export function SalaryInHandCalculator() {
  const [payPeriod, setPayPeriod] = useState<"annual" | "monthly">("annual");
  const [grossSalary, setGrossSalary] = useState(120000);
  const [pfPercent, setPfPercent] = useState(12);
  const [profTaxMonthly, setProfTaxMonthly] = useState(200);
  const [otherDeductions, setOtherDeductions] = useState(5000);

  const annualGross = payPeriod === "annual" ? grossSalary : grossSalary * 12;
  const monthlyGross = annualGross / 12;

  const annualPf = (annualGross * pfPercent) / 100;
  const annualProfTax = profTaxMonthly * 12;
  const annualOther = payPeriod === "annual" ? otherDeductions : otherDeductions * 12;

  const totalDeductions = annualPf + annualProfTax + annualOther;
  const annualInHand = Math.max(0, annualGross - totalDeductions);
  const monthlyInHand = annualInHand / 12;

  const formatCurrency = (val: number) =>
    "$" + Math.round(val).toLocaleString();

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Salary Input Frequency</label>
          <CalcToggleGroup
            options={[
              { label: "Annual Package (CTC)", value: "annual" },
              { label: "Monthly Gross Salary", value: "monthly" },
            ]}
            value={payPeriod}
            onChange={setPayPeriod}
          />
        </div>

        <CalcInputSlider
          label={payPeriod === "annual" ? "Gross Annual Salary (CTC)" : "Gross Monthly Salary"}
          value={grossSalary}
          onChange={setGrossSalary}
          min={payPeriod === "annual" ? 10000 : 1000}
          max={payPeriod === "annual" ? 500000 : 50000}
          step={payPeriod === "annual" ? 5000 : 500}
          prefix="$"
        />

        <CalcInputSlider
          label="Provident Fund (PF) Contribution"
          value={pfPercent}
          onChange={setPfPercent}
          min={0}
          max={20}
          step={1}
          suffix="%"
        />

        <CalcInputSlider
          label="Professional Tax (Monthly)"
          value={profTaxMonthly}
          onChange={setProfTaxMonthly}
          min={0}
          max={1000}
          step={50}
          prefix="$"
        />

        <CalcInputSlider
          label={payPeriod === "annual" ? "Annual Tax & Other Deductions" : "Monthly Tax & Other Deductions"}
          value={otherDeductions}
          onChange={setOtherDeductions}
          min={0}
          max={payPeriod === "annual" ? 100000 : 10000}
          step={500}
          prefix="$"
        />
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Estimated Monthly In-Hand Salary"
          value={formatCurrency(monthlyInHand)}
          subtext={`Annual Take-Home: ${formatCurrency(annualInHand)}`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Gross Monthly"
            value={formatCurrency(monthlyGross)}
          />
          <CalcResultStat
            label="Monthly PF Deduction"
            value={formatCurrency(annualPf / 12)}
          />
          <CalcResultStat
            label="Monthly Professional Tax"
            value={formatCurrency(profTaxMonthly)}
          />
          <CalcResultStat
            label="Other Monthly Deductions"
            value={formatCurrency(annualOther / 12)}
          />
        </div>

        <GlassDonutChart
          val1={annualInHand}
          val2={totalDeductions}
          label1="Take-Home Pay"
          label2="Total Deductions"
          color1="#10b981"
          color2="#fbbf24"
          centerVal={formatCurrency(monthlyInHand)}
          centerLabel="Monthly Net"
        />
      </div>
    </div>
  );
}
