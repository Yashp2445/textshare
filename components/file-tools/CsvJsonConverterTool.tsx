"use client";

import React, { useState } from "react";
import {
  Copy,
  Download,
  FileCode,
  Check,
  ArrowRightLeft,
  Sparkles,
} from "lucide-react";
import { CalcToggleGroup } from "@/components/calculators/CalcSharedUI";

export function CsvJsonConverterTool() {
  const [mode, setMode] = useState<"csv2json" | "json2csv">("csv2json");
  const [inputText, setInputText] = useState<string>(
    `id,name,role,department,salary\n1,Alice,Developer,Engineering,95000\n2,Bob,Designer,Product,85000\n3,Charlie,Manager,Operations,105000`
  );
  const [delimiter, setDelimiter] = useState<string>(",");
  const [prettyPrint, setPrettyPrint] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Convert CSV to JSON
  const convertCsvToJson = (csv: string, delim: string): string => {
    try {
      const lines = csv
        .trim()
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 0);
      if (lines.length === 0) return "[]";

      // Parse headers
      const headers = lines[0].split(delim).map((h) => h.trim().replace(/^"|"$/g, ""));
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const currentline = lines[i].split(delim);
        const obj: Record<string, any> = {};

        for (let j = 0; j < headers.length; j++) {
          let val = currentline[j] ? currentline[j].trim().replace(/^"|"$/g, "") : "";
          // Attempt type conversion for numbers / booleans
          if (val.toLowerCase() === "true") obj[headers[j]] = true;
          else if (val.toLowerCase() === "false") obj[headers[j]] = false;
          else if (!isNaN(Number(val)) && val !== "") obj[headers[j]] = Number(val);
          else obj[headers[j]] = val;
        }
        result.push(obj);
      }

      return prettyPrint ? JSON.stringify(result, null, 2) : JSON.stringify(result);
    } catch (err: any) {
      setErrorMsg(`CSV Parsing Error: ${err.message}`);
      return "";
    }
  };

  // Convert JSON to CSV
  const convertJsonToCsv = (jsonStr: string, delim: string): string => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return "Error: JSON input must be an array of objects.";
      }

      const keys = Array.from(
        new Set(parsed.flatMap((item) => (typeof item === "object" ? Object.keys(item) : [])))
      );
      if (keys.length === 0) return "";

      const headerRow = keys.join(delim);
      const rows = parsed.map((item) => {
        return keys
          .map((k) => {
            let val = item[k] ?? "";
            if (typeof val === "object") val = JSON.stringify(val);
            const strVal = String(val);
            if (strVal.includes(delim) || strVal.includes("\n") || strVal.includes('"')) {
              return `"${strVal.replace(/"/g, '""')}"`;
            }
            return strVal;
          })
          .join(delim);
      });

      return [headerRow, ...rows].join("\n");
    } catch (err: any) {
      setErrorMsg(`JSON Parsing Error: ${err.message}`);
      return "";
    }
  };

  const outputText =
    mode === "csv2json"
      ? convertCsvToJson(inputText, delimiter)
      : convertJsonToCsv(inputText, delimiter);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const ext = mode === "csv2json" ? ".json" : ".csv";
    const mime = mode === "csv2json" ? "application/json" : "text/csv";
    const blob = new Blob([outputText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_data${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleModeSwitch = (newMode: "csv2json" | "json2csv") => {
    setErrorMsg("");
    setMode(newMode);
    if (newMode === "json2csv") {
      setInputText(
        JSON.stringify(
          [
            { id: 1, name: "Alice", role: "Developer", department: "Engineering", salary: 95000 },
            { id: 2, name: "Bob", role: "Designer", department: "Product", salary: 85000 },
            { id: 3, name: "Charlie", role: "Manager", department: "Operations", salary: 105000 },
          ],
          null,
          2
        )
      );
    } else {
      setInputText(
        `id,name,role,department,salary\n1,Alice,Developer,Engineering,95000\n2,Bob,Designer,Product,85000\n3,Charlie,Manager,Operations,105000`
      );
    }
  };

  return (
    <div className="calc-form-grid">
      {/* Input Panel */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Conversion Direction</label>
          <CalcToggleGroup
            options={[
              { label: "CSV → JSON", value: "csv2json" },
              { label: "JSON → CSV", value: "json2csv" },
            ]}
            value={mode}
            onChange={(val) => handleModeSwitch(val as any)}
            accent
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="calc-input-label">Delimiter</label>
          <div className="flex gap-1">
            {[
              { label: "Comma (,)", val: "," },
              { label: "Tab (\\t)", val: "\t" },
              { label: "Semicolon (;)", val: ";" },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                className={`calc-segmented-btn text-xs py-1 px-2 ${delimiter === item.val ? "active" : ""}`}
                onClick={() => setDelimiter(item.val)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {mode === "csv2json" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="prettyPrint"
              checked={prettyPrint}
              onChange={(e) => setPrettyPrint(e.target.checked)}
              className="accent-violet cursor-pointer"
            />
            <label htmlFor="prettyPrint" className="text-xs text-main cursor-pointer font-medium">
              Pretty Print JSON Output (Formatted Indentation)
            </label>
          </div>
        )}

        <div className="calc-input-box">
          <div className="flex justify-between items-center mb-1">
            <label className="calc-input-label">
              Input {mode === "csv2json" ? "CSV" : "JSON"} Data
            </label>
            <span className="text-xs text-muted font-mono">
              {inputText.length} characters
            </span>
          </div>
          <div className="code-panel-box">
            <textarea
              className="code-panel-textarea"
              style={{ minHeight: "280px" }}
              value={inputText}
              onChange={(e) => {
                setErrorMsg("");
                setInputText(e.target.value);
              }}
              placeholder={
                mode === "csv2json"
                  ? "Paste CSV rows here..."
                  : "Paste JSON array of objects here..."
              }
            />
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <FileCode size={16} className="text-violet" />
            Converted Output ({mode === "csv2json" ? "JSON" : "CSV"})
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="calc-segmented-btn text-xs py-1 px-2.5 flex items-center gap-1"
              onClick={handleCopy}
            >
              {copied ? <Check size={12} className="text-violet" /> : <Copy size={12} />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>

            <button
              type="button"
              className="calc-segmented-btn active-accent text-xs py-1 px-2.5 flex items-center gap-1"
              onClick={handleDownload}
            >
              <Download size={12} />
              <span>Download</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="status-banner error">
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="code-panel-box" style={{ flex: 1, minHeight: "310px" }}>
          <pre className="code-panel-display">{outputText}</pre>
        </div>

        <div className="status-banner" style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid var(--border-glow)" }}>
          <Sparkles size={16} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
            Instant Local Conversion: Data is parsed and converted completely client-side in JS. Zero server transmission.
          </span>
        </div>
      </div>
    </div>
  );
}
