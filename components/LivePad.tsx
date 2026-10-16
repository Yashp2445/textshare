"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "./SocketProvider";
import { QrModal } from "./QrModal";
import { ShortcutsModal } from "./ShortcutsModal";
import { LanguageSelector } from "./LanguageSelector";
import { 
  Users, 
  Clock, 
  FileUp, 
  Download, 
  Shield, 
  QrCode, 
  Copy, 
  Check, 
  Trash2, 
  Folder, 
  Keyboard,
  PanelRightClose,
  PanelRightOpen,
  AlertCircle
} from "lucide-react";

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
  const [language, setLanguage] = useState("text");
  const [isTyping, setIsTyping] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 0, col: 0 });

  // Modal and drawer states
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFilesCollapsed, setIsFilesCollapsed] = useState(false);

  // Destructive confirmations
  const [confirmClearText, setConfirmClearText] = useState(false);
  const [confirmClearFiles, setConfirmClearFiles] = useState(false);

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
  const handleClear = useCallback(() => {
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
  }, [isFallbackMode, socket, isConnected, roomId, accessCode, clientId]);

  // Copy text handler
  const handleCopy = useCallback(async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  }, [content]);

  // Download .txt file
  const handleDownloadTxt = () => {
    if (!content) return;
    const ext = language === "javascript" ? "js" : language === "typescript" ? "ts" : language === "python" ? "py" : language === "json" ? "json" : language === "html" ? "html" : language === "css" ? "css" : "txt";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `liveshare_${roomId}_${Date.now()}.${ext}`;
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

  // Stable references for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (isMod && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopy();
      } else if (isMod && e.shiftKey && e.key.toLowerCase() === "x") {
        e.preventDefault();
        handleClear();
      } else if (e.key === "Escape") {
        setIsShortcutsOpen(false);
        setIsQrOpen(false);
        setConfirmClearText(false);
        setConfirmClearFiles(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy, handleClear]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="pad-wrapper">
      <div className="pad-container">
        {/* Main Text Editor Section */}
        <div className="pad-editor-section">
          {/* Editor Header Bar with Room Info & Actions Toolbar */}
          <div className="editor-top-bar">
            <div className="editor-top-left">
              <div className="room-badge">
                <Shield size={14} className="badge-shield-icon" />
                <span className="room-label">Room:</span>
                <span className="room-id">{roomId}</span>
                {accessCode && <span className="access-tag">Private</span>}
              </div>

              <div className="status-indicator" title={isFallbackMode ? "Operating via polling fallback" : isConnected ? "Real-time socket active" : "Reconnecting"}>
                <div className={`status-dot ${isConnected ? "connected" : isFallbackMode ? "fallback" : "connecting"}`} />
                <span>
                  {isFallbackMode ? "Polling mode" : isConnected ? "Connected" : "Reconnecting..."}
                </span>
              </div>

              <div className="presence-badge" title="Active participants">
                <Users size={13} />
                <span>{activeUsers} online</span>
              </div>
            </div>

            {/* Integrated Slim Action Toolbar */}
            <div className="editor-toolbar" role="toolbar" aria-label="Editor Actions">
              {/* Copy Action */}
              <button
                type="button"
                className={`toolbar-btn ${copied ? "toolbar-btn-active" : ""}`}
                onClick={handleCopy}
                title="Copy all text (Ctrl/Cmd+Shift+C)"
                aria-label="Copy text content"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              {/* Download Action */}
              <button
                type="button"
                className="toolbar-btn"
                onClick={handleDownloadTxt}
                title="Download text file"
                aria-label="Download as text file"
                disabled={!content}
              >
                <Download size={14} />
                <span>Download</span>
              </button>

              {/* Clear Text Action with Safety Confirmation */}
              {confirmClearText ? (
                <div className="confirm-pop-box">
                  <span className="confirm-pop-text">Clear text?</span>
                  <button
                    type="button"
                    className="toolbar-btn btn-danger-confirm"
                    onClick={() => {
                      handleClear();
                      setConfirmClearText(false);
                    }}
                  >
                    Yes, clear
                  </button>
                  <button
                    type="button"
                    className="toolbar-btn btn-subtle"
                    onClick={() => setConfirmClearText(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={() => setConfirmClearText(true)}
                  title="Clear text content (Ctrl/Cmd+Shift+X)"
                  aria-label="Clear text"
                  disabled={!content}
                >
                  <Trash2 size={14} />
                  <span>Clear</span>
                </button>
              )}

              <div className="toolbar-separator" />

              {/* QR Code Trigger */}
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => setIsQrOpen(true)}
                title="Show QR code to join from mobile"
                aria-label="Show QR code"
              >
                <QrCode size={14} />
                <span>QR Share</span>
              </button>

              {/* Keyboard Shortcuts Trigger */}
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => setIsShortcutsOpen(true)}
                title="Keyboard shortcuts (Ctrl/Cmd+K)"
                aria-label="Keyboard shortcuts"
              >
                <Keyboard size={14} />
                <span className="kbd-hint">⌘K</span>
              </button>

              <div className="toolbar-separator" />

              {/* Toggle Files Panel */}
              <button
                type="button"
                className={`toolbar-btn ${!isFilesCollapsed ? "toolbar-btn-active" : ""}`}
                onClick={() => setIsFilesCollapsed((prev) => !prev)}
                title={isFilesCollapsed ? "Show shared files panel" : "Hide shared files panel"}
                aria-label="Toggle files panel"
              >
                <Folder size={14} />
                <span>Files {files.length > 0 && `(${files.length})`}</span>
                {isFilesCollapsed ? <PanelRightOpen size={13} /> : <PanelRightClose size={13} />}
              </button>
            </div>
          </div>

          {/* Typing Presence Wave */}
          {isTyping && (
            <div className="typing-presence-bar" role="status">
              <div className="typing-dot-wave">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <span>Someone is editing...</span>
            </div>
          )}

          {/* Editor Area */}
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            placeholder="Type or paste text here to share in real time..."
            value={content}
            onChange={handleTextChange}
            onKeyUp={updateCursorPos}
            onClick={updateCursorPos}
            onSelect={updateCursorPos}
            spellCheck={false}
            aria-label="Collaborative text editor"
          />
          
          {/* Bottom Bar: Language Selector & Metrics */}
          <div className="editor-metrics-bar">
            <div className="metrics-group">
              <LanguageSelector language={language} onChange={setLanguage} />
              <span className="metrics-divider" />
              <span className="metrics-numbers">{wordCount} words, {charCount} chars</span>
              <span className="metrics-divider" />
              <span className="metrics-cursor">Ln {cursorPos.line}, Col {cursorPos.col}</span>
            </div>

            <div className="expiry-indicator" title="Room memory clears after 12 hours of inactivity">
              <Clock size={12} />
              <span>Resets after 12h idle</span>
            </div>
          </div>
        </div>

        {/* Collapsible Files Sidebar Section */}
        {!isFilesCollapsed && (
          <aside 
            className="pad-sidebar-section"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            aria-label="Shared files"
          >
            <div className="sidebar-header">
              <div className="sidebar-title-group">
                <Folder size={15} />
                <span>Files</span>
                {files.length > 0 && <span className="sidebar-count-badge">{files.length}</span>}
              </div>

              {files.length > 0 && (
                confirmClearFiles ? (
                  <div className="confirm-files-group">
                    <button 
                      type="button"
                      className="btn-clear-confirm"
                      onClick={() => {
                        handleClearAllFiles();
                        setConfirmClearFiles(false);
                      }}
                    >
                      Clear
                    </button>
                    <button 
                      type="button"
                      className="btn-clear-cancel"
                      onClick={() => setConfirmClearFiles(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    className="btn-clear-sidebar"
                    onClick={() => setConfirmClearFiles(true)}
                    title="Clear all shared files"
                  >
                    Clear All
                  </button>
                )
              )}
            </div>
            
            <div className="file-list">
              {files.length === 0 ? (
                <div className="empty-files-state">
                  <div className="empty-icon-box">
                    <FileUp size={24} />
                  </div>
                  <h4>No files yet</h4>
                  <p>Drop files here or choose a file below (up to 50MB).</p>
                </div>
              ) : (
                files.map((f) => (
                  <div key={f.id} className="file-item-card">
                    <a 
                      href={`/api/download/${f.id}?name=${encodeURIComponent(f.originalFilename)}`} 
                      className="file-item-body" 
                      target="_blank" 
                      rel="noreferrer"
                      title={`Download ${f.originalFilename}`}
                    >
                      <div className="file-name">{f.originalFilename}</div>
                      <div className="file-meta">
                        <span>{formatFileSize(f.size)}</span>
                        <span className="download-label">
                          <Download size={11} /> Download
                        </span>
                      </div>
                    </a>
                    <button 
                      type="button"
                      className="file-delete-btn"
                      onClick={(e) => handleDeleteSingleFile(e, f.id)}
                      title="Remove file"
                      aria-label={`Delete ${f.originalFilename}`}
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
              <button
                type="button" 
                className={`upload-dropzone ${uploading ? "uploading" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <FileUp size={16} />
                <span>{uploading ? "Uploading file..." : "Choose or drop a file"}</span>
              </button>
            </div>
          </aside>
        )}
      </div>

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
