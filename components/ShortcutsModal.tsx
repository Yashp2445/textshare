"use client";

import React from "react";
import { X, Keyboard } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "⌘ / Ctrl + Shift + C", desc: "Copy text content to clipboard" },
    { key: "⌘ / Ctrl + Shift + X", desc: "Clear text content from room" },
    { key: "⌘ / Ctrl + K", desc: "Open Keyboard Shortcuts helper" },
    { key: "Esc", desc: "Close open modal or dialog" },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Keyboard size={18} className="text-amber" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="shortcuts-list">
            {shortcuts.map((s, i) => (
              <div key={i} className="shortcut-row">
                <span className="shortcut-desc">{s.desc}</span>
                <kbd className="shortcut-key">{s.key}</kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
