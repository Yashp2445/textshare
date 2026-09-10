"use client";

import React, { useState, useRef, useEffect } from "react";
import { Code, ChevronDown, Check } from "lucide-react";

const LANGUAGES = [
  { id: "text", name: "Plain Text" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "csharp", name: "C#" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "json", name: "JSON" },
  { id: "sql", name: "SQL" },
  { id: "bash", name: "Bash / Shell" },
];

interface LanguageSelectorProps {
  language: string;
  onChange: (lang: string) => void;
}

export function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lang-selector-wrapper" ref={dropdownRef}>
      <button
        className={`lang-selector-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Select syntax mode"
        aria-label="Select Code Language"
      >
        <Code size={13} className="text-violet" />
        <span className="lang-name">{selectedLang.name}</span>
        <ChevronDown size={12} className={`chevron-icon ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          <div className="lang-dropdown-header">Syntax Mode</div>
          <div className="lang-dropdown-list">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                className={`lang-dropdown-item ${language === lang.id ? "selected" : ""}`}
                onClick={() => {
                  onChange(lang.id);
                  setIsOpen(false);
                }}
              >
                <span>{lang.name}</span>
                {language === lang.id && <Check size={13} className="text-violet" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
