"use client";

import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, Sparkles } from "lucide-react";
import { CalcInputSlider } from "@/components/calculators/CalcSharedUI";

export function QrGeneratorTool() {
  const [text, setText] = useState<string>("https://liveshare.app");
  const [size, setSize] = useState<number>(200);
  const [fgColor, setFgColor] = useState<string>("#111827");
  const [bgColor, setBgColor] = useState<string>("#ffffff");

  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svgElement = qrRef.current?.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(image, 0, 0);
        const png = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = png;
        downloadLink.download = "qrcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  return (
    <div className="calc-form-grid">
      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <QrCode size={16} className="text-violet" />
            Target Text or URL
          </label>
          <div className="calc-num-input-wrapper">
            <input
              type="text"
              className="calc-num-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL or plain text..."
            />
          </div>
        </div>

        <CalcInputSlider
          label="QR Code Dimension"
          value={size}
          onChange={setSize}
          min={120}
          max={400}
          step={20}
          suffix="px"
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="calc-input-box">
            <label className="calc-input-label">Foreground Color</label>
            <input
              type="color"
              className="w-full h-10 rounded cursor-pointer border border-dim bg-input"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
            />
          </div>

          <div className="calc-input-box">
            <label className="calc-input-label">Background Color</label>
            <input
              type="color"
              className="w-full h-10 rounded cursor-pointer border border-dim bg-input"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Rendered QR Card */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <QrCode size={16} className="text-violet" />
            Generated QR Code Graphic
          </h3>

          <button
            type="button"
            className="calc-segmented-btn active-accent text-xs py-1.5 px-3 flex items-center gap-1.5"
            onClick={handleDownload}
          >
            <Download size={13} />
            <span>Download PNG</span>
          </button>
        </div>

        <div className="glass-chart-wrapper py-6">
          <div ref={qrRef} className="p-4 rounded-xl shadow-xl" style={{ background: bgColor }}>
            <QRCodeSVG value={text || "https://liveshare.app"} size={size} fgColor={fgColor} bgColor={bgColor} />
          </div>
        </div>
      </div>
    </div>
  );
}
