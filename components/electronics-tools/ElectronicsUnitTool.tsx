"use client";

import React, { useState } from "react";
import { CalcToggleGroup, CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";

export function ElectronicsUnitTool() {
  const [category, setCategory] = useState<"dbm" | "awg" | "freq">("dbm");

  // dBm <-> Watts
  const [dbm, setDbm] = useState<number>(20); // 20 dBm = 100 mW = 0.1 W

  // AWG -> mm2
  const [awg, setAwg] = useState<number>(18); // 18 AWG = ~0.823 mm2

  // Freq -> Wavelength (in MHz)
  const [freqMhz, setFreqMhz] = useState<number>(2400); // 2.4 GHz WiFi

  // Conversions
  const watts = Math.pow(10, (dbm - 30) / 10);
  const mw = watts * 1000;

  // AWG formula: d = 0.127 * 92^((36 - AWG)/39) mm
  const dMm = 0.127 * Math.pow(92, (36 - awg) / 39);
  const areaMm2 = Math.PI * Math.pow(dMm / 2, 2);

  // Wavelength = c / f (c ~ 3e8 m/s, f in Hz)
  const wavelengthMeters = freqMhz > 0 ? 299.792458 / freqMhz : 0;

  return (
    <div className="calc-form-grid">
      {/* Category & Inputs */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Electronics Conversion Category</label>
          <CalcToggleGroup
            options={[
              { label: "dBm ↔ Watts", value: "dbm" },
              { label: "AWG Wire Gauge", value: "awg" },
              { label: "Frequency ↔ Wavelength", value: "freq" },
            ]}
            value={category}
            onChange={(val) => setCategory(val as any)}
            accent
          />
        </div>

        {category === "dbm" && (
          <div className="calc-input-box">
            <label className="calc-input-label">RF Power in dBm</label>
            <div className="calc-num-input-wrapper">
              <input
                type="number"
                className="calc-num-input"
                value={dbm}
                onChange={(e) => setDbm(parseFloat(e.target.value) || 0)}
              />
              <span className="calc-prefix-suffix ml-1">dBm</span>
            </div>
          </div>
        )}

        {category === "awg" && (
          <div className="calc-input-box">
            <label className="calc-input-label">American Wire Gauge (AWG)</label>
            <div className="calc-num-input-wrapper">
              <input
                type="number"
                className="calc-num-input"
                min={0}
                max={40}
                value={awg}
                onChange={(e) => setAwg(parseInt(e.target.value, 10) || 0)}
              />
              <span className="calc-prefix-suffix ml-1">AWG</span>
            </div>
          </div>
        )}

        {category === "freq" && (
          <div className="calc-input-box">
            <label className="calc-input-label">Frequency (MHz)</label>
            <div className="calc-num-input-wrapper">
              <input
                type="number"
                className="calc-num-input"
                value={freqMhz}
                onChange={(e) => setFreqMhz(parseFloat(e.target.value) || 0)}
              />
              <span className="calc-prefix-suffix ml-1">MHz</span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="calc-results-column">
        {category === "dbm" && (
          <>
            <CalcResultHero label="Equivalent Power in Watts" value={`${watts.toFixed(6)} W`} subtext={`${mw.toFixed(2)} mW`} />
            <div className="calc-result-grid">
              <CalcResultStat label="dBm Input" value={`${dbm} dBm`} />
              <CalcResultStat label="Milliwatts (mW)" value={`${mw.toFixed(2)} mW`} />
              <CalcResultStat label="Watts (W)" value={`${watts.toFixed(6)} W`} />
              <CalcResultStat label="Formula" value="10^((dBm-30)/10)" />
            </div>
          </>
        )}

        {category === "awg" && (
          <>
            <CalcResultHero label="Cross-Sectional Area" value={`${areaMm2.toFixed(3)} mm²`} subtext={`Diameter: ${dMm.toFixed(3)} mm`} />
            <div className="calc-result-grid">
              <CalcResultStat label="AWG Size" value={`${awg} AWG`} />
              <CalcResultStat label="Diameter (mm)" value={`${dMm.toFixed(3)} mm`} />
              <CalcResultStat label="Cross Area (mm²)" value={`${areaMm2.toFixed(3)} mm²`} />
              <CalcResultStat label="Diameter (Inches)" value={`${(dMm / 25.4).toFixed(4)} in`} />
            </div>
          </>
        )}

        {category === "freq" && (
          <>
            <CalcResultHero label="Free-Space Wavelength (λ)" value={`${wavelengthMeters.toFixed(3)} Meters`} subtext={`${(wavelengthMeters * 100).toFixed(2)} cm`} />
            <div className="calc-result-grid">
              <CalcResultStat label="Frequency" value={`${freqMhz} MHz`} />
              <CalcResultStat label="Wavelength (m)" value={`${wavelengthMeters.toFixed(3)} m`} />
              <CalcResultStat label="Quarter-Wave λ/4" value={`${(wavelengthMeters * 25).toFixed(2)} cm`} />
              <CalcResultStat label="Speed of Light (c)" value="299,792,458 m/s" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
