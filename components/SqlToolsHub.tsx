"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Database, Terminal, Layers, Search } from "lucide-react";

import { SqlPlaygroundTool } from "@/components/sql-tools/SqlPlaygroundTool";
import { SqlFormatterTool } from "@/components/sql-tools/SqlFormatterTool";
import { ErDiagramTool } from "@/components/sql-tools/ErDiagramTool";

export interface SqlToolItem {
  id: string;
  label: string;
  category: "Query Execution" | "Formatting & Diagrams";
  icon: React.ElementType;
  desc: string;
  component: React.ComponentType;
}

export const SQL_TOOL_ITEMS: SqlToolItem[] = [
  {
    id: "playground",
    label: "In-Browser SQL Playground",
    category: "Query Execution",
    icon: Database,
    desc: "SQLite WASM database sandbox with sample schemas & query runner",
    component: SqlPlaygroundTool,
  },
  {
    id: "formatter",
    label: "SQL Formatter",
    category: "Formatting & Diagrams",
    icon: Terminal,
    desc: "Beautify & format messy SQL queries with clean indentation",
    component: SqlFormatterTool,
  },
  {
    id: "erd",
    label: "ER Diagram Generator",
    category: "Formatting & Diagrams",
    icon: Layers,
    desc: "Parse DDL statements to visual Entity-Relationship diagrams",
    component: ErDiagramTool,
  },
];

function SqlToolsHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const toolParam = searchParams.get("tool") || "playground";
  const [activeToolId, setActiveToolId] = useState<string>(toolParam);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (toolParam) {
      setActiveToolId(toolParam);
    }
  }, [toolParam]);

  const selectTool = (id: string) => {
    setActiveToolId(id);
    const newUrl = id === "playground" ? "/tools/sql-tools" : `/tools/sql-tools?tool=${id}`;
    window.history.pushState({}, "", newUrl);
  };

  const currentItem =
    SQL_TOOL_ITEMS.find((item) => item.id === activeToolId) ||
    SQL_TOOL_ITEMS[0];

  const ActiveComponent = currentItem.component;
  const ActiveIcon = currentItem.icon;

  const filteredItems = SQL_TOOL_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: SqlToolItem["category"][] = [
    "Query Execution",
    "Formatting & Diagrams",
  ];

  return (
    <div className="calc-hub-container">
      {/* Top Header Banner */}
      <div className="calc-hub-header">
        <div className="calc-hub-title-box">
          <div className="calc-hub-badge-icon">
            <Database size={22} />
          </div>
          <div className="calc-hub-title-text">
            <h1>
              <span>SQL Tools Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-dim text-violet font-semibold">
                In-Browser SQLite WASM
              </span>
            </h1>
            <p>Write SQL queries, format SQL statements, and generate visual ER diagrams client-side</p>
          </div>
        </div>

        {/* Mobile Dropdown Select */}
        <select
          className="calc-mobile-menu-select"
          value={activeToolId}
          onChange={(e) => selectTool(e.target.value)}
        >
          {SQL_TOOL_ITEMS.map((item) => (
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
              placeholder="Search SQL tools..."
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

export function SqlToolsHub() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dim">Loading SQL Tools...</div>}>
      <SqlToolsHubContent />
    </Suspense>
  );
}
