"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcResultHero,
  CalcResultStat,
} from "./CalcSharedUI";

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState(120);
  const [tipPercent, setTipPercent] = useState(15);
  const [peopleCount, setPeopleCount] = useState(3);

  const totalTip = billAmount * (tipPercent / 100);
  const grandTotal = billAmount + totalTip;

  const validPeople = Math.max(1, peopleCount);
  const tipPerPerson = totalTip / validPeople;
  const totalPerPerson = grandTotal / validPeople;

  const formatCurrency = (val: number) =>
    "$" + (Math.round(val * 100) / 100).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Bill Subtotal Amount"
          value={billAmount}
          onChange={setBillAmount}
          min={5}
          max={2000}
          step={5}
          prefix="$"
        />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="calc-input-label">Tip Percentage</span>
            <span className="calc-input-value-badge">{tipPercent}%</span>
          </div>

          <div className="flex gap-2 mb-1">
            {[10, 15, 18, 20, 25].map((pct) => (
              <button
                key={pct}
                type="button"
                className={`calc-segmented-btn ${tipPercent === pct ? "active" : ""}`}
                onClick={() => setTipPercent(pct)}
              >
                {pct}%
              </button>
            ))}
          </div>

          <CalcInputSlider
            label=""
            value={tipPercent}
            onChange={setTipPercent}
            min={0}
            max={50}
            step={1}
            suffix="%"
          />
        </div>

        <CalcInputSlider
          label="Split Between (People)"
          value={peopleCount}
          onChange={setPeopleCount}
          min={1}
          max={30}
          step={1}
          suffix=" Person(s)"
        />
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Total Owed Per Person"
          value={formatCurrency(totalPerPerson)}
          subtext={`Includes ${formatCurrency(tipPerPerson)} tip per person`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Total Tip Amount"
            value={formatCurrency(totalTip)}
          />
          <CalcResultStat
            label="Grand Total Bill"
            value={formatCurrency(grandTotal)}
          />
          <CalcResultStat
            label="Bill Split Count"
            value={`${validPeople} ${validPeople === 1 ? "Person" : "People"}`}
          />
          <CalcResultStat
            label="Tip Per Person"
            value={formatCurrency(tipPerPerson)}
          />
        </div>
      </div>
    </div>
  );
}
