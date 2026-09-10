"use client";

import React from "react";

interface DockProps {
  children: React.ReactNode;
  className?: string;
}

export function Dock({ children, className = "" }: DockProps) {
  return (
    <div className="dock-container">
      <div className={`dock-bar ${className}`}>
        {children}
      </div>
    </div>
  );
}

interface DockItemProps {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  isDanger?: boolean;
}

export function DockItem({
  children,
  label,
  active = false,
  onClick,
  className = "",
  isDanger = false,
}: DockItemProps) {
  return (
    <button
      className={`dock-item ${active ? "active-item" : ""} ${isDanger ? "dock-item-danger" : ""} ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      {children}
      {active && <span className="dock-active-dot" />}
      <span className="dock-tooltip">{label}</span>
    </button>
  );
}

export function DockSeparator() {
  return <div className="dock-divider" aria-hidden="true" />;
}
