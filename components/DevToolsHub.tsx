"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Wrench,
  Code2,
  Palette,
  Binary,
  KeyRound,
  ShieldCheck,
  Type,
  QrCode,
  FileSearch,
  Lock,
  FileText,
  Search,
} from "lucide-react";

import { JsonFormatter } from "@/components/tools/JsonFormatter";
import { ColorPickerTool } from "@/components/tools/ColorPickerTool";
import { Base64UrlTool } from "@/components/tools/Base64UrlTool";
import { JwtDecoder } from "@/components/tools/JwtDecoder";
import { BcryptTool } from "@/components/tools/BcryptTool";

import { WordCounterTool } from "@/components/dev-tools/WordCounterTool";
import { QrGeneratorTool } from "@/components/dev-tools/QrGeneratorTool";
import { CaseConverterTool } from "@/components/dev-tools/CaseConverterTool";
import { PasswordGeneratorTool } from "@/components/dev-tools/PasswordGeneratorTool";
import { LoremIpsumTool } from "@/components/dev-tools/LoremIpsumTool";

export interface DevToolItem {
  id: string;
  label: string;
  category: "Code & Encoders" | "Text & Utility" | "Security & Crypto";
  icon: React.ElementType;
  desc: string;
  component: React.ComponentType;
}

export const DEV_TOOL_ITEMS: DevToolItem[] = [
  // Code & Encoders
  {
    id: "json",
    label: "JSON Formatter & Validator",
    category: "Code & Encoders",
    icon: Code2,
    desc: "Format, validate, minify, and inspect JSON documents",
    component: JsonFormatter,
  },
  {
    id: "color",
    label: "Color Picker & Palettes",
    category: "Code & Encoders",
    icon: Palette,
    desc: "HEX, RGB, HSL, CMYK conversion & palette generator",
    component: ColorPickerTool,
  },
  {
    id: "base64",
    label: "Base64 & URL Encoder",
    category: "Code & Encoders",
    icon: Binary,
    desc: "Encode & decode strings live with Base64 & URL encoding",
    component: Base64UrlTool,
  },
  // Text & Utility
  {
    id: "wordcounter",
    label: "Word & Character Counter",
    category: "Text & Utility",
    icon: Type,
    desc: "Live word count, character count, sentence & reading time",
    component: WordCounterTool,
  },
  {
    id: "qr",
    label: "QR Code Generator",
    category: "Text & Utility",
    icon: QrCode,
    desc: "Generate & download custom QR code images from text/URL",
    component: QrGeneratorTool,
  },
  {
    id: "case",
    label: "Text Case Converter",
    category: "Text & Utility",
    icon: FileSearch,
    desc: "Convert text between UPPERCASE, lowercase, Title, camelCase",
    component: CaseConverterTool,
  },
  {
    id: "lorem",
    label: "Lorem Ipsum Generator",
    category: "Text & Utility",
    icon: FileText,
    desc: "Generate placeholder text by words, sentences, or paragraphs",
    component: LoremIpsumTool,
  },
  // Security & Crypto
  {
    id: "jwt",
    label: "JWT Decoder",
    category: "Security & Crypto",
    icon: KeyRound,
    desc: "Decode headers, payload claims & signature verification",
    component: JwtDecoder,
  },
  {
    id: "bcrypt",
    label: "Bcrypt Hasher & Verifier",
    category: "Security & Crypto",
    icon: ShieldCheck,
    desc: "Client-side password hashing and salt verification",
    component: BcryptTool,
  },
  {
    id: "password",
    label: "Password Generator",
    category: "Security & Crypto",
    icon: Lock,
    desc: "Random secure password generator with strength rating meter",
    component: PasswordGeneratorTool,
  },
];

function DevToolsHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const toolParam = searchParams.get("tool") || "json";
  const [activeToolId, setActiveToolId] = useState<string>(toolParam);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (toolParam) {
      setActiveToolId(toolParam);
    }
  }, [toolParam]);

  const selectTool = (id: string) => {
    setActiveToolId(id);
    const newUrl = id === "json" ? "/tools/dev-tools" : `/tools/dev-tools?tool=${id}`;
    window.history.pushState({}, "", newUrl);
  };

  const currentItem =
    DEV_TOOL_ITEMS.find((item) => item.id === activeToolId) ||
    DEV_TOOL_ITEMS[0];

  const ActiveComponent = currentItem.component;
  const ActiveIcon = currentItem.icon;

  const filteredItems = DEV_TOOL_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: DevToolItem["category"][] = [
    "Code & Encoders",
    "Text & Utility",
    "Security & Crypto",
  ];

  return (
    <div className="calc-hub-container">
      {/* Top Banner Header */}
      <div className="calc-hub-header">
        <div className="calc-hub-title-box">
          <div className="calc-hub-badge-icon">
            <Wrench size={22} />
          </div>
          <div className="calc-hub-title-text">
            <h1>
              <span>Dev Utilities Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-dim text-violet font-semibold">
                10 Tools
              </span>
            </h1>
            <p>Developer utilities, text converters, password generators, and formatters running 100% in browser</p>
          </div>
        </div>

        {/* Mobile Dropdown Select */}
        <select
          className="calc-mobile-menu-select"
          value={activeToolId}
          onChange={(e) => selectTool(e.target.value)}
        >
          {DEV_TOOL_ITEMS.map((item) => (
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
              placeholder="Search dev utilities..."
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

export function DevToolsHub() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dim">Loading Dev Utilities...</div>}>
      <DevToolsHubContent />
    </Suspense>
  );
}
