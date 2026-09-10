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
  ShieldCheck 
} from "lucide-react";

export function HeaderNav() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCalc = pathname.startsWith("/calculator");
  const isTool = pathname.startsWith("/tools");

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <Link
        href="/calculator"
        className={`nav-segment-item ${isCalc ? "active" : ""}`}
      >
        <Calculator size={14} />
        <span>Scientific Calc</span>
      </Link>

      {/* Dev Tools Dropdown */}
      <div className="nav-dropdown-wrapper" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className={`nav-segment-item ${isTool ? "active" : ""}`}
          aria-expanded={dropdownOpen}
        >
          <Wrench size={14} />
          <span>Dev Tools</span>
          <ChevronDown 
            size={13} 
            className={`chevron-icon ${dropdownOpen ? "open" : ""}`} 
          />
        </button>

        {dropdownOpen && (
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
                    onClick={() => setDropdownOpen(false)}
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

