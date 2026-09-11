"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileCheck,
  Image as ImageIcon,
  FileCode,
  FileText,
  Search,
  Wrench,
} from "lucide-react";

import { ImageCompressorTool } from "@/components/file-tools/ImageCompressorTool";
import { CsvJsonConverterTool } from "@/components/file-tools/CsvJsonConverterTool";
import { DocPdfTool } from "@/components/file-tools/DocPdfTool";

export interface FileToolItem {
  id: string;
  label: string;
  category: "Image Tools" | "Data Tools" | "Document Tools";
  icon: React.ElementType;
  desc: string;
  component: React.ComponentType;
}

export const FILE_TOOL_ITEMS: FileToolItem[] = [
  {
    id: "image",
    label: "Image Compressor & Converter",
    category: "Image Tools",
    icon: ImageIcon,
    desc: "Compress PNG, JPG, WebP images with quality slider live preview",
    component: ImageCompressorTool,
  },
  {
    id: "csv-json",
    label: "CSV ↔ JSON Converter",
    category: "Data Tools",
    icon: FileCode,
    desc: "Bi-directional conversion between CSV and JSON with formatting",
    component: CsvJsonConverterTool,
  },
  {
    id: "doc-pdf",
    label: "Document to PDF Utility",
    category: "Document Tools",
    icon: FileText,
    desc: "Client-side document exporter & zero-cost conversion statement",
    component: DocPdfTool,
  },
];

function FileToolsHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const toolParam = searchParams.get("tool") || "image";
  const [activeToolId, setActiveToolId] = useState<string>(toolParam);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (toolParam) {
      setActiveToolId(toolParam);
    }
  }, [toolParam]);

  const selectTool = (id: string) => {
    setActiveToolId(id);
    const newUrl = id === "image" ? "/tools/file-tools" : `/tools/file-tools?tool=${id}`;
    window.history.pushState({}, "", newUrl);
  };

  const currentItem =
    FILE_TOOL_ITEMS.find((item) => item.id === activeToolId) ||
    FILE_TOOL_ITEMS[0];

  const ActiveComponent = currentItem.component;
  const ActiveIcon = currentItem.icon;

  const filteredItems = FILE_TOOL_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: FileToolItem["category"][] = [
    "Image Tools",
    "Data Tools",
    "Document Tools",
  ];

  return (
    <div className="calc-hub-container">
      {/* Top Banner Header */}
      <div className="calc-hub-header">
        <div className="calc-hub-title-box">
          <div className="calc-hub-badge-icon">
            <FileCheck size={22} />
          </div>
          <div className="calc-hub-title-text">
            <h1>
              <span>File Tools Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-dim text-violet font-semibold">
                Client-Side Only
              </span>
            </h1>
            <p>High-performance client-side file utilities running 100% inside your browser</p>
          </div>
        </div>

        {/* Mobile Dropdown Select */}
        <select
          className="calc-mobile-menu-select"
          value={activeToolId}
          onChange={(e) => selectTool(e.target.value)}
        >
          {FILE_TOOL_ITEMS.map((item) => (
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
              placeholder="Search file tools..."
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

        {/* Active Tool Workspace */}
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

export function FileToolsHub() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dim">Loading File Tools...</div>}>
      <FileToolsHubContent />
    </Suspense>
  );
}
