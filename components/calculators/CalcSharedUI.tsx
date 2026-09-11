"use client";

import React from "react";

// ── Reusable Input Slider Field ──
interface CalcInputSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  displayFormatter?: (val: number) => string;
}

export function CalcInputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  displayFormatter,
}: CalcInputSliderProps) {
  const formattedVal = displayFormatter
    ? displayFormatter(value)
    : `${prefix || ""}${value.toLocaleString()}${suffix || ""}`;

  return (
    <div className="calc-input-box">
      <div className="calc-input-header">
        <label className="calc-input-label">{label}</label>
        <span className="calc-input-value-badge">{formattedVal}</span>
      </div>

      <div className="calc-num-input-wrapper">
        {prefix && <span className="calc-prefix-suffix mr-1">{prefix}</span>}
        <input
          type="number"
          className="calc-num-input"
          min={min}
          max={max}
          step={step}
          value={isNaN(value) ? "" : value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            onChange(isNaN(v) ? 0 : v);
          }}
        />
        {suffix && <span className="calc-prefix-suffix ml-1">{suffix}</span>}
      </div>

      <input
        type="range"
        className="calc-range-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

// ── Segmented Control / Toggle Group ──
interface CalcToggleOption<T extends string> {
  label: string;
  value: T;
}

interface CalcToggleGroupProps<T extends string> {
  options: CalcToggleOption<T>[];
  value: T;
  onChange: (val: T) => void;
  accent?: boolean;
}

export function CalcToggleGroup<T extends string>({
  options,
  value,
  onChange,
  accent = false,
}: CalcToggleGroupProps<T>) {
  return (
    <div className="calc-segmented-control">
      {options.map((opt) => {
        const isActive = value === opt.value;
        const activeClass = isActive
          ? accent
            ? "active-accent"
            : "active"
          : "";
        return (
          <button
            key={opt.value}
            type="button"
            className={`calc-segmented-btn ${activeClass}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Result Cards ──
interface CalcResultHeroProps {
  label: string;
  value: string;
  subtext?: string;
}

export function CalcResultHero({ label, value, subtext }: CalcResultHeroProps) {
  return (
    <div className="calc-result-hero-card">
      <div className="calc-result-hero-label">{label}</div>
      <div className="calc-result-hero-value">{value}</div>
      {subtext && <div className="text-xs text-muted mt-1">{subtext}</div>}
    </div>
  );
}

interface CalcResultStatProps {
  label: string;
  value: string;
}

export function CalcResultStat({ label, value }: CalcResultStatProps) {
  return (
    <div className="calc-result-stat-card">
      <div className="calc-result-stat-label">{label}</div>
      <div className="calc-result-stat-value">{value}</div>
    </div>
  );
}

// ── Glass Donut Chart (SVG) ──
interface GlassDonutChartProps {
  val1: number; // e.g., Principal
  val2: number; // e.g., Interest
  label1: string;
  label2: string;
  color1?: string;
  color2?: string;
  centerVal?: string;
  centerLabel?: string;
}

export function GlassDonutChart({
  val1,
  val2,
  label1,
  label2,
  color1 = "#a855f7",
  color2 = "#38bdf8",
  centerVal,
  centerLabel,
}: GlassDonutChartProps) {
  const total = Math.max(val1 + val2, 0.0001);
  const strokeWidth = 14;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const pct1 = Math.min(Math.max(val1 / total, 0), 1);
  const dash1 = pct1 * circumference;
  const dash2 = circumference - dash1;

  return (
    <div className="glass-chart-wrapper">
      <div className="glass-donut-container">
        <svg viewBox="0 0 160 160" className="glass-donut-svg">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Segment 2 */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={color2}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
          {/* Segment 1 */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={color1}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash1} ${dash2}`}
            strokeDashoffset={0}
            strokeLinecap="round"
          />
        </svg>
        <div className="glass-donut-center-text">
          {centerVal && <div className="glass-donut-center-val">{centerVal}</div>}
          {centerLabel && <div className="glass-donut-center-lbl">{centerLabel}</div>}
        </div>
      </div>

      <div className="glass-chart-legend">
        <div className="glass-legend-item">
          <span className="glass-legend-dot" style={{ background: color1 }} />
          <span>
            {label1}: <strong>{((val1 / total) * 100).toFixed(1)}%</strong>
          </span>
        </div>
        <div className="glass-legend-item">
          <span className="glass-legend-dot" style={{ background: color2 }} />
          <span>
            {label2}: <strong>{((val2 / total) * 100).toFixed(1)}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Glass Growth Line Chart (SVG) ──
interface GrowthDataPoint {
  year: number;
  invested: number;
  total: number;
}

interface GlassLineChartProps {
  data: GrowthDataPoint[];
  label1?: string;
  label2?: string;
  color1?: string;
  color2?: string;
}

export function GlassLineChart({
  data,
  label1 = "Total Invested",
  label2 = "Maturity Value",
  color1 = "#38bdf8",
  color2 = "#a855f7",
}: GlassLineChartProps) {
  if (!data || data.length === 0) return null;

  const width = 360;
  const height = 140;
  const padding = 20;

  const maxVal = Math.max(...data.map((d) => d.total), 1);

  const getX = (index: number) =>
    padding + (index / (data.length - 1 || 1)) * (width - 2 * padding);
  const getY = (val: number) =>
    height - padding - (val / maxVal) * (height - 2 * padding);

  const points1 = data
    .map((d, i) => `${getX(i)},${getY(d.invested)}`)
    .join(" ");
  const points2 = data
    .map((d, i) => `${getX(i)},${getY(d.total)}`)
    .join(" ");

  const areaPoints2 = `${getX(0)},${height - padding} ${points2} ${getX(
    data.length - 1
  )},${height - padding}`;

  return (
    <div className="glass-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "140px" }}>
        <defs>
          <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color2} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color2} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line
          x1={padding}
          y1={getY(maxVal * 0.5)}
          x2={width - padding}
          y2={getY(maxVal * 0.5)}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="4 4"
        />

        {/* Area fill */}
        <polygon points={areaPoints2} fill="url(#chartGrad2)" />

        {/* Lines */}
        <polyline
          fill="none"
          stroke={color1}
          strokeWidth="2.5"
          strokeDasharray="4 4"
          points={points1}
        />
        <polyline
          fill="none"
          stroke={color2}
          strokeWidth="3"
          strokeLinecap="round"
          points={points2}
        />
      </svg>

      <div className="glass-chart-legend">
        <div className="glass-legend-item">
          <span className="glass-legend-dot" style={{ background: color1 }} />
          <span>{label1}</span>
        </div>
        <div className="glass-legend-item">
          <span className="glass-legend-dot" style={{ background: color2 }} />
          <span>{label2}</span>
        </div>
      </div>
    </div>
  );
}
