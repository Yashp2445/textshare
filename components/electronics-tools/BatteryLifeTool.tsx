"use client";

import React, { useState } from "react";
import { CalcInputSlider, CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";

export function BatteryLifeTool() {
  const [capacity, setCapacity] = useState<number>(2500); // mAh
  const [currentDraw, setCurrentDraw] = useState<number>(150); // mA
  const [derating, setDerating] = useState<number>(85); // 85% effective

  const effectiveCapacity = capacity * (derating / 100);
  const runtimeHours = currentDraw > 0 ? effectiveCapacity / currentDraw : 0;
  const runtimeDays = runtimeHours / 24;

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Battery Capacity"
          value={capacity}
          onChange={setCapacity}
          min={100}
          max={50000}
          step={100}
          suffix=" mAh"
        />

        <CalcInputSlider
          label="Average Device Current Draw"
          value={currentDraw}
          onChange={setCurrentDraw}
          min={1}
          max={5000}
          step={10}
          suffix=" mA"
        />

        <CalcInputSlider
          label="Efficiency Derating Factor"
          value={derating}
          onChange={setDerating}
          min={50}
          max={100}
          step={5}
          suffix="%"
        />
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Estimated Operating Runtime"
          value={`${runtimeHours.toFixed(1)} Hours`}
          subtext={`Approximately ${runtimeDays.toFixed(2)} Days of continuous operation`}
        />

        <div className="calc-result-grid">
          <CalcResultStat label="Effective Capacity" value={`${effectiveCapacity.toFixed(0)} mAh`} />
          <CalcResultStat label="Current Draw" value={`${currentDraw} mA`} />
          <CalcResultStat label="Runtime (Days)" value={`${runtimeDays.toFixed(2)} Days`} />
          <CalcResultStat label="Runtime (Months)" value={`${(runtimeDays / 30.4).toFixed(2)} Months`} />
        </div>
      </div>
    </div>
  );
}
