"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FileText,
  Calculator,
  FolderArchive,
  Database,
  Code2,
  Zap,
  Wrench,
  Sparkles,
  Landmark,
  TrendingUp,
  ShieldCheck,
  Receipt,
  Wallet,
  PiggyBank,
  Building2,
  Coins,
  Activity,
  Cake,
  CalendarDays,
  Percent,
  GraduationCap,
  Fuel,
  Tag,
  Scale,
  Image as ImageIcon,
  FileCode,
  Terminal,
  FileCheck,
  Cpu,
  Layers,
  Binary,
  Palette,
  KeyRound,
  BookOpen,
  Type,
  QrCode,
  FileSearch,
  Lock,
} from "lucide-react";

export interface ToolRegistryItem {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  description: string;
  href: string;
  keywords: string[];
}

export const ALL_TOOLS: ToolRegistryItem[] = [
  // Core LivePad
  {
    id: "livepad",
    name: "LivePad Text Editor",
    category: "Core Tools",
    icon: FileText,
    description: "Instant collaborative live text & file sharing editor",
    href: "/",
    keywords: ["text", "paste", "share", "collaboration", "pad", "notes"],
  },
  // Calculators (17)
  {
    id: "scientific",
    name: "Scientific Calculator",
    category: "Calculators",
    icon: Sparkles,
    description: "Trigonometry, logarithms, exponents & calculation history",
    href: "/calculator?calc=scientific",
    keywords: ["math", "sin", "cos", "tan", "log", "scientific", "calc"],
  },
  {
    id: "emi",
    name: "EMI Calculator",
    category: "Calculators",
    icon: Landmark,
    description: "Monthly loan EMI, total interest & principal breakdown chart",
    href: "/calculator?calc=emi",
    keywords: ["loan", "emi", "mortgage", "bank", "interest", "finance"],
  },
  {
    id: "sip",
    name: "SIP Investment Calculator",
    category: "Calculators",
    icon: TrendingUp,
    description: "Mutual fund wealth creation & return growth timeline",
    href: "/calculator?calc=sip",
    keywords: ["mutual fund", "sip", "investment", "returns", "wealth"],
  },
  {
    id: "eligibility",
    name: "Loan Eligibility Calculator",
    category: "Calculators",
    icon: ShieldCheck,
    description: "Max borrowing capacity & debt ratio FOIR estimation",
    href: "/calculator?calc=eligibility",
    keywords: ["loan", "bank", "capacity", "borrow", "salary", "credit"],
  },
  {
    id: "gst",
    name: "GST Calculator",
    category: "Calculators",
    icon: Receipt,
    description: "Tax inclusion & extraction base price breakdown",
    href: "/calculator?calc=gst",
    keywords: ["tax", "gst", "vat", "inclusive", "exclusive", "price"],
  },
  {
    id: "salary",
    name: "Salary / In-Hand Calculator",
    category: "Calculators",
    icon: Wallet,
    description: "Gross CTC to monthly take-home salary & deductions",
    href: "/calculator?calc=salary",
    keywords: ["salary", "take home", "pay", "ctc", "tax", "pf", "deduction"],
  },
  {
    id: "compound",
    name: "Compound Interest Calculator",
    category: "Calculators",
    icon: PiggyBank,
    description: "Compounding frequency & long-term wealth growth",
    href: "/calculator?calc=compound",
    keywords: ["interest", "compound", "savings", "apy", "bank"],
  },
  {
    id: "fdrd",
    name: "FD & RD Calculator",
    category: "Calculators",
    icon: Building2,
    description: "Fixed Deposit & Recurring Deposit maturity value",
    href: "/calculator?calc=fdrd",
    keywords: ["fd", "rd", "deposit", "bank", "fixed deposit", "recurring"],
  },
  {
    id: "prepayment",
    name: "Home Loan Prepayment",
    category: "Calculators",
    icon: Coins,
    description: "Interest saved by reducing tenure or monthly EMI",
    href: "/calculator?calc=prepayment",
    keywords: ["prepayment", "home loan", "interest saved", "tenure"],
  },
  {
    id: "bmi",
    name: "BMI Calculator",
    category: "Calculators",
    icon: Activity,
    description: "Body Mass Index & category visual gauge scale",
    href: "/calculator?calc=bmi",
    keywords: ["bmi", "health", "weight", "height", "fitness", "body"],
  },
  {
    id: "age",
    name: "Age Calculator",
    category: "Calculators",
    icon: Cake,
    description: "Exact age in Years, Months, Days & birthday countdown",
    href: "/calculator?calc=age",
    keywords: ["age", "birthday", "dob", "years", "days"],
  },
  {
    id: "datediff",
    name: "Date Difference Calculator",
    category: "Calculators",
    icon: CalendarDays,
    description: "Total day count & duration breakdown between dates",
    href: "/calculator?calc=datediff",
    keywords: ["date", "duration", "days", "calendar", "time"],
  },
  {
    id: "percentage",
    name: "Percentage Calculator",
    category: "Calculators",
    icon: Percent,
    description: "Multi-use percentage finder & percentage change tool",
    href: "/calculator?calc=percentage",
    keywords: ["percent", "percentage", "change", "increase", "decrease"],
  },
  {
    id: "cgpa",
    name: "CGPA to Percentage Converter",
    category: "Calculators",
    icon: GraduationCap,
    description: "Bi-directional grade point conversion with factor control",
    href: "/calculator?calc=cgpa",
    keywords: ["cgpa", "grade", "gpa", "marks", "percentage", "cbse"],
  },
  {
    id: "fuel",
    name: "Fuel Cost Calculator",
    category: "Calculators",
    icon: Fuel,
    description: "Journey distance, vehicle mileage & total fuel cost",
    href: "/calculator?calc=fuel",
    keywords: ["fuel", "gas", "petrol", "diesel", "mileage", "trip", "cost"],
  },
  {
    id: "discount",
    name: "Discount & Markup Calculator",
    category: "Calculators",
    icon: Tag,
    description: "Price reduction savings & markup profit margins",
    href: "/calculator?calc=discount",
    keywords: ["discount", "sale", "markup", "price", "margin", "profit"],
  },
  {
    id: "tip",
    name: "Tip Calculator",
    category: "Calculators",
    icon: Coins,
    description: "Bill splitting & per-person tip breakdown",
    href: "/calculator?calc=tip",
    keywords: ["tip", "restaurant", "bill", "split", "headcount"],
  },
  {
    id: "unit",
    name: "Unit Converter",
    category: "Calculators",
    icon: Scale,
    description: "Length, weight, temp, speed, area & volume units",
    href: "/calculator?calc=unit",
    keywords: ["unit", "convert", "length", "weight", "temperature", "speed"],
  },
  // File Tools (5)
  {
    id: "img-compress",
    name: "Image Compressor & Converter",
    category: "File Tools",
    icon: ImageIcon,
    description: "Compress PNG, JPG, WebP images with quality slider preview",
    href: "/tools/file-tools?tool=image",
    keywords: ["image", "compress", "png", "jpg", "webp", "photo", "resize"],
  },
  {
    id: "img-resize",
    name: "Image Resizer",
    category: "File Tools",
    icon: ImageIcon,
    description: "Resize image dimensions in exact pixels or percentage scale",
    href: "/tools/file-tools?tool=resize",
    keywords: ["image", "resize", "scale", "width", "height", "pixels", "dimensions"],
  },
  {
    id: "csv-json",
    name: "CSV ↔ JSON Converter",
    category: "File Tools",
    icon: FileCode,
    description: "Bi-directional parsing & formatting between CSV and JSON",
    href: "/tools/file-tools?tool=csv-json",
    keywords: ["csv", "json", "convert", "excel", "data", "parse"],
  },
  {
    id: "pdf-tools",
    name: "PDF Merge & Split",
    category: "File Tools",
    icon: FileCheck,
    description: "Merge multiple PDFs or extract page ranges 100% in browser",
    href: "/tools/file-tools?tool=pdf-tools",
    keywords: ["pdf", "merge", "split", "combine", "pages", "extract"],
  },
  {
    id: "doc-pdf",
    name: "Document to PDF Utility",
    category: "File Tools",
    icon: FileCheck,
    description: "Client-side document exporter & PDF generator",
    href: "/tools/file-tools?tool=doc-pdf",
    keywords: ["pdf", "doc", "document", "print", "export"],
  },
  // SQL Tools (3)
  {
    id: "sql-playground",
    name: "In-Browser SQL Playground",
    category: "SQL Tools",
    icon: Database,
    description: "SQLite WASM database sandbox with sample schemas & query runner",
    href: "/tools/sql-tools?tool=playground",
    keywords: ["sql", "sqlite", "database", "query", "tables", "select"],
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    category: "SQL Tools",
    icon: Terminal,
    description: "Beautify & format messy SQL queries with clean indentation",
    href: "/tools/sql-tools?tool=formatter",
    keywords: ["sql", "format", "beautify", "indent", "query"],
  },
  {
    id: "er-diagram",
    name: "ER Diagram Generator",
    category: "SQL Tools",
    icon: Layers,
    description: "Parse CREATE TABLE DDL statements to visual Entity-Relationship diagrams",
    href: "/tools/sql-tools?tool=erd",
    keywords: ["erd", "er diagram", "schema", "foreign key", "table", "relational"],
  },
  // Programming Language Tools (4)
  {
    id: "code-formatter",
    name: "Multi-Language Code Formatter",
    category: "Language Tools",
    icon: Code2,
    description: "Format JS, TS, CSS, HTML, JSON, and Markdown snippets",
    href: "/tools/language-tools?tool=formatter",
    keywords: ["format", "prettier", "javascript", "typescript", "css", "html", "json"],
  },
  {
    id: "code-minifier",
    name: "Code Minifier (JS & CSS)",
    category: "Language Tools",
    icon: Binary,
    description: "Minify JavaScript and CSS with real-time size savings stats",
    href: "/tools/language-tools?tool=minifier",
    keywords: ["minify", "compress", "terser", "js", "css", "bundle"],
  },
  {
    id: "code-to-image",
    name: "Code to Image Generator",
    category: "Language Tools",
    icon: Palette,
    description: "Create Carbon-style styled code snippet images with themes",
    href: "/tools/language-tools?tool=carbon",
    keywords: ["carbon", "code image", "syntax highlight", "share", "export"],
  },
  {
    id: "cheat-sheet",
    name: "Developer Cheat Sheet Hub",
    category: "Language Tools",
    icon: BookOpen,
    description: "Quick reference sheets for Git, Regex, SQL Joins & Editor shortcuts",
    href: "/tools/language-tools?tool=cheatsheet",
    keywords: ["cheat sheet", "git", "regex", "sql join", "vim", "vscode", "shortcuts"],
  },
  // Electronics Tools (11)
  {
    id: "resistor-color",
    name: "Resistor Color Code Calculator",
    category: "Electronics Tools",
    icon: Cpu,
    description: "Decode 4/5/6 color bands ↔ resistance with SVG resistor visual",
    href: "/tools/electronics-tools?tool=resistor",
    keywords: ["resistor", "color code", "ohms", "tolerance", "bands", "circuit"],
  },
  {
    id: "ohms-law",
    name: "Ohm's Law Calculator",
    category: "Electronics Tools",
    icon: Zap,
    description: "Calculate Voltage, Current, Resistance, Power (V, I, R, P)",
    href: "/tools/electronics-tools?tool=ohms",
    keywords: ["ohm", "voltage", "current", "amps", "watts", "power", "resistance"],
  },
  {
    id: "capacitor-code",
    name: "Capacitor Code Calculator",
    category: "Electronics Tools",
    icon: Cpu,
    description: "Decode 3-digit capacitor codes (e.g. 104 -> 100 nF) & tolerance",
    href: "/tools/electronics-tools?tool=capacitor",
    keywords: ["capacitor", "farad", "code", "picofarad", "microfarad"],
  },
  {
    id: "voltage-divider",
    name: "Voltage Divider Calculator",
    category: "Electronics Tools",
    icon: Cpu,
    description: "Calculate output voltage & power from Vin, R1, and R2",
    href: "/tools/electronics-tools?tool=divider",
    keywords: ["voltage divider", "resistor", "vin", "vout", "circuit"],
  },
  {
    id: "led-resistor",
    name: "LED Resistor Calculator",
    category: "Electronics Tools",
    icon: Zap,
    description: "Calculate current-limiting resistor for LEDs from Vs, Vf, and If",
    href: "/tools/electronics-tools?tool=led",
    keywords: ["led", "resistor", "diode", "current limit", "voltage"],
  },
  {
    id: "battery-life",
    name: "Battery Life Calculator",
    category: "Electronics Tools",
    icon: Activity,
    description: "Estimate battery runtime from mAh capacity and mA current draw",
    href: "/tools/electronics-tools?tool=battery",
    keywords: ["battery", "mah", "runtime", "power", "discharge", "hours"],
  },
  {
    id: "timer-555",
    name: "555 Timer Calculator",
    category: "Electronics Tools",
    icon: Cpu,
    description: "Calculate Astable & Monostable 555 frequency, period, and duty cycle",
    href: "/tools/electronics-tools?tool=555",
    keywords: ["555", "timer", "astable", "monostable", "frequency", "oscillator"],
  },
  {
    id: "electronics-unit",
    name: "Electronics Unit Converter",
    category: "Electronics Tools",
    icon: Scale,
    description: "Convert dBm ↔ Watts, AWG wire gauge ↔ mm², Frequency ↔ Wavelength",
    href: "/tools/electronics-tools?tool=unit",
    keywords: ["dbm", "watts", "awg", "wire", "gauge", "frequency", "unit"],
  },
  {
    id: "logic-gate",
    name: "Logic Gate Simulator",
    category: "Electronics Tools",
    icon: Layers,
    description: "Interactive canvas with AND, OR, NOT, XOR gates & live signal propagation",
    href: "/tools/electronics-tools?tool=logic",
    keywords: ["logic gate", "and", "or", "not", "xor", "boolean", "circuit"],
  },
  {
    id: "truth-table",
    name: "Truth Table Generator",
    category: "Electronics Tools",
    icon: Terminal,
    description: "Generate complete truth tables from boolean expressions",
    href: "/tools/electronics-tools?tool=truth",
    keywords: ["truth table", "boolean", "logic", "expression", "evaluate"],
  },
  {
    id: "circuit-builder",
    name: "Circuit Schematic Builder",
    category: "Electronics Tools",
    icon: Cpu,
    description: "Drag-and-drop visual circuit schematic builder with PNG export",
    href: "/tools/electronics-tools?tool=circuit",
    keywords: ["circuit", "schematic", "builder", "diagram", "components", "wires"],
  },
  // Dev Utilities (10)
  {
    id: "dev-json",
    name: "JSON Formatter & Validator",
    category: "Dev Utilities",
    icon: Code2,
    description: "Format, validate, minify, and inspect JSON documents",
    href: "/tools/dev-tools?tool=json",
    keywords: ["json", "format", "validate", "minify", "tree"],
  },
  {
    id: "dev-color",
    name: "Color Picker & Palette Generator",
    category: "Dev Utilities",
    icon: Palette,
    description: "HEX, RGB, HSL, CMYK conversion & color palette generator",
    href: "/tools/dev-tools?tool=color",
    keywords: ["color", "picker", "hex", "rgb", "hsl", "palette"],
  },
  {
    id: "dev-base64",
    name: "Base64 & URL Encoder",
    category: "Dev Utilities",
    icon: Binary,
    description: "Encode and decode strings live with Base64 & URL encoding",
    href: "/tools/dev-tools?tool=base64",
    keywords: ["base64", "url", "encode", "decode", "string"],
  },
  {
    id: "dev-wordcounter",
    name: "Word & Character Counter",
    category: "Dev Utilities",
    icon: Type,
    description: "Live word count, character count, sentence & reading time",
    href: "/tools/dev-tools?tool=wordcounter",
    keywords: ["word", "character", "count", "reading time", "length", "text"],
  },
  {
    id: "dev-qr",
    name: "QR Code Generator",
    category: "Dev Utilities",
    icon: QrCode,
    description: "Generate & download custom QR code images from text/URL",
    href: "/tools/dev-tools?tool=qr",
    keywords: ["qr", "code", "generator", "url", "barcode", "download"],
  },
  {
    id: "dev-case",
    name: "Text Case Converter",
    category: "Dev Utilities",
    icon: FileSearch,
    description: "Convert text between UPPERCASE, lowercase, Title, camelCase",
    href: "/tools/dev-tools?tool=case",
    keywords: ["case", "convert", "uppercase", "lowercase", "title", "camelcase"],
  },
  {
    id: "dev-lorem",
    name: "Lorem Ipsum Generator",
    category: "Dev Utilities",
    icon: FileText,
    description: "Generate placeholder text by words, sentences, or paragraphs",
    href: "/tools/dev-tools?tool=lorem",
    keywords: ["lorem", "ipsum", "placeholder", "text", "dummy", "generator"],
  },
  {
    id: "dev-jwt",
    name: "JWT Decoder",
    category: "Dev Utilities",
    icon: KeyRound,
    description: "Decode JWT headers, payload claims & signature verification",
    href: "/tools/dev-tools?tool=jwt",
    keywords: ["jwt", "token", "decode", "header", "payload", "auth"],
  },
  {
    id: "dev-bcrypt",
    name: "Bcrypt Hasher & Verifier",
    category: "Dev Utilities",
    icon: ShieldCheck,
    description: "Client-side password hashing and salt verification",
    href: "/tools/dev-tools?tool=bcrypt",
    keywords: ["bcrypt", "hash", "password", "crypto", "salt"],
  },
  {
    id: "dev-password",
    name: "Password Generator",
    category: "Dev Utilities",
    icon: Lock,
    description: "Random secure password generator with strength rating meter",
    href: "/tools/dev-tools?tool=password",
    keywords: ["password", "generate", "security", "random", "secret"],
  },
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredTools = ALL_TOOLS.filter((tool) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const handleSelect = (item: ToolRegistryItem) => {
    onClose();
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredTools.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
    } else if (e.key === "Enter" && filteredTools[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredTools[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-md transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-panel border border-focus rounded-2xl shadow-dock overflow-hidden flex flex-col backdrop-blur-2xl transition-all"
        style={{
          background: "rgba(18, 22, 32, 0.96)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.18), 0 30px 80px rgba(0,0,0,0.85)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-dim">
          <Search size={18} className="text-violet flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none outline-none text-main placeholder-muted text-base font-medium"
            placeholder="Search 35+ tools across Calculators, File, SQL, Language & Electronics... (Press Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-main hover:bg-hover transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filtered Tool List */}
        <div className="max-h-[420px] overflow-y-auto p-2 flex flex-col gap-1">
          {filteredTools.length === 0 ? (
            <div className="py-10 text-center text-muted text-sm">
              No matching tools found for "{query}".
            </div>
          ) : (
            filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-accent-glow border border-accent/40 text-main"
                      : "hover:bg-hover text-dim"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-accent text-accent-inverse"
                          : "bg-surface border border-dim text-violet"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-main text-sm">
                          {tool.name}
                        </span>
                      </div>
                      <div className="text-xs text-dim truncate">
                        {tool.description}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface border border-dim text-muted uppercase tracking-wider flex-shrink-0 ml-3">
                    {tool.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="px-4 py-2.5 border-t border-dim flex items-center justify-between text-xs text-muted bg-surface/40">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-dim font-mono text-[10px]">
                ↑
              </kbd>{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-dim font-mono text-[10px]">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-dim font-mono text-[10px]">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>
          <div>
            Press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-dim font-mono text-[10px]">Esc</kbd> to exit
          </div>
        </div>
      </div>
    </div>
  );
}
