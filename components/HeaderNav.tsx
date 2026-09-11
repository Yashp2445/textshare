"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { 
  FileText, 
  Calculator, 
  Wrench, 
  ChevronDown, 
  Code2, 
  Palette, 
  Binary, 
  KeyRound, 
  ShieldCheck,
  Sparkles,
  Landmark,
  TrendingUp,
  Activity,
  Percent,
  Scale,
  FolderArchive,
  Image as ImageIcon,
  FileCode,
  Database,
  Terminal,
  Layers,
  BookOpen,
  Cpu,
  Zap,
  Type,
  QrCode,
  Lock,
  FileSearch,
  FileCheck,
} from "lucide-react";

export function HeaderNav() {
  const pathname = usePathname();

  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);
  const [fileDropdownOpen, setFileDropdownOpen] = useState(false);
  const [sqlDropdownOpen, setSqlDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [elecDropdownOpen, setElecDropdownOpen] = useState(false);
  const [devDropdownOpen, setDevDropdownOpen] = useState(false);

  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const calcRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLDivElement>(null);
  const sqlRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const elecRef = useRef<HTMLDivElement>(null);
  const devRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const isCalc = pathname.startsWith("/calculator");
  const isFileTools = pathname.startsWith("/tools/file-tools");
  const isSqlTools = pathname.startsWith("/tools/sql-tools");
  const isLangTools = pathname.startsWith("/tools/language-tools");
  const isElecTools = pathname.startsWith("/tools/electronics-tools");
  const isDevTools = pathname.startsWith("/tools/dev-tools") || pathname === "/tools/json" || pathname === "/tools/color" || pathname === "/tools/base64-url" || pathname === "/tools/jwt" || pathname === "/tools/bcrypt";

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calcRef.current && !calcRef.current.contains(e.target as Node)) setCalcDropdownOpen(false);
      if (fileRef.current && !fileRef.current.contains(e.target as Node)) setFileDropdownOpen(false);
      if (sqlRef.current && !sqlRef.current.contains(e.target as Node)) setSqlDropdownOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangDropdownOpen(false);
      if (elecRef.current && !elecRef.current.contains(e.target as Node)) setElecDropdownOpen(false);
      if (devRef.current && !devRef.current.contains(e.target as Node)) setDevDropdownOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAll = () => {
    setCalcDropdownOpen(false);
    setFileDropdownOpen(false);
    setSqlDropdownOpen(false);
    setLangDropdownOpen(false);
    setElecDropdownOpen(false);
    setDevDropdownOpen(false);
    setMoreDropdownOpen(false);
  };

  const calculatorHighlights = [
    { href: "/calculator", label: "Calculator Hub (All 17)", icon: Calculator, desc: "Explore complete calculator suite" },
    { href: "/calculator?calc=scientific", label: "Scientific Calculator", icon: Sparkles, desc: "Trig, logs & formula history" },
    { href: "/calculator?calc=emi", label: "EMI & Loan Calculator", icon: Landmark, desc: "Monthly EMI & interest donut chart" },
    { href: "/calculator?calc=sip", label: "SIP Investment Calc", icon: TrendingUp, desc: "Mutual fund growth & return chart" },
    { href: "/calculator?calc=bmi", label: "BMI & Health Calc", icon: Activity, desc: "Body mass index & health gauge" },
    { href: "/calculator?calc=percentage", label: "Percentage & Utility", icon: Percent, desc: "Multi-mode percentage tools" },
    { href: "/calculator?calc=unit", label: "Unit Converter", icon: Scale, desc: "Length, weight, temp & speed" },
  ];

  const fileToolsList = [
    { href: "/tools/file-tools", label: "File Tools Hub", icon: FolderArchive, desc: "Client-side processing suite" },
    { href: "/tools/file-tools?tool=image", label: "Image Compressor & Convert", icon: ImageIcon, desc: "PNG, JPG, WebP quality slider" },
    { href: "/tools/file-tools?tool=resize", label: "Image Resizer", icon: ImageIcon, desc: "Resize dimensions & percentage scale" },
    { href: "/tools/file-tools?tool=csv-json", label: "CSV ↔ JSON Converter", icon: FileCode, desc: "Bi-directional parsing & format" },
    { href: "/tools/file-tools?tool=pdf-tools", label: "PDF Merge & Split", icon: FileCheck, desc: "Combine & extract PDF pages" },
    { href: "/tools/file-tools?tool=doc-pdf", label: "Document to PDF Utility", icon: FileText, desc: "Local document exporter & notice" },
  ];

  const sqlToolsList = [
    { href: "/tools/sql-tools", label: "SQL Tools Hub", icon: Database, desc: "Explore all SQL utilities" },
    { href: "/tools/sql-tools?tool=playground", label: "In-Browser SQL Sandbox", icon: Database, desc: "SQLite WASM database playground" },
    { href: "/tools/sql-tools?tool=formatter", label: "SQL Formatter", icon: Terminal, desc: "Format & beautify SQL queries" },
    { href: "/tools/sql-tools?tool=erd", label: "ER Diagram Generator", icon: Layers, desc: "Parse DDL to visual ER diagrams" },
  ];

  const langToolsList = [
    { href: "/tools/language-tools", label: "Language Tools Hub", icon: Code2, desc: "Explore all programming tools" },
    { href: "/tools/language-tools?tool=formatter", label: "Multi-Language Formatter", icon: Code2, desc: "JS, TS, CSS, HTML, JSON, Markdown" },
    { href: "/tools/language-tools?tool=minifier", label: "Code Minifier (JS & CSS)", icon: Binary, desc: "Compress code with size stats" },
    { href: "/tools/language-tools?tool=carbon", label: "Code to Image Generator", icon: Palette, desc: "Carbon-style code snippet cards" },
    { href: "/tools/language-tools?tool=cheatsheet", label: "Developer Cheat Sheets", icon: BookOpen, desc: "Git, Regex, SQL joins, VS Code" },
  ];

  const elecToolsList = [
    { href: "/tools/electronics-tools", label: "Electronics Tools Hub", icon: Cpu, desc: "Explore 11 electronics tools" },
    { href: "/tools/electronics-tools?tool=resistor", label: "Resistor Color Code", icon: Cpu, desc: "Decode 4/5/6 color bands" },
    { href: "/tools/electronics-tools?tool=ohms", label: "Ohm's Law Calculator", icon: Zap, desc: "V, I, R, P relationship wheel" },
    { href: "/tools/electronics-tools?tool=555", label: "555 Timer Calculator", icon: Cpu, desc: "Astable & Monostable frequency" },
    { href: "/tools/electronics-tools?tool=logic", label: "Logic Gate Simulator", icon: Layers, desc: "AND, OR, NOT, XOR signal flow" },
    { href: "/tools/electronics-tools?tool=circuit", label: "Circuit Schematic Builder", icon: Cpu, desc: "Drag & drop visual circuit builder" },
  ];

  const devToolsList = [
    { href: "/tools/dev-tools", label: "Dev Utilities Hub (All 10)", icon: Wrench, desc: "Explore complete dev utility suite" },
    { href: "/tools/dev-tools?tool=json", label: "JSON Formatter & Validator", icon: Code2, desc: "Format, validate & minify JSON" },
    { href: "/tools/dev-tools?tool=color", label: "Color Picker & Palettes", icon: Palette, desc: "HEX, RGB, HSL, CMYK & palettes" },
    { href: "/tools/dev-tools?tool=base64", label: "Base64 & URL Encoder", icon: Binary, desc: "Encode & decode strings live" },
    { href: "/tools/dev-tools?tool=jwt", label: "JWT Decoder", icon: KeyRound, desc: "Decode headers & payload claims" },
    { href: "/tools/dev-tools?tool=bcrypt", label: "Bcrypt Hasher & Verifier", icon: ShieldCheck, desc: "Client-side password hashing" },
    { href: "/tools/dev-tools?tool=wordcounter", label: "Word & Character Counter", icon: Type, desc: "Live word, char & reading time" },
    { href: "/tools/dev-tools?tool=qr", label: "QR Code Generator", icon: QrCode, desc: "Generate & download QR images" },
    { href: "/tools/dev-tools?tool=case", label: "Text Case Converter", icon: FileSearch, desc: "UPPER, lower, Title, camelCase" },
    { href: "/tools/dev-tools?tool=password", label: "Password Generator", icon: Lock, desc: "Random secure passwords & strength" },
    { href: "/tools/dev-tools?tool=lorem", label: "Lorem Ipsum Generator", icon: FileText, desc: "Placeholder text generator" },
  ];

  return (
    <nav className="header-segmented-nav" aria-label="Main Navigation">
      {/* LivePad Link Segment */}
          <Link
            href="/"
            className={`nav-segment-item ${!isCalc && !isFileTools && !isSqlTools && !isLangTools && !isElecTools && !isDevTools ? "active" : ""}`}
          >
            <FileText size={14} />
            <span>LivePad</span>
          </Link>

          {/* Calculators Dropdown Segment */}
          <div className="nav-dropdown-wrapper" ref={calcRef}>
            <button
              type="button"
              onClick={() => {
                const next = !calcDropdownOpen;
                closeAll();
                setCalcDropdownOpen(next);
              }}
              className={`nav-segment-item ${isCalc ? "active" : ""}`}
              aria-expanded={calcDropdownOpen}
            >
              <Calculator size={14} />
              <span>Calculators</span>
              <ChevronDown size={13} className={`chevron-icon ${calcDropdownOpen ? "open" : ""}`} />
            </button>

            {calcDropdownOpen && (
              <div className="nav-tools-dropdown-menu" style={{ width: "300px" }}>
                <div className="nav-tools-dropdown-header flex justify-between items-center">
                  <span>Calculator Suite</span>
                  <span className="text-violet font-semibold">17 Tools</span>
                </div>
                <div className="nav-tools-dropdown-list">
                  {calculatorHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeAll}
                        className="nav-tools-dropdown-item"
                      >
                        <div className="nav-tool-icon-box"><Icon size={15} /></div>
                        <div className="nav-tool-text-box">
                          <div className="nav-tool-title">{item.label}</div>
                          <div className="nav-tool-desc">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* File Tools Dropdown Segment */}
          <div className="nav-dropdown-wrapper" ref={fileRef}>
            <button
              type="button"
              onClick={() => {
                const next = !fileDropdownOpen;
                closeAll();
                setFileDropdownOpen(next);
              }}
              className={`nav-segment-item ${isFileTools ? "active" : ""}`}
              aria-expanded={fileDropdownOpen}
            >
              <FolderArchive size={14} />
              <span>File Tools</span>
              <ChevronDown size={13} className={`chevron-icon ${fileDropdownOpen ? "open" : ""}`} />
            </button>

            {fileDropdownOpen && (
              <div className="nav-tools-dropdown-menu" style={{ width: "300px" }}>
                <div className="nav-tools-dropdown-header flex justify-between items-center">
                  <span>File Utilities</span>
                  <span className="text-violet font-semibold">Client-Side</span>
                </div>
                <div className="nav-tools-dropdown-list">
                  {fileToolsList.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={closeAll}
                        className="nav-tools-dropdown-item"
                      >
                        <div className="nav-tool-icon-box"><Icon size={15} /></div>
                        <div className="nav-tool-text-box">
                          <div className="nav-tool-title">{tool.label}</div>
                          <div className="nav-tool-desc">{tool.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SQL Tools Dropdown Segment */}
          <div className="hidden xl:block nav-dropdown-wrapper" ref={sqlRef}>
            <button
              type="button"
              onClick={() => {
                const next = !sqlDropdownOpen;
                closeAll();
                setSqlDropdownOpen(next);
              }}
              className={`nav-segment-item ${isSqlTools ? "active" : ""}`}
              aria-expanded={sqlDropdownOpen}
            >
              <Database size={14} />
              <span>SQL Tools</span>
              <ChevronDown size={13} className={`chevron-icon ${sqlDropdownOpen ? "open" : ""}`} />
            </button>

            {sqlDropdownOpen && (
              <div className="nav-tools-dropdown-menu" style={{ width: "300px" }}>
                <div className="nav-tools-dropdown-header flex justify-between items-center">
                  <span>SQL Utilities</span>
                  <span className="text-violet font-semibold">SQLite WASM</span>
                </div>
                <div className="nav-tools-dropdown-list">
                  {sqlToolsList.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={closeAll}
                        className="nav-tools-dropdown-item"
                      >
                        <div className="nav-tool-icon-box"><Icon size={15} /></div>
                        <div className="nav-tool-text-box">
                          <div className="nav-tool-title">{tool.label}</div>
                          <div className="nav-tool-desc">{tool.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Language Tools Dropdown Segment */}
          <div className="hidden xl:block nav-dropdown-wrapper" ref={langRef}>
            <button
              type="button"
              onClick={() => {
                const next = !langDropdownOpen;
                closeAll();
                setLangDropdownOpen(next);
              }}
              className={`nav-segment-item ${isLangTools ? "active" : ""}`}
              aria-expanded={langDropdownOpen}
            >
              <Code2 size={14} />
              <span>Language Tools</span>
              <ChevronDown size={13} className={`chevron-icon ${langDropdownOpen ? "open" : ""}`} />
            </button>

            {langDropdownOpen && (
              <div className="nav-tools-dropdown-menu" style={{ width: "300px" }}>
                <div className="nav-tools-dropdown-header flex justify-between items-center">
                  <span>Programming Tools</span>
                  <span className="text-violet font-semibold">Client-Side</span>
                </div>
                <div className="nav-tools-dropdown-list">
                  {langToolsList.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={closeAll}
                        className="nav-tools-dropdown-item"
                      >
                        <div className="nav-tool-icon-box"><Icon size={15} /></div>
                        <div className="nav-tool-text-box">
                          <div className="nav-tool-title">{tool.label}</div>
                          <div className="nav-tool-desc">{tool.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Electronics Tools Dropdown Segment */}
          <div className="hidden xl:block nav-dropdown-wrapper" ref={elecRef}>
            <button
              type="button"
              onClick={() => {
                const next = !elecDropdownOpen;
                closeAll();
                setElecDropdownOpen(next);
              }}
              className={`nav-segment-item ${isElecTools ? "active" : ""}`}
              aria-expanded={elecDropdownOpen}
            >
              <Cpu size={14} />
              <span>Electronics</span>
              <ChevronDown size={13} className={`chevron-icon ${elecDropdownOpen ? "open" : ""}`} />
            </button>

            {elecDropdownOpen && (
              <div className="nav-tools-dropdown-menu" style={{ width: "300px" }}>
                <div className="nav-tools-dropdown-header flex justify-between items-center">
                  <span>Electronics Suite</span>
                  <span className="text-violet font-semibold">11 Tools</span>
                </div>
                <div className="nav-tools-dropdown-list">
                  {elecToolsList.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={closeAll}
                        className="nav-tools-dropdown-item"
                      >
                        <div className="nav-tool-icon-box"><Icon size={15} /></div>
                        <div className="nav-tool-text-box">
                          <div className="nav-tool-title">{tool.label}</div>
                          <div className="nav-tool-desc">{tool.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Dev Utilities Dropdown Segment */}
          <div className="nav-dropdown-wrapper" ref={devRef}>
            <button
              type="button"
              onClick={() => {
                const next = !devDropdownOpen;
                closeAll();
                setDevDropdownOpen(next);
              }}
              className={`nav-segment-item ${isDevTools ? "active" : ""}`}
              aria-expanded={devDropdownOpen}
            >
              <Wrench size={14} />
              <span>Dev Utilities</span>
              <ChevronDown size={13} className={`chevron-icon ${devDropdownOpen ? "open" : ""}`} />
            </button>

            {devDropdownOpen && (
              <div className="nav-tools-dropdown-menu" style={{ width: "310px" }}>
                <div className="nav-tools-dropdown-header flex justify-between items-center">
                  <span>Dev & Utility Suite</span>
                  <span className="text-violet font-semibold">10 Tools</span>
                </div>
                <div className="nav-tools-dropdown-list">
                  {devToolsList.map((tool) => {
                    const Icon = tool.icon;
                    const active = pathname.startsWith(tool.href);
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={closeAll}
                        className={`nav-tools-dropdown-item ${active ? "selected" : ""}`}
                      >
                        <div className="nav-tool-icon-box"><Icon size={15} /></div>
                        <div className="nav-tool-text-box">
                          <div className="nav-tool-title">{tool.label}</div>
                          <div className="nav-tool-desc">{tool.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Responsive Overflow 'More' Dropdown Segment (< 1280px) */}
          <div className="xl:hidden nav-dropdown-wrapper" ref={moreRef}>
            <button
              type="button"
              onClick={() => {
                const next = !moreDropdownOpen;
                closeAll();
                setMoreDropdownOpen(next);
              }}
              className={`nav-segment-item ${isSqlTools || isLangTools || isElecTools ? "active" : ""}`}
              aria-expanded={moreDropdownOpen}
            >
              <Wrench size={14} />
              <span>More</span>
              <ChevronDown size={13} className={`chevron-icon ${moreDropdownOpen ? "open" : ""}`} />
            </button>

            {moreDropdownOpen && (
              <div className="nav-tools-dropdown-menu" style={{ width: "260px" }}>
                <div className="nav-tools-dropdown-header flex justify-between items-center">
                  <span>Additional Hubs</span>
                </div>
                <div className="nav-tools-dropdown-list">
                  <Link
                    href="/tools/sql-tools"
                    onClick={closeAll}
                    className={`nav-tools-dropdown-item ${isSqlTools ? "selected" : ""}`}
                  >
                    <div className="nav-tool-icon-box"><Database size={15} /></div>
                    <div className="nav-tool-text-box">
                      <div className="nav-tool-title">SQL Tools</div>
                      <div className="nav-tool-desc">SQLite WASM Sandbox & DDL</div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/language-tools"
                    onClick={closeAll}
                    className={`nav-tools-dropdown-item ${isLangTools ? "selected" : ""}`}
                  >
                    <div className="nav-tool-icon-box"><Code2 size={15} /></div>
                    <div className="nav-tool-text-box">
                      <div className="nav-tool-title">Language Tools</div>
                      <div className="nav-tool-desc">Code Formatters & Cards</div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/electronics-tools"
                    onClick={closeAll}
                    className={`nav-tools-dropdown-item ${isElecTools ? "selected" : ""}`}
                  >
                    <div className="nav-tool-icon-box"><Cpu size={15} /></div>
                    <div className="nav-tool-text-box">
                      <div className="nav-tool-title">Electronics Tools</div>
                      <div className="nav-tool-desc">11 Electronics Calculators</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
  );
}

