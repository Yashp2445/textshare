"use client";

import { useState, useEffect, use } from "react";

interface ShareViewData {
  slug: string;
  type: "text" | "file" | "both";
  isRestricted: boolean;
  textContent?: string | null;
  originalFilename?: string | null;
  fileSize?: number | null;
  createdAt: string;
}

export default function ViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [data, setData] = useState<ShareViewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have a token for this slug in sessionStorage
    const savedToken = sessionStorage.getItem(`token_${slug}`);
    if (savedToken) {
      setToken(savedToken);
    }
    fetchData(savedToken);
  }, [slug]);

  const fetchData = async (currentToken: string | null = null) => {
    try {
      const headers: HeadersInit = {};
      if (currentToken) {
        headers["Authorization"] = `Bearer ${currentToken}`;
      }

      const res = await fetch(`/api/shares/${slug}`, { headers });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to load share.");
        setIsLoading(false);
        return;
      }

      setData(json);
      setError("");
    } catch {
      setError("Network error while loading share.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;

    setIsUnlocking(true);
    setUnlockError("");

    try {
      const res = await fetch(`/api/shares/${slug}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      });
      const json = await res.json();

      if (!res.ok) {
        setUnlockError(json.error || "Invalid access code.");
        return;
      }

      // Save token and refetch data
      sessionStorage.setItem(`token_${slug}`, json.token);
      setToken(json.token);
      await fetchData(json.token);
    } catch {
      setUnlockError("Network error. Please try again.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleDownload = () => {
    if (!data?.originalFilename) return;
    let url = `/api/shares/${slug}/file`;
    
    // Create a temporary link element
    const link = document.createElement("a");
    
    if (data.isRestricted && token) {
        // Fetch it manually to send the auth header
        fetch(url, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => res.blob())
            .then(blob => {
                const objectUrl = window.URL.createObjectURL(blob);
                link.href = objectUrl;
                link.download = data.originalFilename!;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(objectUrl);
            })
            .catch(() => alert("Failed to download file."));
    } else {
        link.href = url;
        link.download = data.originalFilename!;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="loading">
        <span className="spinner spinner-lg"></span>
        <p>Loading share...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="error-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2>Oops!</h2>
        <p>{error || "Share not found"}</p>
        <a href="/" className="btn btn-primary">Create New Share</a>
      </div>
    );
  }

  // ── Access Gate for Restricted Content ──
  if (data.isRestricted && data.textContent === null && data.originalFilename === null) {
    return (
      <div className="card access-gate">
        <div className="gate-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2>Restricted Share</h2>
        <p className="gate-description">This content is protected by an access code.</p>
        
        <form className="gate-form" onSubmit={handleUnlock}>
          <div className="form-group">
            <label>Access Code</label>
            <input
              type="password"
              placeholder="Enter the code..."
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              autoFocus
            />
          </div>
          
          {unlockError && (
            <div className="gate-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {unlockError}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isUnlocking || !accessCode.trim()}
          >
            {isUnlocking ? <span className="spinner" /> : "Unlock Content"}
          </button>
        </form>
      </div>
    );
  }

  // ── Content Viewer ──
  return (
    <div className="card">
      <div className="viewer-header">
        <div className="viewer-meta">
          <span className="viewer-slug">{slug}</span>
          {data.isRestricted && (
            <span className="badge-restricted">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Restricted
            </span>
          )}
        </div>
      </div>

      {data.textContent && (
        <div className="viewer-content-wrapper">
          <div className="line-numbers" aria-hidden="true">
            {data.textContent.split("\n").map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <pre className="viewer-content">
            <code>{data.textContent}</code>
          </pre>
        </div>
      )}

      {data.originalFilename && (
        <div className="file-download">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 18 15 15" />
          </svg>
          <div className="file-info">
            <div className="file-info-name">{data.originalFilename}</div>
            <div className="file-info-size">{data.fileSize ? formatFileSize(data.fileSize) : "Unknown size"}</div>
          </div>
          <button className="btn btn-secondary" onClick={handleDownload}>
            Download File
          </button>
        </div>
      )}

      <div className="viewer-footer">
        <div>Shared on {new Date(data.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
}
