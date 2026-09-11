"use client";

import React, { useState } from "react";
import { CalcResultHero, CalcResultStat } from "./CalcSharedUI";
import { Calendar, Cake, Clock } from "lucide-react";

export function AgeCalculator() {
  const [dob, setDob] = useState("1998-05-15");
  const [targetDate, setTargetDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const birthDate = new Date(dob);
  const now = new Date(targetDate);

  let years = 0;
  let months = 0;
  let days = 0;
  let totalDaysLived = 0;
  let daysToNextBirthday = 0;
  let dayOfWeekBorn = "";

  if (!isNaN(birthDate.getTime()) && !isNaN(now.getTime()) && birthDate <= now) {
    let y = now.getFullYear() - birthDate.getFullYear();
    let m = now.getMonth() - birthDate.getMonth();
    let d = now.getDate() - birthDate.getDate();

    if (d < 0) {
      m--;
      const prevMonthLastDay = new Date(
        now.getFullYear(),
        now.getMonth(),
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

    const diffTime = Math.abs(now.getTime() - birthDate.getTime());
    totalDaysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Next birthday calculation
    const nextBday = new Date(
      now.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    if (nextBday < now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const bdayDiffTime = nextBday.getTime() - now.getTime();
    daysToNextBirthday = Math.ceil(bdayDiffTime / (1000 * 60 * 60 * 24));

    // Day of week born
    const daysArr = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    dayOfWeekBorn = daysArr[birthDate.getDay()];
  }

  return (
    <div className="calc-form-grid">
      {/* Date Pickers */}
      <div className="flex flex-col gap-5">
        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <Cake size={16} className="text-violet" />
            Date of Birth
          </label>
          <div className="calc-num-input-wrapper">
            <input
              type="date"
              className="calc-num-input cursor-pointer"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <Calendar size={16} className="text-violet" />
            Calculate Age As Of
          </label>
          <div className="calc-num-input-wrapper">
            <input
              type="date"
              className="calc-num-input cursor-pointer"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Exact Age"
          value={`${years} Years, ${months} Months, ${days} Days`}
          subtext={`Born on a ${dayOfWeekBorn || "..."}`}
        />

        <div className="calc-result-grid">
          <CalcResultStat
            label="Total Days Lived"
            value={totalDaysLived.toLocaleString()}
          />
          <CalcResultStat
            label="Total Hours Lived"
            value={(totalDaysLived * 24).toLocaleString()}
          />
          <CalcResultStat
            label="Next Birthday In"
            value={`${daysToNextBirthday} Days`}
          />
          <CalcResultStat
            label="Total Weeks Lived"
            value={Math.floor(totalDaysLived / 7).toLocaleString()}
          />
        </div>

        <div className="status-banner" style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid var(--border-glow)" }}>
          <Clock size={18} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.8rem", color: "var(--text-main)" }}>
            Fun Fact: You have experienced approximately <strong>{(totalDaysLived * 1440).toLocaleString()}</strong> minutes of life!
          </span>
        </div>
      </div>
    </div>
  );
}
