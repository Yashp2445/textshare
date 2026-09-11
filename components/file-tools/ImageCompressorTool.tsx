"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Sparkles,
  RefreshCcw,
  CheckCircle,
  FileDown,
} from "lucide-react";
import { CalcInputSlider, CalcToggleGroup } from "@/components/calculators/CalcSharedUI";

interface ProcessedImage {
  id: string;
  originalName: string;
  originalSize: number;
  originalUrl: string;
  convertedUrl: string;
  convertedSize: number;
  format: "image/png" | "image/jpeg" | "image/webp";
  quality: number;
  width: number;
  height: number;
}

export function ImageCompressorTool() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [targetFormat, setTargetFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/webp");
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File, format: string, qual: number): Promise<ProcessedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject("Canvas context error");
            return;
          }

          // If JPEG, fill white background to avoid transparent black artifact
          if (format === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject("Blob error");
                return;
              }
              const convertedUrl = URL.createObjectURL(blob);
              resolve({
                id: Math.random().toString(36).substring(2, 9),
                originalName: file.name,
                originalSize: file.size,
                originalUrl: e.target?.result as string,
                convertedUrl,
                convertedSize: blob.size,
                format: format as any,
                quality: qual,
                width: img.width,
                height: img.height,
              });
            },
            format,
            qual / 100
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const newProcessedList: ProcessedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const processed = await processFile(file, targetFormat, quality);
          newProcessedList.push(processed);
        }
      }
      setImages((prev) => [...prev, ...newProcessedList]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const reprocessAll = async (newFormat: string, newQuality: number) => {
    if (images.length === 0) return;
    setIsProcessing(true);
    try {
      const updated: ProcessedImage[] = [];
      for (const item of images) {
        // Fetch blob from originalUrl
        const res = await fetch(item.originalUrl);
        const blob = await res.blob();
        const file = new File([blob], item.originalName, { type: blob.type });
        const proc = await processFile(file, newFormat, newQuality);
        updated.push(proc);
      }
      setImages(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getExtension = (fmt: string) => {
    if (fmt === "image/png") return ".png";
    if (fmt === "image/jpeg") return ".jpg";
    return ".webp";
  };

  return (
    <div className="calc-form-grid">
      {/* Settings & Upload Area */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">Output Image Format</label>
          <CalcToggleGroup
            options={[
              { label: "WebP (Optimal)", value: "image/webp" },
              { label: "PNG (Lossless)", value: "image/png" },
              { label: "JPG (Standard)", value: "image/jpeg" },
            ]}
            value={targetFormat}
            onChange={(val) => {
              setTargetFormat(val as any);
              reprocessAll(val, quality);
            }}
            accent
          />
        </div>

        <CalcInputSlider
          label="Compression Quality"
          value={quality}
          onChange={(q) => {
            setQuality(q);
            reprocessAll(targetFormat, q);
          }}
          min={5}
          max={100}
          step={5}
          suffix="%"
        />

        {/* Drag & Drop Upload Card */}
        <div
          className="border-2 border-dashed border-dim rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-glow transition-all"
          style={{ background: "var(--bg-input)" }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileSelect(e.dataTransfer.files);
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <div className="w-12 h-12 rounded-full bg-surface border border-dim flex items-center justify-center text-violet">
            <Upload size={22} />
          </div>
          <div className="text-center">
            <div className="font-semibold text-main text-sm">
              Click to select or drag & drop images
            </div>
            <div className="text-xs text-muted mt-1">
              Supports PNG, JPG, WebP, GIF, BMP • 100% Client-Side
            </div>
          </div>
        </div>

        <div className="status-banner" style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          <Sparkles size={16} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
            Privacy Guaranteed: Image conversion runs entirely inside your browser using HTML5 Canvas. Zero network upload to any server.
          </span>
        </div>
      </div>

      {/* Processed Results & Download List */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <ImageIcon size={16} className="text-violet" />
            Processed Images ({images.length})
          </h3>
          {images.length > 0 && (
            <button
              type="button"
              className="text-xs text-muted hover:text-main cursor-pointer"
              onClick={() => setImages([])}
            >
              Clear List
            </button>
          )}
        </div>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted gap-2">
            <Upload size={32} opacity={0.4} />
            <div className="text-sm">No images uploaded yet.</div>
            <div className="text-xs">Upload images on the left to compress and convert.</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
            {images.map((item) => {
              const diff = item.originalSize - item.convertedSize;
              const savingsPct = ((diff / item.originalSize) * 100).toFixed(1);
              const isSmaller = diff > 0;

              return (
                <div
                  key={item.id}
                  className="bg-surface border border-dim rounded-md p-3 flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* Thumbnail */}
                      <img
                        src={item.convertedUrl}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded border border-dim flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-main truncate">
                          {item.originalName}
                        </div>
                        <div className="text-[11px] text-muted">
                          {item.width}x{item.height}px • Quality {item.quality}%
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.convertedUrl}
                      download={`compressed_${item.originalName.replace(/\.[^/.]+$/, "")}${getExtension(item.format)}`}
                      className="calc-segmented-btn active-accent flex items-center gap-1.5 px-3 py-1.5 text-xs flex-shrink-0"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </a>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1 border-t border-dim">
                    <span className="text-muted">
                      Original: <strong>{formatBytes(item.originalSize)}</strong>
                    </span>
                    <span className="text-muted">
                      New: <strong className="text-violet">{formatBytes(item.convertedSize)}</strong>
                    </span>
                    <span className={`font-semibold ${isSmaller ? "text-emerald-400" : "text-amber-400"}`}>
                      {isSmaller ? `-${savingsPct}% Smaller` : `+${Math.abs(Number(savingsPct))}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
