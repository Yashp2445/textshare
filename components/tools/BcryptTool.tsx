"use client";

import React, { useState } from "react";
import bcrypt from "bcryptjs";
import { ShieldCheck, Copy, Check, Info, Lock, CheckCircle2, XCircle, Sliders } from "lucide-react";

export function BcryptTool() {
  const [activeTab, setActiveTab] = useState<"hash" | "verify">("hash");

  // --- Hash Mode State ---
  const [plainText, setPlainText] = useState<string>("MySecurePassword123!");
  const [rounds, setRounds] = useState<number>(10);
  const [generatedHash, setGeneratedHash] = useState<string>("");
  const [execTimeMs, setExecTimeMs] = useState<number | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- Verify Mode State ---
  const [verifyText, setVerifyText] = useState<string>("");
  const [verifyHash, setVerifyHash] = useState<string>("");
  const [matchResult, setMatchResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleGenerateHash = () => {
    if (!plainText) return;
    setIsHashing(true);
    const start = performance.now();

    // Use async hash for smooth browser UI response
    bcrypt.genSalt(rounds, (saltErr, salt) => {
      if (saltErr || !salt) {
        setIsHashing(false);
        return;
      }
      bcrypt.hash(plainText, salt, (hashErr, hash) => {
        const end = performance.now();
        setIsHashing(false);
        if (hash) {
          setGeneratedHash(hash);
          setExecTimeMs(Math.round(end - start));
        }
      });
    });
  };

  const handleVerify = () => {
    if (!verifyText || !verifyHash) return;
    setIsVerifying(true);
    bcrypt.compare(verifyText, verifyHash, (err, res) => {
      setIsVerifying(false);
      setMatchResult(!!res);
    });
  };

  const handleCopyHash = () => {
    if (generatedHash) {
      navigator.clipboard.writeText(generatedHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-card-glass">
      <div className="tool-header">
        <div className="tool-title-group">
          <h1 className="tool-title">
            <ShieldCheck size={22} className="text-violet" />
            Bcrypt Hasher & Verifier
          </h1>
          <p className="tool-subtitle">
            Generate and verify client-side bcrypt password hashes with configurable salt cost rounds.
          </p>
        </div>
      </div>

      {/* Mode Segmented Switcher */}
      <div className="header-segmented-nav" style={{ alignSelf: "flex-start" }}>
        <button
          type="button"
          onClick={() => setActiveTab("hash")}
          className={`nav-segment-item ${activeTab === "hash" ? "active" : ""}`}
        >
          <Lock size={14} />
          <span>Generate Hash</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("verify")}
          className={`nav-segment-item ${activeTab === "verify" ? "active" : ""}`}
        >
          <CheckCircle2 size={14} />
          <span>Verify Match</span>
        </button>
      </div>

      {/* Mode 1: Generate Hash */}
      {activeTab === "hash" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="jwt-section-card">
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Plain Text String to Hash
            </label>
            <input
              type="text"
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="Enter plain text password or string..."
              className="qr-link-input"
              style={{ fontSize: "1rem" }}
            />
          </div>

          {/* Salt Rounds Control */}
          <div className="jwt-section-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sliders size={15} className="text-violet" />
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>
                  Salt Rounds (Cost Factor): <strong>{rounds}</strong>
                </span>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                {rounds <= 8 ? "Fast (Testing)" : rounds <= 11 ? "Recommended" : "Heavy CPU"}
              </span>
            </div>

            <input
              type="range"
              min={4}
              max={14}
              step={1}
              value={rounds}
              onChange={(e) => setRounds(parseInt(e.target.value, 10))}
              className="glass-range-slider"
              style={{ marginTop: "0.75rem" }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleGenerateHash}
              disabled={isHashing || !plainText}
              className="btn btn-primary"
            >
              {isHashing ? "Hashing in Browser..." : "Generate Bcrypt Hash"}
            </button>

            {execTimeMs !== null && !isHashing && (
              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                Computed in {execTimeMs}ms
              </span>
            )}
          </div>

          {/* Result Hash Display */}
          {generatedHash && (
            <div className="jwt-section-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  GENERATED BCRYPT HASH
                </span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="btn btn-secondary btn-sm"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy Hash"}
                </button>
              </div>

              <div 
                className="code-panel-box" 
                style={{ 
                  padding: "0.85rem 1.25rem", 
                  marginTop: "0.5rem", 
                  fontFamily: "var(--font-mono)",
                  fontWeight: "700",
                  color: "var(--accent)",
                  wordBreak: "break-all"
                }}
              >
                {generatedHash}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Verify Match */}
      {activeTab === "verify" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="jwt-section-card">
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Plain Text Value
            </label>
            <input
              type="text"
              value={verifyText}
              onChange={(e) => setVerifyText(e.target.value)}
              placeholder="Plain text to test..."
              className="qr-link-input"
            />
          </div>

          <div className="jwt-section-card">
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Existing Bcrypt Hash ($2a$, $2b$, or $2y$)
            </label>
            <input
              type="text"
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
              placeholder="$2a$10$..."
              className="qr-link-input"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying || !verifyText || !verifyHash}
            className="btn btn-primary"
            style={{ alignSelf: "flex-start" }}
          >
            {isVerifying ? "Comparing..." : "Verify Hash Match"}
          </button>

          {/* Match Status Result */}
          {matchResult !== null && (
            <div className={`status-banner ${matchResult ? "success" : "error"}`}>
              {matchResult ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              <span>
                {matchResult 
                  ? "MATCH CONFIRMED: Plain text matches the provided bcrypt hash!" 
                  : "NO MATCH: Plain text does not match the provided bcrypt hash."
                }
              </span>
            </div>
          )}
        </div>
      )}

      {/* Client Side Notice */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-dim)", paddingTop: "1rem" }}>
        <Info size={14} />
        <span>
          This tool executes 100% client-side in your browser for convenience and experimentation. It is not a substitute for proper server-side password hashing in production.
        </span>
      </div>
    </div>
  );
}
