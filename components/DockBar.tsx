"use client";

import React, { useState } from "react";
import { Dock, DockItem, DockSeparator } from "@/components/animated-dock";
import { Copy, Trash2, Download, QrCode, Lock, Check } from "lucide-react";

interface DockBarProps {
  onCopy: () => void;
  onClear: () => void;
  onDownloadTxt: () => void;
  onOpenQr: () => void;
  copied: boolean;
}

export function DockBar({
  onCopy,
  onClear,
  onDownloadTxt,
  onOpenQr,
  copied,
}: DockBarProps) {
  const [activeTab, setActiveTab] = useState<string>("");

  return (
    <Dock>
      {/* Group 1: Content Actions */}
      <DockItem
        label={copied ? "Copied!" : "Copy Text"}
        active={copied || activeTab === "copy"}
        onClick={() => {
          setActiveTab("copy");
          onCopy();
        }}
      >
        {copied ? <Check className="h-5 w-5 text-amber" /> : <Copy className="h-5 w-5" />}
      </DockItem>

      <DockItem
        label="Clear Text"
        isDanger
        active={activeTab === "clear"}
        onClick={() => {
          setActiveTab("clear");
          onClear();
        }}
      >
        <Trash2 className="h-5 w-5" />
      </DockItem>

      <DockItem
        label="Download (.txt)"
        active={activeTab === "download"}
        onClick={() => {
          setActiveTab("download");
          onDownloadTxt();
        }}
      >
        <Download className="h-5 w-5" />
      </DockItem>

      <DockSeparator />

      {/* Group 2: Room & Sharing Actions */}
      <DockItem
        label="QR Share"
        active={activeTab === "qr"}
        onClick={() => {
          setActiveTab("qr");
          onOpenQr();
        }}
      >
        <QrCode className="h-5 w-5 text-amber" />
      </DockItem>

      <DockItem
        label="New Private Room"
        active={activeTab === "private"}
        onClick={() => {
          setActiveTab("private");
          window.location.href = "/group/create";
        }}
      >
        <Lock className="h-5 w-5" />
      </DockItem>
    </Dock>
  );
}
