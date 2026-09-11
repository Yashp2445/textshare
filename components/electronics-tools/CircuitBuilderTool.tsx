"use client";

import React, { useState } from "react";
import { Cpu, Download, Plus, RefreshCcw, Sparkles } from "lucide-react";

interface CircuitComponent {
  id: string;
  type: "battery" | "resistor" | "capacitor" | "led" | "ground";
  x: number;
  y: number;
  label: string;
}

export function CircuitBuilderTool() {
  const [components, setComponents] = useState<CircuitComponent[]>([
    { id: "1", type: "battery", x: 60, y: 100, label: "V1 (9V)" },
    { id: "2", type: "resistor", x: 180, y: 100, label: "R1 (1kΩ)" },
    { id: "3", type: "led", x: 300, y: 100, label: "D1 (Red LED)" },
    { id: "4", type: "ground", x: 180, y: 220, label: "GND" },
  ]);

  const addComponent = (type: CircuitComponent["type"]) => {
    const labels: Record<string, string> = {
      battery: "V_BAT (12V)",
      resistor: "R_RES (10kΩ)",
      capacitor: "C_CAP (100nF)",
      led: "LED_D2",
      ground: "GND",
    };
    const newComp: CircuitComponent = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      x: 100 + (components.length % 4) * 60,
      y: 120 + Math.floor(components.length / 4) * 40,
      label: labels[type] || type,
    };
    setComponents((prev) => [...prev, newComp]);
  };

  const clearCanvas = () => setComponents([]);

  return (
    <div className="flex flex-col gap-4">
      {/* Component Palette Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-surface border border-dim">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-violet mr-1">Add Schematic Component:</span>
          {(["battery", "resistor", "capacitor", "led", "ground"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className="calc-segmented-btn text-xs py-1 px-3 capitalize flex items-center gap-1"
              onClick={() => addComponent(type)}
            >
              <Plus size={12} />
              <span>{type}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="text-xs text-muted hover:text-rose-400 flex items-center gap-1"
          onClick={clearCanvas}
        >
          <RefreshCcw size={12} />
          <span>Reset Canvas</span>
        </button>
      </div>

      {/* Grid Canvas Diagram */}
      <div
        className="w-full h-80 rounded-xl border border-dim relative overflow-hidden bg-zinc-950 p-4"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        {/* Wire Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {components.length >= 2 && (
            <polyline
              points={components.map((c) => `${c.x + 30},${c.y + 20}`).join(" ")}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {/* Draggable Component Nodes */}
        {components.map((comp) => (
          <div
            key={comp.id}
            className="absolute p-2 rounded-md bg-surface/90 border border-violet shadow-lg flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
            style={{ left: `${comp.x}px`, top: `${comp.y}px` }}
          >
            <div className="w-8 h-8 rounded bg-input border border-dim flex items-center justify-center text-violet font-mono font-bold text-xs">
              {comp.type === "battery" && "V+"}
              {comp.type === "resistor" && "R"}
              {comp.type === "capacitor" && "C"}
              {comp.type === "led" && "LED"}
              {comp.type === "ground" && "⏚"}
            </div>
            <span className="text-[10px] font-mono text-main font-semibold whitespace-nowrap">
              {comp.label}
            </span>
          </div>
        ))}
      </div>

      <div className="status-banner" style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid var(--border-glow)" }}>
        <Sparkles size={16} className="text-violet flex-shrink-0" />
        <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
          Tier One Visual Schematic Builder. Visual component placement & node mapping only.
        </span>
      </div>
    </div>
  );
}
