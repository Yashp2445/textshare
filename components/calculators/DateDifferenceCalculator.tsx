"use client";

import React, { useState } from "react";
import { CalcResultHero, CalcResultStat } from "./CalcSharedUI";
import { Calendar } from "lucide-react";

export function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2026-09-11");

  const d1 = new Date(startDate);
  const d2 = new Date(endDate);

  let totalDays = 0;
  let years = 0;
  let months = 0;
  let days = 0;

  if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let y = end.getFullYear() - start.getFullYear();
    let m = end.getMonth() - start.getMonth();
    let d = end.getDate() - start.getDate();

    if (d < 0) {
      m--;
      const prevMonthLastDay = new Date(
        end.getFullYear(),
        end.getMonth(),
        0
      ).getDate();
      d += prevMonthLastDay;
    }

    if (m < 0) {
      y--;
      m += 12;
    }

    years = y;
    months = m;
    days = d;
  }

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <Calendar size={16} className="text-violet" />
            Start Date
          </label>
          <div className="calc-num-input-wrapper">
            <input
              type="date"
              className="calc-num-input cursor-pointer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <Calendar size={16} className="text-violet" />
            End Date
          </label>
          <div className="calc-num-input-wrapper">
            <input
              type="date"
              className="calc-num-input cursor-pointer"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Total Duration"
          value={`${totalDays.toLocaleString()} Days`}
          subtext={`${years} Years, ${months} Months, ${days} Days`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Total Weeks"
            value={(totalDays / 7).toFixed(1)}
          />
          <CalcResultStat
            label="Total Hours"
            value={(totalDays * 24).toLocaleString()}
          />
          <CalcResultStat
            label="Approx. Months"
            value={(totalDays / 30.4375).toFixed(1)}
          />
          <CalcResultStat
            label="Approx. Years"
            value={(totalDays / 365.25).toFixed(2)}
          />
        </div>
      </div>
    </div>
  );
}
