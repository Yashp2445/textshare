"use client";

import React, { useState } from "react";
import { Copy, Trash2, Download, QrCode, Lock, Keyboard, Check } from "lucide-react";

interface DockBarProps {
  onCopy: () => void;
  onClear: () => void;
  onDownloadTxt: () => void;
  onOpenQr: () => void;
  onOpenShortcuts: () => void;
  copied: boolean;
}

export function DockBar({
  onCopy,
  onClear,
  onDownloadTxt,
  onOpenQr,
  onOpenShortcuts,
  copied,
}: DockBarProps) {
  return (
    <div className="dock-container">
      <div className="dock-bar">
        {/* Content Group */}
        <button 
          className={`dock-item ${copied ? "active-accent" : ""}`} 
          onClick={onCopy} 
          aria-label="Copy Text"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span className="dock-tooltip">{copied ? "Copied!" : "Copy Text"}</span>
        </button>

        <button 
          className="dock-item dock-item-danger" 
          onClick={onClear} 
          aria-label="Clear Text"
        >
          <Trash2 size={18} />
          <span className="dock-tooltip">Clear Text</span>
        </button>

        <button 
          className="dock-item" 
          onClick={onDownloadTxt} 
          aria-label="Download Text"
        >
          <Download size={18} />
          <span className="dock-tooltip">Download (.txt)</span>
        </button>

        <div className="dock-divider" />

        {/* Room & Sharing Group */}
        <button 
          className="dock-item dock-item-accent" 
          onClick={onOpenQr} 
          aria-label="QR Code & Share Link"
        >
          <QrCode size={18} />
          <span className="dock-tooltip">Share / QR Code</span>
        </button>

        <a 
          href="/group/create" 
          className="dock-item" 
          aria-label="Create Private Group"
        >
          <Lock size={18} />
          <span className="dock-tooltip">New Private Room</span>
        </a>

        <div className="dock-divider" />

        {/* Info & Helper Group */}
        <button 
          className="dock-item" 
          onClick={onOpenShortcuts} 
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard size={18} />
          <span className="dock-tooltip">Shortcuts (⌘K)</span>
        </button>
      </div>
    </div>
  );
}
