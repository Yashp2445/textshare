"use client";

import React, { useState } from "react";
import {
  FileText,
  Printer,
  Download,
  ShieldAlert,
  Sparkles,
  Check,
} from "lucide-react";

export function DocPdfTool() {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [content, setContent] = useState(
    `# Document Export Summary\n\nThis client-side document editor allows you to compose text or paste document content and export it directly to PDF using your browser's native print-to-PDF engine.\n\n- Zero server uploads\n- Instant browser PDF generation\n- Free and privacy compliant`
  );

  const handleExportPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; line-height: 1.6; color: #111; }
            h1 { color: #5b21b6; border-bottom: 2px solid #ddd; padding-bottom: 0.5rem; }
            pre { background: #f4f4f5; padding: 1rem; border-radius: 6px; font-family: monospace; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>${documentTitle}</h1>
          <pre>${content}</pre>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="calc-form-grid">
      {/* Editor Panel */}
      <div className="flex flex-col gap-4">
        <div className="calc-input-box">
          <label className="calc-input-label">Document Title</label>
          <div className="calc-num-input-wrapper">
            <input
              type="text"
              className="calc-num-input"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Document Title"
            />
          </div>
        </div>

        <div className="calc-input-box">
          <label className="calc-input-label">Document Content</label>
          <div className="code-panel-box">
            <textarea
              className="code-panel-textarea"
              style={{ minHeight: "320px" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Compose or paste document text here..."
            />
          </div>
        </div>

        <button
          type="button"
          className="calc-segmented-btn active-accent py-3 flex items-center justify-center gap-2 font-bold text-sm"
          onClick={handleExportPdf}
        >
          <Printer size={16} />
          <span>Export Document to PDF (Browser Print)</span>
        </button>
      </div>

      {/* Architecture & Evaluation Statement */}
      <div className="calc-results-column">
        <div className="status-banner" style={{ background: "rgba(168, 85, 247, 0.12)", border: "1px solid var(--border-glow)", padding: "1.25rem" }}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-bold text-main text-sm">
              <ShieldAlert size={18} className="text-violet flex-shrink-0" />
              <span>Architectural Policy & Conversion Evaluation</span>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-main)", lineHeight: "1.5" }}>
              Full binary <strong>DOCX to PDF</strong> and <strong>PDF to DOCX</strong> compilation traditionally requires server-side headless binary engines (such as <code>LibreOffice</code> or <code>Pandoc</code>) or commercial SaaS cloud APIs (such as Adobe PDF Services or CloudConvert).
            </p>

            <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", lineHeight: "1.5" }}>
              In accordance with our strict <strong>Zero Backend Cost</strong> architecture rule, we intentionally avoid paid cloud services or expensive server containers. Instead, we provide this 100% client-side Document & Text PDF rendering engine, ensuring the site remains completely free and unlimited for all visitors.
            </p>

            <div className="flex flex-col gap-1.5 pt-2 border-t border-dim">
              <div className="flex items-center gap-2 text-xs text-main">
                <Check size={14} className="text-emerald-400" />
                <span>100% Free & Client-Side Browser Processing</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-main">
                <Check size={14} className="text-emerald-400" />
                <span>No Server Uploads or File Storage</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-main">
                <Check size={14} className="text-emerald-400" />
                <span>No Paid API Subscriptions or Hidden Costs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
