"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Lock, RefreshCcw, Sparkles } from "lucide-react";
import { CalcInputSlider, CalcResultHero, CalcResultStat } from "@/components/calculators/CalcSharedUI";

export function PasswordGeneratorTool() {
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = () => {
    let charset = "";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) {
      setPassword("");
      return;
    }

    let result = "";
    const cryptoObj = window.crypto || (window as any).msCrypto;
    if (cryptoObj && cryptoObj.getRandomValues) {
      const values = new Uint32Array(length);
      cryptoObj.getRandomValues(values);
      for (let i = 0; i < length; i++) {
        result += charset[values[i] % charset.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Strength score
  let strengthScore = 0;
  if (length >= 12) strengthScore += 2;
  else if (length >= 8) strengthScore += 1;

  if (includeUpper) strengthScore += 1;
  if (includeLower) strengthScore += 1;
  if (includeNumbers) strengthScore += 1;
  if (includeSymbols) strengthScore += 1;

  let strengthLabel = "Weak";
  let strengthColor = "#f43f5e";
  if (strengthScore >= 5) {
    strengthLabel = "Strong";
    strengthColor = "#10b981";
  } else if (strengthScore >= 3) {
    strengthLabel = "Moderate";
    strengthColor = "#fbbf24";
  }

  return (
    <div className="calc-form-grid">
      {/* Settings */}
      <div className="flex flex-col gap-5">
        <CalcInputSlider
          label="Password Length"
          value={length}
          onChange={setLength}
          min={4}
          max={64}
          step={1}
          suffix=" Characters"
        />

        <div className="flex flex-col gap-2 p-3 rounded-lg bg-surface border border-dim">
          <span className="text-xs font-bold text-main uppercase tracking-wider mb-1">
            Character Rules
          </span>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs text-main">Include Uppercase (A-Z)</span>
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="accent-violet cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs text-main">Include Lowercase (a-z)</span>
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="accent-violet cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs text-main">Include Numbers (0-9)</span>
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="accent-violet cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs text-main">Include Symbols (!@#$)</span>
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="accent-violet cursor-pointer"
            />
          </label>
        </div>

        <button
          type="button"
          className="calc-segmented-btn active-accent py-2.5 flex items-center justify-center gap-2 font-bold text-sm"
          onClick={generatePassword}
        >
          <RefreshCcw size={15} />
          <span>Regenerate Password</span>
        </button>
      </div>

      {/* Generated Result */}
      <div className="calc-results-column">
        <CalcResultHero
          label="Generated Random Password"
          value={password || "Select options"}
          subtext={`Strength Security Rating: ${strengthLabel}`}
        />

        <div className="flex justify-between items-center gap-3">
          <button
            type="button"
            className="calc-segmented-btn active-accent py-2 px-4 flex-1 flex items-center justify-center gap-2 font-bold text-sm"
            onClick={handleCopy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "Copied to Clipboard!" : "Copy Password"}</span>
          </button>
        </div>

        <div className="calc-result-grid">
          <CalcResultStat label="Length" value={`${length} chars`} />
          <CalcResultStat label="Security Level" value={strengthLabel} />
          <CalcResultStat label="Entropy Score" value={`${strengthScore * 18} bits`} />
          <CalcResultStat label="RNG Engine" value="Web Crypto API" />
        </div>
      </div>
    </div>
  );
}
