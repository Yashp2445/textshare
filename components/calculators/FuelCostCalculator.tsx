"use client";

import React, { useState } from "react";
import {
  CalcInputSlider,
  CalcResultHero,
  CalcResultStat,
} from "./CalcSharedUI";

export function FuelCostCalculator() {
  const [distance, setDistance] = useState(350);
  const [mileage, setMileage] = useState(15); // e.g. 15 km/L or MPG
  const [fuelPrice, setFuelPrice] = useState(3.8); // price per liter/gallon

  const fuelNeeded = mileage > 0 ? distance / mileage : 0;
  const totalCost = fuelNeeded * fuelPrice;
  const costPerKm = distance > 0 ? totalCost / distance : 0;

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
          label="Distance to Travel"
          value={distance}
          onChange={setDistance}
          min={10}
          max={5000}
          step={10}
          suffix=" km / miles"
        />

        <CalcInputSlider
          label="Vehicle Mileage / Efficiency"
          value={mileage}
          onChange={setMileage}
          min={1}
          max={80}
          step={0.5}
          suffix=" km/L (or MPG)"
        />

        <CalcInputSlider
          label="Current Fuel Price"
          value={fuelPrice}
          onChange={setFuelPrice}
          min={0.5}
          max={15}
          step={0.1}
          prefix="$"
          suffix=" / unit"
        />
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Estimated Fuel Cost"
          value={formatCurrency(totalCost)}
          subtext={`For ${distance.toLocaleString()} km/miles journey`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Fuel Volume Needed"
            value={`${fuelNeeded.toFixed(2)} units`}
          />
          <CalcResultStat
            label="Cost Per Distance Unit"
            value={formatCurrency(costPerKm)}
          />
          <CalcResultStat
            label="Vehicle Mileage"
            value={`${mileage} efficiency`}
          />
          <CalcResultStat
            label="Fuel Unit Price"
            value={formatCurrency(fuelPrice)}
          />
        </div>
      </div>
    </div>
  );
}
