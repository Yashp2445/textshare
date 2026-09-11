"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Code2, Binary, Palette, BookOpen, Search } from "lucide-react";

import { CodeFormatterTool } from "@/components/language-tools/CodeFormatterTool";
import { CodeMinifierTool } from "@/components/language-tools/CodeMinifierTool";
import { CodeToImageTool } from "@/components/language-tools/CodeToImageTool";
import { CheatSheetHubTool } from "@/components/language-tools/CheatSheetHubTool";

export interface LanguageToolItem {
  id: string;
  label: string;
  category: "Code Utilities" | "Reference & Sharing";
  icon: React.ElementType;
  desc: string;
  component: React.ComponentType;
}

export const LANG_TOOL_ITEMS: LanguageToolItem[] = [
  {
    id: "formatter",
    label: "Multi-Language Code Formatter",
    category: "Code Utilities",
    icon: Code2,
    desc: "Format JS, TS, CSS, HTML, JSON, and Markdown snippets",
    component: CodeFormatterTool,
  },
  {
    id: "minifier",
    label: "Code Minifier (JS & CSS)",
    category: "Code Utilities",
    icon: Binary,
    desc: "Minify JavaScript and CSS with real-time size savings stats",
    component: CodeMinifierTool,
  },
  {
    id: "carbon",
    label: "Code to Image Generator",
    category: "Reference & Sharing",
    icon: Palette,
    desc: "Create Carbon-style styled code snippet images with themes",
    component: CodeToImageTool,
  },
  {
    id: "cheatsheet",
    label: "Developer Cheat Sheet Hub",
    category: "Reference & Sharing",
    icon: BookOpen,
    desc: "Quick reference sheets for Git, Regex, SQL Joins & Editor shortcuts",
    component: CheatSheetHubTool,
  },
];

function LanguageToolsHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const toolParam = searchParams.get("tool") || "formatter";
  const [activeToolId, setActiveToolId] = useState<string>(toolParam);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (toolParam) {
      setActiveToolId(toolParam);
    }
  }, [toolParam]);

  const selectTool = (id: string) => {
    setActiveToolId(id);
    const newUrl = id === "formatter" ? "/tools/language-tools" : `/tools/language-tools?tool=${id}`;
    window.history.pushState({}, "", newUrl);
  };

  const currentItem =
    LANG_TOOL_ITEMS.find((item) => item.id === activeToolId) ||
    LANG_TOOL_ITEMS[0];

  const ActiveComponent = currentItem.component;
  const ActiveIcon = currentItem.icon;

  const filteredItems = LANG_TOOL_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: LanguageToolItem["category"][] = [
    "Code Utilities",
    "Reference & Sharing",
  ];

  return (
    <div className="calc-hub-container">
      {/* Top Header Banner */}
      <div className="calc-hub-header">
        <div className="calc-hub-title-box">
          <div className="calc-hub-badge-icon">
            <Code2 size={22} />
          </div>
          <div className="calc-hub-title-text">
            <h1>
              <span>Programming Tools Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-dim text-violet font-semibold">
                Client-Side Suite
              </span>
            </h1>
            <p>Format, minify, generate code images, and search developer cheat sheets 100% in browser</p>
          </div>
        </div>

        {/* Mobile Dropdown Select */}
        <select
          className="calc-mobile-menu-select"
          value={activeToolId}
          onChange={(e) => selectTool(e.target.value)}
        >
          {LANG_TOOL_ITEMS.map((item) => (
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
              placeholder="Search programming tools..."
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

export function LanguageToolsHub() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dim">Loading Language Tools...</div>}>
      <LanguageToolsHubContent />
    </Suspense>
  );
}
