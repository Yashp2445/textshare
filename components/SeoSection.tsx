import React from "react";
import { ShieldCheck, Zap, Lock, RefreshCw, FileUp } from "lucide-react";

export function SeoSection() {
  return (
    <section className="seo-section" aria-label="About LiveShare">
      <div className="seo-container">
        <header className="seo-header">
          <h2 className="seo-title">Instant Real-Time Text & File Sharing</h2>
          <p className="seo-subtitle">
            LiveShare is a frictionless, real-time collaboration tool engineered for fast temporary text sharing and file transfers without signups.
          </p>
        </header>

        <div className="seo-grid">
          <div className="seo-card">
            <div className="seo-card-icon">
              <Zap size={22} className="text-amber" />
            </div>
            <h3>Real-Time Synchronized Pad</h3>
            <p>
              Type or paste code snippets, notes, or links. All participants in the room see changes instantly as you type with low latency.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon">
              <Lock size={22} className="text-amber" />
            </div>
            <h3>Private Group Rooms</h3>
            <p>
              Generate password-protected private rooms with unique access codes to collaborate securely with your team or friends.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon">
              <FileUp size={22} className="text-amber" />
            </div>
            <h3>Instant Drag & Drop Files</h3>
            <p>
              Upload images, PDFs, code archives, or documents. Anyone with room access can download files directly from the shared list.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon">
              <RefreshCw size={22} className="text-amber" />
            </div>
            <h3>Automatic Ephemeral Cleanup</h3>
            <p>
              Inactive rooms and files are automatically purged after 12 hours of inactivity, ensuring your data never lingers permanently.
            </p>
          </div>
        </div>

        <article className="seo-article">
          <h3>How LiveShare Differs From Static Pastebins</h3>
          <p>
            Unlike traditional static paste sites that require manual saving and generate permanent public URLs, LiveShare creates an interactive workspace. When you open a public or private room, your changes sync live across browsers and devices. With integrated QR code sharing and cross-device connectivity, transferring text from desktop to phone takes seconds.
          </p>
        </article>
      </div>
    </section>
  );
}
