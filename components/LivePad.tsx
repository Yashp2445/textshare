"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "./SocketProvider";
import { DockBar } from "./DockBar";
import { QrModal } from "./QrModal";
import { ShortcutsModal } from "./ShortcutsModal";
import { Users, Clock, FileUp, Download, Shield, QrCode } from "lucide-react";

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
  const { socket, isConnected, isFallbackMode } = useSocket();
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 0, col: 0 });

  // Modal states
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Persistent Client ID for active heartbeat counting
  const clientId = useRef<string>(
    typeof window !== "undefined"
      ? (sessionStorage.getItem("ls_client_id") || Math.random().toString(36).substring(2, 10))
      : "client_node"
  ).current;

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("ls_client_id")) {
      sessionStorage.setItem("ls_client_id", clientId);
    }
  }, [clientId]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastLocalTypingTime = useRef<number>(0);
  const postTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate stats
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Track cursor position
  const updateCursorPos = () => {
    if (!textareaRef.current) return;
    if (!content) {
      setCursorPos({ line: 0, col: 0 });
      return;
    }
    const pos = textareaRef.current.selectionStart || 0;
    const textBefore = content.slice(0, pos);
    const lines = textBefore.split("\n");
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setCursorPos({ line, col });
  };

  // ── Polling / Serverless Fallback Sync ──
  const fetchRoomState = useCallback(async () => {
    try {
      const query = accessCode ? `&accessCode=${encodeURIComponent(accessCode)}` : "";
      const res = await fetch(`/api/room/${roomId}?clientId=${clientId}${query}`);
      
      if (res.status === 403 || res.status === 404) {
        if (onAuthFailure) onAuthFailure();
        return;
      }

      if (!res.ok) return;

      const data = await res.json();
      if (data.success && data.room) {
        if (Date.now() - lastLocalTypingTime.current > 1200) {
          if (data.room.content !== content) {
            setContent(data.room.content || "");
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 1000);
          }
        }
        if (data.room.files) {
          setFiles(data.room.files);
        }
        if (data.room.activeUsers) {
          setActiveUsers(data.room.activeUsers);
        }
      }
    } catch {
      // Ignore transient network errors
    }
  }, [roomId, accessCode, clientId, onAuthFailure, content]);

  // Syncing lifecycle
  useEffect(() => {
    if (isFallbackMode || !socket || !isConnected) {
      fetchRoomState();
      const interval = setInterval(fetchRoomState, 1500);
      return () => clearInterval(interval);
    }

    socket.emit("join_room", { roomId, accessCode }, (res: any) => {
      if (res?.error) {
        if (onAuthFailure) onAuthFailure();
        return;
      }
      if (res) {
        setContent(res.content || "");
        setFiles(res.files || []);
        if (res.activeUsers) setActiveUsers(res.activeUsers);
      }
    });

    socket.on("text_update", (data: { content: string }) => {
      setContent(data.content);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    });

    socket.on("user_count_change", (data: { count: number }) => {
      if (data.count) {
        setActiveUsers(data.count);
      }
    });

    socket.on("file_shared", (file: SharedFile) => {
      setFiles((prev) => [...prev, file]);
    });

    socket.on("file_deleted", (data: { fileId: string }) => {
      setFiles((prev) => prev.filter((f) => f.id !== data.fileId));
    });

    socket.on("files_cleared", () => {
      setFiles([]);
    });

    return () => {
      socket.off("text_update");
      socket.off("user_count_change");
      socket.off("file_shared");
      socket.off("file_deleted");
      socket.off("files_cleared");
    };
  }, [socket, isConnected, isFallbackMode, roomId, accessCode, onAuthFailure, fetchRoomState]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsQrOpen(false);
        setIsShortcutsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Text change handler
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    lastLocalTypingTime.current = Date.now();
    updateCursorPos();

    if (!isFallbackMode && socket && isConnected) {
      socket.emit("text_change", { roomId, content: newContent });
    } else {
      if (postTimeoutRef.current) clearTimeout(postTimeoutRef.current);
      postTimeoutRef.current = setTimeout(async () => {
        try {
          await fetch(`/api/room/${roomId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newContent, accessCode, clientId }),
          });
        } catch {
          // Ignore transient errors
        }
      }, 300);
    }
  };

  // Clear text handler
  const handleClear = () => {
    const newContent = "";
    setContent(newContent);
    lastLocalTypingTime.current = Date.now();
    setCursorPos({ line: 0, col: 0 });

    if (!isFallbackMode && socket && isConnected) {
      socket.emit("text_change", { roomId, content: newContent });
    } else {
      if (postTimeoutRef.current) clearTimeout(postTimeoutRef.current);
      postTimeoutRef.current = setTimeout(async () => {
        try {
          await fetch(`/api/room/${roomId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newContent, accessCode, clientId }),
          });
        } catch {}
      }, 300);
    }
  };

  // Copy text handler
  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  // Download .txt file
  const handleDownloadTxt = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `liveshare_${roomId}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Delete single file handler
  const handleDeleteSingleFile = async (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setFiles((prev) => prev.filter((f) => f.id !== fileId));

    if (!isFallbackMode && socket && isConnected) {
      socket.emit("delete_file", { roomId, fileId });
    } else {
      try {
        const query = accessCode ? `&accessCode=${encodeURIComponent(accessCode)}` : "";
        await fetch(`/api/room/${roomId}?fileId=${fileId}${query}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to delete file", err);
      }
    }
  };

  // Clear all files handler
  const handleClearAllFiles = async () => {
    if (files.length === 0) return;

    setFiles([]);

    if (!isFallbackMode && socket && isConnected) {
      socket.emit("clear_files", { roomId });
    } else {
      try {
        const query = accessCode ? `&accessCode=${encodeURIComponent(accessCode)}` : "";
        await fetch(`/api/room/${roomId}?fileId=all${query}`, { method: "DELETE" });
      } catch (err) {
        console.error("Failed to clear files", err);
      }
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
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.file) {
        if (isFallbackMode) {
          setFiles((prev) => {
            if (prev.some((f) => f.id === json.file.id)) return prev;
            return [...prev, json.file];
          });
        }
      } else if (json.error) {
        alert(json.error);
      }
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

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="pad-wrapper">
      <div className="pad-container">
        {/* Main Text Editor Panel */}
        <div className="pad-editor-section">
          {/* Top Status Bar */}
          <div className="editor-top-bar">
            <div className="room-badge">
              <Shield size={13} className="text-amber" />
              <span>Room: <strong>{roomId}</strong></span>
              {accessCode && <span className="access-tag">Private</span>}
            </div>

            <div className="top-bar-right">
              {/* Auto Expiry Indicator */}
              <div className="expiry-indicator" title="Rooms automatically reset after 12h of inactivity">
                <Clock size={13} />
                <span>Auto-clears after 12h</span>
              </div>

              {/* Presence Counter */}
              <div className="presence-badge" title="Active room participants">
                <Users size={13} />
                <span>{activeUsers} Online</span>
              </div>

              {/* Connection Indicator */}
              <div className="status-indicator">
                <div className={`status-dot ${isConnected ? "connected" : ""}`} />
                <span>{isConnected ? "Connected" : "Reconnecting..."}</span>
              </div>
            </div>
          </div>

          {/* Typing Presence Indicator */}
          {isTyping && (
            <div className="typing-presence-bar">
              <div className="typing-dot-wave">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <span>Someone is typing in this room...</span>
            </div>
          )}

          {/* Editor Textarea */}
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            placeholder="Start typing to share instantly with anyone in this room..."
            value={content}
            onChange={handleTextChange}
            onKeyUp={updateCursorPos}
            onClick={updateCursorPos}
            onSelect={updateCursorPos}
            spellCheck={false}
          />
          
          {/* Bottom Bar: Word Count & Metrics */}
          <div className="editor-metrics-bar">
            <div className="metrics-group">
              <span>{wordCount} words, {charCount} chars</span>
              <span className="metrics-divider"></span>
              <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
            </div>

            <button 
              className="btn-qr-link" 
              onClick={() => setIsQrOpen(true)}
              title="Show QR Code for quick mobile scan"
            >
              <QrCode size={13} />
              <span>QR Share</span>
            </button>
          </div>
        </div>

        {/* Files Sidebar Section */}
        <div 
          className="pad-sidebar-section"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="sidebar-header">
            <span>Shared Files</span>
            {files.length > 0 && (
              <button 
                className="btn-clear-sidebar"
                onClick={handleClearAllFiles}
                title="Clear all shared files"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="file-list">
            {files.length === 0 ? (
              <div className="empty-files-state">
                <div className="empty-icon-box">
                  <FileUp size={28} className="text-muted" />
                </div>
                <h4>No Files Shared Yet</h4>
                <p>Drag and drop any file here, or click below to upload.</p>
              </div>
            ) : (
              files.map((f) => (
                <div key={f.id} className="file-item-card animated-entrance">
                  <a 
                    href={`/api/download/${f.id}?name=${encodeURIComponent(f.originalFilename)}`} 
                    className="file-item-body" 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <div className="file-name">{f.originalFilename}</div>
                    <div className="file-meta">
                      <span>{formatFileSize(f.size)}</span>
                      <span className="download-label"><Download size={12} /> Download</span>
                    </div>
                  </a>
                  <button 
                    className="file-delete-btn"
                    onClick={(e) => handleDeleteSingleFile(e, f.id)}
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
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
              <FileUp size={16} style={{ marginBottom: "0.25rem" }} />
              <div>{uploading ? "Uploading..." : "Click or drop a file to share"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating macOS Dock Action Bar */}
      <DockBar
        onCopy={handleCopy}
        onClear={handleClear}
        onDownloadTxt={handleDownloadTxt}
        onOpenQr={() => setIsQrOpen(true)}
        copied={copied}
      />

      {/* QR Code Modal */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        url={currentUrl}
        roomId={roomId}
        accessCode={accessCode}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
