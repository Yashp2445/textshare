"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "./SocketProvider";

interface SharedFile {
  id: string;
  originalFilename: string;
  size: number;
  mimeType: string;
  uploadedAt: number;
}

interface LivePadProps {
  roomId: string;
  accessCode?: string;
  onAuthFailure?: () => void;
}

export default function LivePad({ roomId, accessCode, onAuthFailure }: LivePadProps) {
  const { socket, isConnected } = useSocket();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Connection & Sync
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("join_room", { roomId, accessCode }, (res: any) => {
      if (res.error) {
        if (onAuthFailure) onAuthFailure();
        return;
      }
      setContent(res.content || "");
      setFiles(res.files || []);
    });

    socket.on("text_update", (data: { content: string }) => {
      setContent(data.content);
      // Flash typing indicator
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    });

    socket.on("file_shared", (file: SharedFile) => {
      setFiles((prev) => [...prev, file]);
    });

    return () => {
      socket.off("text_update");
      socket.off("file_shared");
    };
  }, [socket, isConnected, roomId, accessCode, onAuthFailure]);

  // Handle local text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (socket && isConnected) {
      socket.emit("text_change", { roomId, content: newContent });
    }
  };

  // Handle file uploads
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("roomId", roomId);

    try {
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      // The server will broadcast the 'file_shared' event, so we don't need to manually add it to state here.
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="pad-container">
      {/* Main Text Editor */}
      <div className="pad-editor-section">
        <textarea
          className="editor-textarea"
          placeholder="Start typing to share instantly..."
          value={content}
          onChange={handleTextChange}
          spellCheck={false}
        />
        <div className="status-bar">
          <div className="status-indicator">
            <div className={`status-dot ${isConnected ? "connected" : ""}`} />
            {isConnected ? "Connected" : "Reconnecting..."}
          </div>
          <div className={`typing-indicator ${isTyping ? "active" : ""}`}>
            Someone is typing...
          </div>
          {roomId !== "public" && (
            <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>
              Room: {roomId}
            </div>
          )}
        </div>
      </div>

      {/* Files Sidebar */}
      <div 
        className="pad-sidebar-section"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="sidebar-header">Shared Files</div>
        
        <div className="file-list">
          {files.length === 0 ? (
            <div style={{ color: "var(--text-dim)", fontSize: "0.85rem", textAlign: "center", marginTop: "2rem" }}>
              No files shared yet.
            </div>
          ) : (
            files.map((f) => (
              <a key={f.id} href={`/api/download/${f.id}?name=${encodeURIComponent(f.originalFilename)}`} className="file-item" target="_blank" rel="noreferrer">
                <div className="file-name">{f.originalFilename}</div>
                <div className="file-meta">
                  <span>{formatFileSize(f.size)}</span>
                  <span>↓ Download</span>
                </div>
              </a>
            ))
          )}
        </div>

        <div className="upload-area">
          <input 
            type="file" 
            style={{ display: "none" }} 
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.length) handleFileUpload(e.target.files[0]);
            }}
          />
          <div 
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Uploading..." : "Click or drop a file to share"}
          </div>
        </div>
      </div>
    </div>
  );
}
