"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Cpu, Zap, Activity, Scale, Layers, Terminal, Search } from "lucide-react";

import { ResistorColorTool } from "@/components/electronics-tools/ResistorColorTool";
import { OhmsLawTool } from "@/components/electronics-tools/OhmsLawTool";
import { CapacitorCodeTool } from "@/components/electronics-tools/CapacitorCodeTool";
import { VoltageDividerTool } from "@/components/electronics-tools/VoltageDividerTool";
import { LedResistorTool } from "@/components/electronics-tools/LedResistorTool";
import { BatteryLifeTool } from "@/components/electronics-tools/BatteryLifeTool";
import { Timer555Tool } from "@/components/electronics-tools/Timer555Tool";
import { ElectronicsUnitTool } from "@/components/electronics-tools/ElectronicsUnitTool";
import { LogicGateSimTool } from "@/components/electronics-tools/LogicGateSimTool";
import { TruthTableTool } from "@/components/electronics-tools/TruthTableTool";
import { CircuitBuilderTool } from "@/components/electronics-tools/CircuitBuilderTool";

export interface ElectronicsToolItem {
  id: string;
  label: string;
  category: "Component Calculators" | "Circuit & Power" | "Logic & Schematics";
  icon: React.ElementType;
  desc: string;
  component: React.ComponentType;
}

export const ELEC_TOOL_ITEMS: ElectronicsToolItem[] = [
  // Component Calculators
  {
    id: "resistor",
    label: "Resistor Color Code Calculator",
    category: "Component Calculators",
    icon: Cpu,
    desc: "Decode 4/5/6 band resistor colors ↔ resistance with SVG graphic",
    component: ResistorColorTool,
  },
  {
    id: "capacitor",
    label: "Capacitor Code Calculator",
    category: "Component Calculators",
    icon: Cpu,
    desc: "Decode 3-digit capacitor EIA codes (104 -> 100 nF)",
    component: CapacitorCodeTool,
  },
  {
    id: "led",
    label: "LED Resistor Calculator",
    category: "Component Calculators",
    icon: Zap,
    desc: "Calculate current limiting resistor value for LEDs",
    component: LedResistorTool,
  },
  {
    id: "unit",
    label: "Electronics Unit Converter",
    category: "Component Calculators",
    icon: Scale,
    desc: "Convert dBm ↔ Watts, AWG ↔ mm², Frequency ↔ Wavelength",
    component: ElectronicsUnitTool,
  },
  // Circuit & Power
  {
    id: "ohms",
    label: "Ohm's Law Calculator",
    category: "Circuit & Power",
    icon: Zap,
    desc: "Calculate V, I, R, P (Voltage, Current, Resistance, Power)",
    component: OhmsLawTool,
  },
  {
    id: "divider",
    label: "Voltage Divider Calculator",
    category: "Circuit & Power",
    icon: Cpu,
    desc: "Calculate output voltage & circuit ratio from Vin, R1, and R2",
    component: VoltageDividerTool,
  },
  {
    id: "battery",
    label: "Battery Life Calculator",
    category: "Circuit & Power",
    icon: Activity,
    desc: "Estimate operating runtime from battery capacity mAh and mA draw",
    component: BatteryLifeTool,
  },
  {
    id: "555",
    label: "555 Timer Calculator",
    category: "Circuit & Power",
    icon: Cpu,
    desc: "Calculate Astable & Monostable 555 output frequency and pulse width",
    component: Timer555Tool,
  },
  // Logic & Schematics
  {
    id: "logic",
    label: "Logic Gate Simulator",
    category: "Logic & Schematics",
    icon: Layers,
    desc: "Interactive AND, OR, NOT, XOR gates with live signal propagation",
    component: LogicGateSimTool,
  },
  {
    id: "truth",
    label: "Truth Table Generator",
    category: "Logic & Schematics",
    icon: Terminal,
    desc: "Evaluate boolean logic expressions and output full truth tables",
    component: TruthTableTool,
  },
  {
    id: "circuit",
    label: "Circuit Schematic Builder",
    category: "Logic & Schematics",
    icon: Cpu,
    desc: "Drag & drop visual circuit schematic builder with grid placement",
    component: CircuitBuilderTool,
  },
];

function ElectronicsToolsHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const toolParam = searchParams.get("tool") || "resistor";
  const [activeToolId, setActiveToolId] = useState<string>(toolParam);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (toolParam) {
      setActiveToolId(toolParam);
    }
  }, [toolParam]);

  const selectTool = (id: string) => {
    setActiveToolId(id);
    const newUrl = id === "resistor" ? "/tools/electronics-tools" : `/tools/electronics-tools?tool=${id}`;
    window.history.pushState({}, "", newUrl);
  };

  const currentItem =
    ELEC_TOOL_ITEMS.find((item) => item.id === activeToolId) ||
    ELEC_TOOL_ITEMS[0];

  const ActiveComponent = currentItem.component;
  const ActiveIcon = currentItem.icon;

  const filteredItems = ELEC_TOOL_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: ElectronicsToolItem["category"][] = [
    "Component Calculators",
    "Circuit & Power",
    "Logic & Schematics",
  ];

  return (
    <div className="calc-hub-container">
      {/* Top Banner Header */}
      <div className="calc-hub-header">
        <div className="calc-hub-title-box">
          <div className="calc-hub-badge-icon">
            <Cpu size={22} />
          </div>
          <div className="calc-hub-title-text">
            <h1>
              <span>Electronics Tools Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-dim text-violet font-semibold">
                11 Utilities
              </span>
            </h1>
            <p>Component decoders, Ohm's law, 555 timers, logic gate simulators & schematic builders</p>
          </div>
        </div>

        {/* Mobile Dropdown Select */}
        <select
          className="calc-mobile-menu-select"
          value={activeToolId}
          onChange={(e) => selectTool(e.target.value)}
        >
          {ELEC_TOOL_ITEMS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.category}: {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Layout */}
      <div className="calc-hub-grid">
        {/* Sidebar Navigation */}
        <aside className="calc-sidebar-card">
          <div className="calc-sidebar-search">
            <Search size={14} className="calc-sidebar-search-icon" />
            <input
              type="text"
              placeholder="Search electronics tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {categories.map((cat) => {
              const catItems = filteredItems.filter((item) => item.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="calc-menu-group">
                  <div className="calc-menu-group-title">
                    <span>{cat}</span>
                    <span className="text-xs text-muted">{catItems.length}</span>
                  </div>

                  {catItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === activeToolId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`calc-menu-item ${isActive ? "active" : ""}`}
                        onClick={() => selectTool(item.id)}
                      >
                        <div className="calc-menu-item-left">
                          <div className="calc-menu-item-icon">
                            <Icon size={15} />
                          </div>
                          <span className="calc-menu-item-label">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Active Tool View */}
        <main className="calc-view-card">
          <div className="calc-view-header">
            <div className="calc-view-title">
              <div className="calc-hub-badge-icon">
                <ActiveIcon size={20} />
              </div>
              <div>
                <h2>{currentItem.label}</h2>
                <div className="text-xs text-dim">{currentItem.desc}</div>
              </div>
            </div>
            <span className="calc-category-badge">{currentItem.category}</span>
          </div>

          <div className="w-full">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

export function ElectronicsToolsHub() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dim">Loading Electronics Tools...</div>}>
      <ElectronicsToolsHubContent />
    </Suspense>
  );
}
