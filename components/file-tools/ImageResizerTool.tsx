"use client";

import React, { useState, useRef } from "react";
import { Upload, Download, Image as ImageIcon, Lock, Unlock, RefreshCcw } from "lucide-react";
import { CalcToggleGroup, CalcInputSlider } from "@/components/calculators/CalcSharedUI";

export function ImageResizerTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>("");
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [percentageScale, setPercentageScale] = useState<number>(100);
  const [resizeMode, setResizeMode] = useState<"pixels" | "percentage">("percentage");

  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageLoad = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalName(file.name);
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setImageSrc(e.target?.result as string);
        generateResized(img, img.width, img.height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const generateResized = (img: HTMLImageElement, w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, w);
    canvas.height = Math.max(1, h);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, w, h);
      setResizedUrl(canvas.toDataURL("image/png"));
    }
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    let h = targetHeight;
    if (lockAspectRatio && origWidth > 0) {
      h = Math.round((w / origWidth) * origHeight);
      setTargetHeight(h);
    }
    if (imageSrc) {
      const img = new Image();
      img.onload = () => generateResized(img, w, h);
      img.src = imageSrc;
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    let w = targetWidth;
    if (lockAspectRatio && origHeight > 0) {
      w = Math.round((h / origHeight) * origWidth);
      setTargetWidth(w);
    }
    if (imageSrc) {
      const img = new Image();
      img.onload = () => generateResized(img, w, h);
      img.src = imageSrc;
    }
  };

  const handleScaleChange = (scalePct: number) => {
    setPercentageScale(scalePct);
    const w = Math.round((origWidth * scalePct) / 100);
    const h = Math.round((origHeight * scalePct) / 100);
    setTargetWidth(w);
    setTargetHeight(h);
    if (imageSrc) {
      const img = new Image();
      img.onload = () => generateResized(img, w, h);
      img.src = imageSrc;
    }
  };

  return (
    <div className="calc-form-grid">
      {/* Upload & Settings */}
      <div className="flex flex-col gap-4">
        <div
          className="border-2 border-dashed border-dim rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-glow transition-all"
          style={{ background: "var(--bg-input)" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageLoad(e.target.files[0])}
          />
          <div className="w-12 h-12 rounded-full bg-surface border border-dim flex items-center justify-center text-violet">
            <Upload size={22} />
          </div>
          <div className="text-center">
            <div className="font-semibold text-main text-sm">
              {originalName ? originalName : "Click to select or upload image to resize"}
            </div>
            <div className="text-xs text-muted mt-1">
              {origWidth > 0 ? `Original Dimensions: ${origWidth} × ${origHeight} px` : "100% Client-Side Canvas Resizer"}
            </div>
          </div>
        </div>

        {imageSrc && (
          <div className="flex flex-col gap-4 p-4 rounded-lg bg-surface border border-dim">
            <div className="flex flex-col gap-2">
              <label className="calc-input-label">Resize Unit</label>
              <CalcToggleGroup
                options={[
                  { label: "Percentage Scale", value: "percentage" },
                  { label: "Exact Pixels (W×H)", value: "pixels" },
                ]}
                value={resizeMode}
                onChange={(m) => setResizeMode(m as any)}
                accent
              />
            </div>

            {resizeMode === "percentage" ? (
              <div className="flex flex-col gap-2">
                <CalcInputSlider
                  label="Scale Ratio"
                  value={percentageScale}
                  onChange={handleScaleChange}
                  min={10}
                  max={300}
                  step={5}
                  suffix="%"
                />
                <div className="flex gap-2">
                  {[25, 50, 75, 100, 150, 200].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      className={`calc-segmented-btn text-xs py-1 ${percentageScale === pct ? "active" : ""}`}
                      onClick={() => handleScaleChange(pct)}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-main">Lock Aspect Ratio</span>
                  <button
                    type="button"
                    className="calc-segmented-btn py-1 px-3 text-xs flex items-center gap-1"
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  >
                    {lockAspectRatio ? <Lock size={12} className="text-violet" /> : <Unlock size={12} />}
                    <span>{lockAspectRatio ? "Locked" : "Unlocked"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="calc-input-box">
                    <label className="calc-input-label">Width (px)</label>
                    <div className="calc-num-input-wrapper">
                      <input
                        type="number"
                        className="calc-num-input"
                        value={targetWidth}
                        onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 1)}
                      />
                    </div>
                  </div>

                  <div className="calc-input-box">
                    <label className="calc-input-label">Height (px)</label>
                    <div className="calc-num-input-wrapper">
                      <input
                        type="number"
                        className="calc-num-input"
                        value={targetHeight}
                        onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 1)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resized Image Output */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <ImageIcon size={16} className="text-violet" />
            Resized Image Preview ({targetWidth} × {targetHeight} px)
          </h3>

          {resizedUrl && (
            <a
              href={resizedUrl}
              download={`resized_${targetWidth}x${targetHeight}_${originalName || "image.png"}`}
              className="calc-segmented-btn active-accent text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>Download PNG</span>
            </a>
          )}
        </div>

        {!resizedUrl ? (
          <div className="py-16 text-center text-muted text-sm flex flex-col items-center gap-2">
            <Upload size={32} opacity={0.4} />
            <span>Upload an image to resize dimensions.</span>
          </div>
        ) : (
          <div className="glass-chart-wrapper py-4 flex flex-col items-center gap-3">
            <img
              src={resizedUrl}
              alt="Resized Preview"
              className="max-h-72 object-contain rounded border border-dim shadow-lg"
            />
            <div className="text-xs text-muted font-mono">
              Dimensions: <strong>{targetWidth} × {targetHeight} px</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
