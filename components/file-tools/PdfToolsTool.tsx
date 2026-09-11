"use client";

import React, { useState, useRef } from "react";
import { Upload, Download, FileCheck, Layers, Scissors, ShieldAlert, Sparkles } from "lucide-react";
import { CalcToggleGroup } from "@/components/calculators/CalcSharedUI";

interface PdfFileItem {
  id: string;
  name: string;
  size: number;
  file: File;
}

export function PdfToolsTool() {
  const [mode, setMode] = useState<"merge" | "split">("merge");
  const [pdfFiles, setPdfFiles] = useState<PdfFileItem[]>([]);
  const [splitPageRange, setSplitPageRange] = useState<string>("1-2");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: PdfFileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          file,
        });
      }
    }
    setPdfFiles((prev) => [...prev, ...newItems]);
  };

  const handleMergePdf = async () => {
    if (pdfFiles.length < 2) return;
    setIsProcessing(true);
    try {
      // Dynamic import of pdf-lib for client-side processing
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfFiles) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page: any) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged_document_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplitPdf = async () => {
    if (pdfFiles.length === 0) return;
    setIsProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const srcItem = pdfFiles[0];
      const arrayBuffer = await srcItem.file.arrayBuffer();
      const srcPdf = await PDFDocument.load(arrayBuffer);

      const splitPdf = await PDFDocument.create();
      const totalPages = srcPdf.getPageCount();

      // Parse range e.g. "1-3" or "2"
      let pageIndices: number[] = [];
      if (splitPageRange.includes("-")) {
        const [start, end] = splitPageRange.split("-").map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
            pageIndices.push(i - 1);
          }
        }
      } else {
        const single = parseInt(splitPageRange.trim(), 10);
        if (!isNaN(single) && single >= 1 && single <= totalPages) {
          pageIndices.push(single - 1);
        }
      }

      if (pageIndices.length === 0) {
        pageIndices = srcPdf.getPageIndices();
      }

      const copiedPages = await splitPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach((page: any) => splitPdf.addPage(page));

      const pdfBytes = await splitPdf.save();
      const blob = new Blob([pdfBytes.buffer as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `split_pages_${splitPageRange}_${srcItem.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="calc-form-grid">
      {/* Upload & Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="calc-input-label">PDF Operation Mode</label>
          <CalcToggleGroup
            options={[
              { label: "Merge Multiple PDFs", value: "merge" },
              { label: "Split PDF Pages", value: "split" },
            ]}
            value={mode}
            onChange={(m) => setMode(m as any)}
            accent
          />
        </div>

        <div
          className="border-2 border-dashed border-dim rounded-lg p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-glow transition-all"
          style={{ background: "var(--bg-input)" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="application/pdf"
            multiple={mode === "merge"}
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <div className="w-12 h-12 rounded-full bg-surface border border-dim flex items-center justify-center text-violet">
            <Upload size={22} />
          </div>
          <div className="text-center">
            <div className="font-semibold text-main text-sm">
              Click to select PDF files
            </div>
            <div className="text-xs text-muted mt-1">
              {mode === "merge" ? "Select 2 or more PDF files to combine" : "Select 1 PDF file to extract page ranges"}
            </div>
          </div>
        </div>

        {mode === "split" && pdfFiles.length > 0 && (
          <div className="calc-input-box">
            <label className="calc-input-label">Pages to Extract Range (e.g. 1-3 or 2)</label>
            <div className="calc-num-input-wrapper">
              <input
                type="text"
                className="calc-num-input font-mono"
                value={splitPageRange}
                onChange={(e) => setSplitPageRange(e.target.value)}
                placeholder="e.g. 1-3"
              />
            </div>
          </div>
        )}

        {pdfFiles.length > 0 && (
          <button
            type="button"
            className="calc-segmented-btn active-accent py-3 font-bold flex items-center justify-center gap-2 text-sm"
            onClick={mode === "merge" ? handleMergePdf : handleSplitPdf}
            disabled={isProcessing}
          >
            <Download size={16} />
            <span>
              {isProcessing
                ? "Processing PDF in Browser..."
                : mode === "merge"
                ? `Merge ${pdfFiles.length} PDFs & Download`
                : `Split Pages (${splitPageRange}) & Download`}
            </span>
          </button>
        )}
      </div>

      {/* Selected Files List & Notice */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <FileCheck size={16} className="text-violet" />
            Selected PDF Files ({pdfFiles.length})
          </h3>
          {pdfFiles.length > 0 && (
            <button
              type="button"
              className="text-xs text-muted hover:text-main cursor-pointer"
              onClick={() => setPdfFiles([])}
            >
              Clear
            </button>
          )}
        </div>

        {pdfFiles.length === 0 ? (
          <div className="py-12 text-center text-muted text-sm">
            No PDF files selected yet.
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
            {pdfFiles.map((item, idx) => (
              <div
                key={item.id}
                className="p-2.5 rounded bg-surface border border-dim flex justify-between items-center text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-violet font-mono">{idx + 1}.</span>
                  <span className="text-main font-semibold truncate">{item.name}</span>
                </div>
                <span className="text-muted font-mono flex-shrink-0 ml-2">{formatBytes(item.size)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="status-banner" style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid var(--border-glow)", padding: "1rem" }}>
          <div className="flex items-center gap-2 font-bold text-main text-xs mb-1">
            <ShieldAlert size={16} className="text-violet flex-shrink-0" />
            <span>Client-Side PDF Processing Policy</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", lineHeight: "1.4" }}>
            PDF Merge and Split operations run 100% inside your browser using WebAssembly PDF engines. Heavy PDF raster compression is intentionally omitted to maintain zero recurring backend costs.
          </p>
        </div>
      </div>
    </div>
  );
}
