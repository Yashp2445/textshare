"use client";

import React, { useState } from "react";
import { CalcToggleGroup, CalcResultHero, CalcResultStat } from "./CalcSharedUI";
import { ArrowLeftRight } from "lucide-react";

type UnitCategory = "length" | "weight" | "temperature" | "speed" | "area" | "volume";

interface UnitOption {
  label: string;
  value: string;
  // ratio to base unit
  ratio?: number;
}

const UNIT_SPECS: Record<UnitCategory, { name: string; units: UnitOption[] }> = {
  length: {
    name: "Length & Distance",
    units: [
      { label: "Meters (m)", value: "m", ratio: 1 },
      { label: "Kilometers (km)", value: "km", ratio: 1000 },
      { label: "Centimeters (cm)", value: "cm", ratio: 0.01 },
      { label: "Millimeters (mm)", value: "mm", ratio: 0.001 },
      { label: "Inches (in)", value: "in", ratio: 0.0254 },
      { label: "Feet (ft)", value: "ft", ratio: 0.3048 },
      { label: "Yards (yd)", value: "yd", ratio: 0.9144 },
      { label: "Miles (mi)", value: "mi", ratio: 1609.34 },
    ],
  },
  weight: {
    name: "Weight & Mass",
    units: [
      { label: "Kilograms (kg)", value: "kg", ratio: 1 },
      { label: "Grams (g)", value: "g", ratio: 0.001 },
      { label: "Milligrams (mg)", value: "mg", ratio: 0.000001 },
      { label: "Pounds (lbs)", value: "lbs", ratio: 0.453592 },
      { label: "Ounces (oz)", value: "oz", ratio: 0.0283495 },
      { label: "Metric Tons (t)", value: "t", ratio: 1000 },
    ],
  },
  temperature: {
    name: "Temperature",
    units: [
      { label: "Celsius (°C)", value: "c" },
      { label: "Fahrenheit (°F)", value: "f" },
      { label: "Kelvin (K)", value: "k" },
    ],
  },
  speed: {
    name: "Speed & Velocity",
    units: [
      { label: "Kilometers / Hour (km/h)", value: "kmh", ratio: 1 },
      { label: "Miles / Hour (mph)", value: "mph", ratio: 1.60934 },
      { label: "Meters / Second (m/s)", value: "ms", ratio: 3.6 },
      { label: "Knots (kt)", value: "kt", ratio: 1.852 },
    ],
  },
  area: {
    name: "Surface Area",
    units: [
      { label: "Square Meters (m²)", value: "sqm", ratio: 1 },
      { label: "Square Feet (ft²)", value: "sqft", ratio: 0.092903 },
      { label: "Square Kilometers (km²)", value: "sqkm", ratio: 1000000 },
      { label: "Acres", value: "acre", ratio: 4046.86 },
      { label: "Hectares (ha)", value: "ha", ratio: 10000 },
    ],
  },
  volume: {
    name: "Volume & Capacity",
    units: [
      { label: "Liters (L)", value: "l", ratio: 1 },
      { label: "Milliliters (mL)", value: "ml", ratio: 0.001 },
      { label: "Cubic Meters (m³)", value: "cum", ratio: 1000 },
      { label: "Gallons (US)", value: "gal", ratio: 3.78541 },
      { label: "Fluid Ounces (fl oz)", value: "floz", ratio: 0.0295735 },
    ],
  },
};

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const spec = UNIT_SPECS[category];

  const [fromUnit, setFromUnit] = useState<string>(spec.units[0].value);
  const [toUnit, setToUnit] = useState<string>(spec.units[1].value);
  const [valFrom, setValFrom] = useState<number>(1);

  // Sync default units when category changes
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const newSpec = UNIT_SPECS[cat];
    setFromUnit(newSpec.units[0].value);
    setToUnit(newSpec.units[1].value);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  // Conversion logic
  const convertVal = (val: number, from: string, to: string): number => {
    if (isNaN(val)) return 0;
    if (from === to) return val;

    if (category === "temperature") {
      // Temp conversion
      let celsius = val;
      if (from === "f") celsius = ((val - 32) * 5) / 9;
      if (from === "k") celsius = val - 273.15;

      if (to === "c") return celsius;
      if (to === "f") return (celsius * 9) / 5 + 32;
      if (to === "k") return celsius + 273.15;
      return celsius;
    } else {
      const uFrom = spec.units.find((u) => u.value === from);
      const uTo = spec.units.find((u) => u.value === to);
      if (!uFrom || !uTo || !uFrom.ratio || !uTo.ratio) return val;

      const baseVal = val * uFrom.ratio;
      return baseVal / uTo.ratio;
    }
  };

  const valTo = convertVal(valFrom, fromUnit, toUnit);

  const uFromLabel = spec.units.find((u) => u.value === fromUnit)?.label || fromUnit;
  const uToLabel = spec.units.find((u) => u.value === toUnit)?.label || toUnit;

  return (
    <div className="calc-form-grid">
      {/* Category & Inputs */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Measurement Category</label>
          <CalcToggleGroup
            options={[
              { label: "Length", value: "length" },
              { label: "Weight", value: "weight" },
              { label: "Temp", value: "temperature" },
              { label: "Speed", value: "speed" },
              { label: "Area", value: "area" },
              { label: "Volume", value: "volume" },
            ]}
            value={category}
            onChange={(c) => handleCategoryChange(c as UnitCategory)}
            accent
          />
        </div>

        {/* Input Value & From Unit */}
        <div className="calc-input-box">
          <label className="calc-input-label">From Value</label>
          <div className="flex gap-2">
            <div className="calc-num-input-wrapper flex-1">
              <input
                type="number"
                className="calc-num-input"
                value={isNaN(valFrom) ? "" : valFrom}
                onChange={(e) => setValFrom(parseFloat(e.target.value))}
              />
            </div>
            <select
              className="calc-num-input-wrapper cursor-pointer outline-none bg-surface text-main text-sm font-semibold rounded-md px-3"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              style={{ background: "var(--bg-input)", border: "1px solid var(--border-dim)" }}
            >
              {spec.units.map((u) => (
                <option key={u.value} value={u.value} style={{ background: "var(--bg-app)" }}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            className="calc-segmented-btn flex items-center justify-center gap-2 max-w-[140px] py-2"
            onClick={swapUnits}
            title="Swap Units"
          >
            <ArrowLeftRight size={14} className="text-violet" />
            <span>Swap Units</span>
          </button>
        </div>

        {/* Target Unit Selector */}
        <div className="calc-input-box">
          <label className="calc-input-label">To Unit</label>
          <select
            className="calc-num-input-wrapper w-full cursor-pointer outline-none bg-surface text-main text-sm font-semibold rounded-md p-3"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            style={{ background: "var(--bg-input)", border: "1px solid var(--border-dim)" }}
          >
            {spec.units.map((u) => (
              <option key={u.value} value={u.value} style={{ background: "var(--bg-app)" }}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Converted Value"
          value={valTo.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          subtext={`${valFrom} ${uFromLabel} = ${valTo.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${uToLabel}`}
        />

        <div className="calc-result-grid">
          <CalcResultStat label="Category" value={spec.name} />
          <CalcResultStat label="Source Unit" value={uFromLabel} />
          <CalcResultStat label="Target Unit" value={uToLabel} />
          <CalcResultStat
            label="Unit Factor"
            value={
              category !== "temperature"
                ? `1 : ${convertVal(1, fromUnit, toUnit).toFixed(4)}`
                : "Dynamic Shift"
            }
          />
        </div>
      </div>
    </div>
  );
}
