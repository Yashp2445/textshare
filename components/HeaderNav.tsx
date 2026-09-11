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
  Scale
} from "lucide-react";

export function HeaderNav() {
  const pathname = usePathname();
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);
  const [devDropdownOpen, setDevDropdownOpen] = useState(false);

  const calcDropdownRef = useRef<HTMLDivElement>(null);
  const devDropdownRef = useRef<HTMLDivElement>(null);

  const isCalc = pathname.startsWith("/calculator");
  const isTool = pathname.startsWith("/tools");

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (calcDropdownRef.current && !calcDropdownRef.current.contains(e.target as Node)) {
        setCalcDropdownOpen(false);
      }
      if (devDropdownRef.current && !devDropdownRef.current.contains(e.target as Node)) {
        setDevDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calculatorHighlights = [
    { href: "/calculator", label: "Calculator Hub (All 17)", icon: Calculator, desc: "Explore complete calculator suite" },
    { href: "/calculator?calc=scientific", label: "Scientific Calculator", icon: Sparkles, desc: "Trig, logs & formula history" },
    { href: "/calculator?calc=emi", label: "EMI & Loan Calculator", icon: Landmark, desc: "Monthly EMI & interest donut chart" },
    { href: "/calculator?calc=sip", label: "SIP Investment Calc", icon: TrendingUp, desc: "Mutual fund growth & return chart" },
    { href: "/calculator?calc=bmi", label: "BMI & Health Calc", icon: Activity, desc: "Body mass index & health gauge" },
    { href: "/calculator?calc=percentage", label: "Percentage & Utility", icon: Percent, desc: "Multi-mode percentage tools" },
    { href: "/calculator?calc=unit", label: "Unit Converter", icon: Scale, desc: "Length, weight, temp & speed" },
  ];

  const devTools = [
    { href: "/tools/json", label: "JSON Formatter & Validator", icon: Code2, desc: "Format, validate & minify JSON" },
    { href: "/tools/color", label: "Color Picker & Palettes", icon: Palette, desc: "HEX, RGB, HSL, CMYK & palettes" },
    { href: "/tools/base64-url", label: "Base64 & URL Encoder", icon: Binary, desc: "Encode & decode strings live" },
    { href: "/tools/jwt", label: "JWT Decoder", icon: KeyRound, desc: "Decode headers, payload & signature" },
    { href: "/tools/bcrypt", label: "Bcrypt Hasher & Verifier", icon: ShieldCheck, desc: "Client-side password hashing" },
  ];

  return (
    <nav className="header-segmented-nav" aria-label="Main Navigation">
      <Link
        href="/"
        className={`nav-segment-item ${!isCalc && !isTool ? "active" : ""}`}
      >
        <FileText size={14} />
        <span>LivePad</span>
      </Link>

      {/* Calculator Hub Dropdown */}
      <div className="nav-dropdown-wrapper" ref={calcDropdownRef}>
        <div className="flex items-center">
          <Link
            href="/calculator"
            className={`nav-segment-item ${isCalc ? "active" : ""}`}
            onClick={() => setCalcDropdownOpen(false)}
          >
            <Calculator size={14} />
            <span>Calculators</span>
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCalcDropdownOpen((prev) => !prev);
              setDevDropdownOpen(false);
            }}
            className="px-1 text-dim hover:text-main cursor-pointer"
            aria-expanded={calcDropdownOpen}
            aria-label="Toggle Calculator Menu"
          >
            <ChevronDown 
              size={13} 
              className={`chevron-icon ${calcDropdownOpen ? "open" : ""}`} 
            />
          </button>
        </div>

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
                    onClick={() => setCalcDropdownOpen(false)}
                    className="nav-tools-dropdown-item"
                  >
                    <div className="nav-tool-icon-box">
                      <Icon size={15} />
                    </div>
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

      {/* Dev Tools Dropdown */}
      <div className="nav-dropdown-wrapper" ref={devDropdownRef}>
        <button
          type="button"
          onClick={() => {
            setDevDropdownOpen((prev) => !prev);
            setCalcDropdownOpen(false);
          }}
          className={`nav-segment-item ${isTool ? "active" : ""}`}
          aria-expanded={devDropdownOpen}
        >
          <Wrench size={14} />
          <span>Dev Tools</span>
          <ChevronDown 
            size={13} 
            className={`chevron-icon ${devDropdownOpen ? "open" : ""}`} 
          />
        </button>

        {devDropdownOpen && (
          <div className="nav-tools-dropdown-menu">
            <div className="nav-tools-dropdown-header">Developer Utilities</div>
            <div className="nav-tools-dropdown-list">
              {devTools.map((tool) => {
                const Icon = tool.icon;
                const active = pathname === tool.href;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setDevDropdownOpen(false)}
                    className={`nav-tools-dropdown-item ${active ? "selected" : ""}`}
                  >
                    <div className="nav-tool-icon-box">
                      <Icon size={15} />
                    </div>
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
    </nav>
  );
}
