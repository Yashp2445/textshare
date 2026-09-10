"use client";

import React, { useState, useEffect } from "react";
import { History, Delete, RotateCcw, Sparkles } from "lucide-react";

interface HistoryItem {
  expression: string;
  result: string;
}

export function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [isRadMode, setIsRadMode] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Evaluate formula safely
  const calculateResult = (exprToEval: string): string => {
    if (!exprToEval.trim()) return "";
    try {
      let sanitized = exprToEval
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "Math.PI")
        .replace(/\be\b/g, "Math.E")
        .replace(/√\(([^)]+)\)/g, "Math.sqrt($1)")
        .replace(/√([0-9.]+)/g, "Math.sqrt($1)")
        .replace(/∛\(([^)]+)\)/g, "Math.cbrt($1)")
        .replace(/ln\(/g, "Math.log(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/\^/g, "**");

      // Handle trig with RAD / DEG
      if (!isRadMode) {
        sanitized = sanitized
          .replace(/Math\.sin\(([^)]+)\)/g, "Math.sin(($1) * Math.PI / 180)")
          .replace(/Math\.cos\(([^)]+)\)/g, "Math.cos(($1) * Math.PI / 180)")
          .replace(/Math\.tan\(([^)]+)\)/g, "Math.tan(($1) * Math.PI / 180)");
      } else {
        sanitized = sanitized
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(");
      }

      // Evaluate safely
      const fn = new Function(`return (${sanitized})`);
      const val = fn();
      if (typeof val === "number" && !isNaN(val) && isFinite(val)) {
        return Number.isInteger(val) ? val.toString() : parseFloat(val.toFixed(8)).toString();
      }
      return "Error";
    } catch {
      return "Error";
    }
  };

  const handleAppend = (val: string) => {
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression("");
    setResult("");
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleEquals = () => {
    if (!expression) return;
    const res = calculateResult(expression);
    setResult(res);
    if (res !== "Error") {
      setHistory((prev) => [{ expression, result: res }, ...prev.slice(0, 19)]);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape") {
        handleClear();
      } else if ("0123456789.+-*/()^".includes(e.key)) {
        let char = e.key;
        if (char === "*") char = "×";
        if (char === "/") char = "÷";
        handleAppend(char);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expression, isRadMode]);

  return (
    <div className="calc-page-wrapper">
      <div className="calc-card-glass">
        {/* Calc Header & Controls */}
        <div className="calc-header">
          <div className="calc-title">
            <Sparkles size={16} className="text-violet" />
            <span>Scientific Calculator</span>
          </div>

          <div className="calc-header-actions">
            <button
              className={`calc-mode-btn ${isRadMode ? "active" : ""}`}
              onClick={() => setIsRadMode(!isRadMode)}
            >
              {isRadMode ? "RAD" : "DEG"}
            </button>

            <button
              className={`calc-mode-btn ${showHistory ? "active" : ""}`}
              onClick={() => setShowHistory(!showHistory)}
              title="Toggle Calculation History"
            >
              <History size={14} />
            </button>
          </div>
        </div>

        {/* Display Screen */}
        <div className="calc-display-glass">
          <div className="calc-expression">{expression || "0"}</div>
          <div className="calc-result">{result ? `= ${result}` : ""}</div>
        </div>

        {/* Calculator Main Keypad */}
        <div className="calc-layout-grid">
          {/* Scientific Panel */}
          <div className="calc-sci-grid">
            <button className="calc-btn sci" onClick={() => handleAppend("sin(")}>sin</button>
            <button className="calc-btn sci" onClick={() => handleAppend("cos(")}>cos</button>
            <button className="calc-btn sci" onClick={() => handleAppend("tan(")}>tan</button>
            <button className="calc-btn sci" onClick={() => handleAppend("π")}>π</button>
            
            <button className="calc-btn sci" onClick={() => handleAppend("ln(")}>ln</button>
            <button className="calc-btn sci" onClick={() => handleAppend("log(")}>log</button>
            <button className="calc-btn sci" onClick={() => handleAppend("^")}>x^y</button>
            <button className="calc-btn sci" onClick={() => handleAppend("e")}>e</button>

            <button className="calc-btn sci" onClick={() => handleAppend("√(")}>√x</button>
            <button className="calc-btn sci" onClick={() => handleAppend("^2")}>x²</button>
            <button className="calc-btn sci" onClick={() => handleAppend("(")}>(</button>
            <button className="calc-btn sci" onClick={() => handleAppend(")")}>)</button>
          </div>

          {/* Standard Keypad */}
          <div className="calc-standard-grid">
            <button className="calc-btn danger" onClick={handleClear}>AC</button>
            <button className="calc-btn func" onClick={handleBackspace}><Delete size={16} /></button>
            <button className="calc-btn func" onClick={() => handleAppend("%")}>%</button>
            <button className="calc-btn op" onClick={() => handleAppend("÷")}>÷</button>

            <button className="calc-btn num" onClick={() => handleAppend("7")}>7</button>
            <button className="calc-btn num" onClick={() => handleAppend("8")}>8</button>
            <button className="calc-btn num" onClick={() => handleAppend("9")}>9</button>
            <button className="calc-btn op" onClick={() => handleAppend("×")}>×</button>

            <button className="calc-btn num" onClick={() => handleAppend("4")}>4</button>
            <button className="calc-btn num" onClick={() => handleAppend("5")}>5</button>
            <button className="calc-btn num" onClick={() => handleAppend("6")}>6</button>
            <button className="calc-btn op" onClick={() => handleAppend("-")}>-</button>

            <button className="calc-btn num" onClick={() => handleAppend("1")}>1</button>
            <button className="calc-btn num" onClick={() => handleAppend("2")}>2</button>
            <button className="calc-btn num" onClick={() => handleAppend("3")}>3</button>
            <button className="calc-btn op" onClick={() => handleAppend("+")}>+</button>

            <button className="calc-btn num span-2" onClick={() => handleAppend("0")}>0</button>
            <button className="calc-btn num" onClick={() => handleAppend(".")}>.</button>
            <button className="calc-btn equals" onClick={handleEquals}>=</button>
          </div>
        </div>

        {/* History Drawer */}
        {showHistory && (
          <div className="calc-history-drawer">
            <div className="history-header">
              <span>Calculation History</span>
              <button className="history-clear-btn" onClick={() => setHistory([])}>
                <RotateCcw size={12} /> Clear
              </button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="history-empty">No calculations yet.</div>
              ) : (
                history.map((item, index) => (
                  <div
                    key={index}
                    className="history-item"
                    onClick={() => {
                      setExpression(item.expression);
                      setResult(item.result);
                    }}
                  >
                    <span className="history-expr">{item.expression}</span>
                    <span className="history-res">= {item.result}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
