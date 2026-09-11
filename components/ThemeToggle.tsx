"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="theme-toggle-pill opacity-0" aria-hidden="true">
        <div className="theme-toggle-option" />
        <div className="theme-toggle-option" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div 
      className="theme-toggle-pill" 
      role="radiogroup" 
      aria-label="Theme selection"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`theme-toggle-option ${!isDark ? "active light" : ""}`}
        title="Switch to Light theme"
        aria-label="Light theme"
        aria-checked={!isDark}
        role="radio"
      >
        <Sun size={14} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`theme-toggle-option ${isDark ? "active dark" : ""}`}
        title="Switch to Dark theme"
        aria-label="Dark theme"
        aria-checked={isDark}
        role="radio"
      >
        <Moon size={14} />
      </button>
    </div>
  );
}
