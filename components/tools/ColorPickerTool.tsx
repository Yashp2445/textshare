"use client";

import React, { useState } from "react";
import { Palette, Copy, Check, RefreshCw } from "lucide-react";

// --- Color Helpers ---
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const hex = ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b))
    .toString(16)
    .slice(1);
  return `#${hex.toUpperCase()}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = (h % 360 + 360) % 360 / 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const hue2rgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  return {
    r: Math.round(hue2rgb(h + 1 / 3) * 255),
    g: Math.round(hue2rgb(h) * 255),
    b: Math.round(hue2rgb(h - 1 / 3) * 255),
  };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  if (r === 0 && g === 0 && b === 0) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function ColorPickerTool() {
  const [hexInput, setHexInput] = useState<string>("#7C3AED");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const rgb = hexToRgb(hexInput) || { r: 124, g: 58, b: 237 };
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const hexStr = hex;
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const cmykStr = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleColorChange = (newHex: string) => {
    setHexInput(newHex);
  };

  // --- Palette Calculations ---
  // Complementary
  const compHsl = { ...hsl, h: (hsl.h + 180) % 360 };
  const compRgb = hslToRgb(compHsl.h, compHsl.s, compHsl.l);
  const compHex = rgbToHex(compRgb.r, compRgb.g, compRgb.b);

  const complementaryPalette = [
    { name: "Primary", hex: hex },
    { name: "Complement", hex: compHex },
  ];

  // Analogous (h-30, h, h+30)
  const analogousHues = [(hsl.h - 30 + 360) % 360, hsl.h, (hsl.h + 30) % 360];
  const analogousPalette = analogousHues.map((h, i) => {
    const r = hslToRgb(h, hsl.s, hsl.l);
    return { name: `A${i + 1}`, hex: rgbToHex(r.r, r.g, r.b) };
  });

  // Monochromatic Tint & Shade Scale (l from 15% to 85%)
  const lightnessLevels = [15, 30, 45, 60, 75, 88];
  const monoPalette = lightnessLevels.map((l) => {
    const r = hslToRgb(hsl.h, hsl.s, l);
    return { name: `${l}%`, hex: rgbToHex(r.r, r.g, r.b) };
  });

  return (
    <div className="tool-card-glass">
      <div className="tool-header">
        <div className="tool-title-group">
          <h1 className="tool-title">
            <Palette size={22} className="text-violet" />
            Color Picker & Palette Generator
          </h1>
          <p className="tool-subtitle">
            Convert color formats in real-time across HEX, RGB, HSL, CMYK and generate complementary & monochromatic color palettes.
          </p>
        </div>
      </div>

      {/* Main Picker & Preview Bar */}
      <div className="calc-layout-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Left: Picker Controls */}
        <div 
          className="jwt-section-card" 
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem", justifyContent: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input
              type="color"
              value={hex}
              onChange={(e) => handleColorChange(e.target.value)}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-dim)",
                cursor: "pointer",
                background: "transparent"
              }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                HEX / RGB / HSL Input
              </label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                className="qr-link-input"
                style={{ fontSize: "1rem", fontWeight: "700" }}
                placeholder="#7C3AED or rgb(124,58,237)"
              />
            </div>
          </div>

          {/* Color Preview Block */}
          <div
            style={{
              height: "110px",
              borderRadius: "var(--radius-md)",
              backgroundColor: hex,
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 12px 28px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: "0.85rem 1.25rem",
              border: "1px solid var(--border-dim)"
            }}
          >
            <span 
              style={{
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                fontSize: "1.2rem",
                color: hsl.l > 60 ? "#000000" : "#ffffff"
              }}
            >
              {hex}
            </span>
          </div>
        </div>

        {/* Right: Format Conversions & Copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { label: "HEX", val: hexStr, key: "hex" },
            { label: "RGB", val: rgbStr, key: "rgb" },
            { label: "HSL", val: hslStr, key: "hsl" },
            { label: "CMYK", val: cmykStr, key: "cmyk" },
          ].map((item) => (
            <div key={item.key} className="jwt-section-card" style={{ padding: "0.75rem 1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", display: "block" }}>
                    {item.label}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "0.95rem", color: "var(--text-main)" }}>
                    {item.val}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(item.val, item.key)}
                  className="btn btn-secondary btn-sm"
                >
                  {copiedKey === item.key ? <Check size={14} /> : <Copy size={14} />}
                  {copiedKey === item.key ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Palette Suggestions Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)" }}>
          Generated Color Palettes
        </h3>

        {/* Complementary */}
        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            Complementary Pair
          </span>
          <div className="swatch-row">
            {complementaryPalette.map((swatch, i) => (
              <div
                key={i}
                onClick={() => handleColorChange(swatch.hex)}
                className="swatch-item"
                style={{ backgroundColor: swatch.hex, width: "120px" }}
              >
                <span className="swatch-label">{swatch.hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analogous */}
        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            Analogous Palette
          </span>
          <div className="swatch-row">
            {analogousPalette.map((swatch, i) => (
              <div
                key={i}
                onClick={() => handleColorChange(swatch.hex)}
                className="swatch-item"
                style={{ backgroundColor: swatch.hex, width: "80px" }}
              >
                <span className="swatch-label">{swatch.hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monochromatic Scale */}
        <div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
            Monochromatic Shade & Tint Scale
          </span>
          <div className="swatch-row">
            {monoPalette.map((swatch, i) => (
              <div
                key={i}
                onClick={() => handleColorChange(swatch.hex)}
                className="swatch-item"
                style={{ backgroundColor: swatch.hex, flex: 1, minWidth: "60px" }}
              >
                <span className="swatch-label">{swatch.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
