"use client";

import React, { useState } from "react";
import { CalcInputSlider, CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";

export function LedResistorTool() {
  const [vs, setVs] = useState<number>(9); // Supply V
  const [vf, setVf] = useState<number>(2.1); // LED Vf (Red ~2.1V, Blue ~3.2V)
  const [ifMa, setIfMa] = useState<number>(20); // Current mA

  const vDrop = Math.max(0, vs - vf);
  const ifAmps = ifMa / 1000;
  const resistorVal = ifAmps > 0 ? vDrop / ifAmps : 0;
  const powerMw = vDrop * ifMa;

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Supply Voltage (Vs)"
          value={vs}
          onChange={setVs}
          min={3}
          max={48}
          step={0.5}
          suffix=" V"
        />

        <CalcInputSlider
          label="LED Forward Voltage (Vf)"
          value={vf}
          onChange={setVf}
          min={1.2}
          max={4.0}
          step={0.1}
          suffix=" V"
        />

        <CalcInputSlider
          label="Desired LED Current (If)"
          value={ifMa}
          onChange={setIfMa}
          min={5}
          max={50}
          step={1}
          suffix=" mA"
        />
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Limiting Resistor Value"
          value={`${Math.ceil(resistorVal)} Ω`}
          subtext={`Exact calculated value: ${resistorVal.toFixed(1)} Ω`}
        />

        <div className="calc-result-grid">
          <CalcResultStat label="Voltage Drop (Vs - Vf)" value={`${vDrop.toFixed(2)} V`} />
          <CalcResultStat label="LED Current (If)" value={`${ifMa} mA`} />
          <CalcResultStat label="Resistor Power" value={`${powerMw.toFixed(1)} mW`} />
          <CalcResultStat label="Recommended Rating" value={powerMw > 250 ? "1/2 Watt (0.5W)" : "1/4 Watt (0.25W)"} />
        </div>
      </div>
    </div>
  );
}
