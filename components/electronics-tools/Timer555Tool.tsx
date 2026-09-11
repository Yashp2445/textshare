"use client";

import React, { useState } from "react";
import { CalcInputSlider, CalcToggleGroup, CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";

export function Timer555Tool() {
  const [config, setConfig] = useState<"astable" | "monostable">("astable");
  const [r1, setR1] = useState<number>(10000); // 10k
  const [r2, setR2] = useState<number>(100000); // 100k
  const [capUf, setCapUf] = useState<number>(10); // 10 uF

  const cFarads = capUf / 1000000;

  let freqHz = 0;
  let periodMs = 0;
  let dutyCycle = 0;
  let pulseWidthMs = 0;

  if (config === "astable") {
    // f = 1.44 / ((R1 + 2*R2) * C)
    const den = (r1 + 2 * r2) * cFarads;
    if (den > 0) {
      freqHz = 1.44 / den;
      periodMs = (1 / freqHz) * 1000;
      const tHigh = 0.693 * (r1 + r2) * cFarads;
      dutyCycle = (tHigh / (periodMs / 1000)) * 100;
    }
  } else {
    // T = 1.1 * R1 * C (monostable pulse width)
    pulseWidthMs = 1.1 * r1 * cFarads * 1000;
  }

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">555 Circuit Configuration</label>
          <CalcToggleGroup
            options={[
              { label: "Astable (Oscillator / Clock)", value: "astable" },
              { label: "Monostable (One-Shot Pulse)", value: "monostable" },
            ]}
            value={config}
            onChange={(val) => setConfig(val as any)}
            accent
          />
        </div>

        <CalcInputSlider
          label="Resistor R1"
          value={r1}
          onChange={setR1}
          min={1000}
          max={1000000}
          step={5000}
          suffix=" Ω"
        />

        {config === "astable" && (
          <CalcInputSlider
            label="Resistor R2"
            value={r2}
            onChange={setR2}
            min={1000}
            max={1000000}
            step={5000}
            suffix=" Ω"
          />
        )}

        <CalcInputSlider
          label="Timing Capacitor C"
          value={capUf}
          onChange={setCapUf}
          min={0.1}
          max={100}
          step={0.5}
          suffix=" µF"
        />
      </div>

      {/* Results */}
      <div className="calc-results-column">
        {config === "astable" ? (
          <>
            <CalcResultHero
              label="Oscillation Output Frequency"
              value={`${freqHz.toFixed(2)} Hz`}
              subtext={`Total Period: ${periodMs.toFixed(2)} ms`}
            />

            <div className="calc-result-grid">
              <CalcResultStat label="Frequency (Hz)" value={`${freqHz.toFixed(2)} Hz`} />
              <CalcResultStat label="Total Period (T)" value={`${periodMs.toFixed(2)} ms`} />
              <CalcResultStat label="Duty Cycle (%)" value={`${dutyCycle.toFixed(1)}%`} />
              <CalcResultStat label="Capacitor C" value={`${capUf} µF`} />
            </div>
          </>
        ) : (
          <>
            <CalcResultHero
              label="Output Pulse Width Duration"
              value={`${pulseWidthMs.toFixed(2)} ms`}
              subtext={`Time high (T = 1.1 × R1 × C)`}
            />

            <div className="calc-result-grid">
              <CalcResultStat label="Pulse Width (ms)" value={`${pulseWidthMs.toFixed(2)} ms`} />
              <CalcResultStat label="Pulse Width (Sec)" value={`${(pulseWidthMs / 1000).toFixed(3)} s`} />
              <CalcResultStat label="Resistor R1" value={`${(r1 / 1000).toFixed(1)} kΩ`} />
              <CalcResultStat label="Capacitor C" value={`${capUf} µF`} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
