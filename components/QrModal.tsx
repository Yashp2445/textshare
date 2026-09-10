"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, QrCode, Copy, Check } from "lucide-react";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  roomId: string;
  accessCode?: string;
}

export function QrModal({ isOpen, onClose, url, roomId, accessCode }: QrModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <QrCode size={18} className="text-amber" />
            <span>Scan or Share Room</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="qr-container">
            <QRCodeSVG 
              value={url} 
              size={180} 
              bgColor="transparent" 
              fgColor="currentColor"
              level="M"
              includeMargin={false}
            />
          </div>

          <p className="qr-description">
            Scan with your phone camera to join this live sharing room instantly.
          </p>

          {accessCode && (
            <div className="qr-code-box">
              <span className="qr-code-label">Access Code:</span>
              <span className="qr-code-value">{accessCode}</span>
            </div>
          )}

          <div className="qr-link-row">
            <input type="text" readOnly value={url} className="qr-link-input" />
            <button className="btn btn-primary btn-sm" onClick={handleCopyLink}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
