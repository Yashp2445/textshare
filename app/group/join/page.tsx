"use client";

import { useState, useEffect } from "react";
import LivePad from "@/components/LivePad";

export default function JoinGroupPage() {
  const [accessCode, setAccessCode] = useState("");
  const [joinedCode, setJoinedCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("code");
    if (codeParam) {
      setAccessCode(codeParam);
    }
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) return;
    setError("");
    // We attempt to mount the pad with this code. 
    // If the server rejects the socket connection (invalid code), the LivePad triggers onAuthFailure.
    setJoinedCode(accessCode.trim());
  };

  const handleAuthFailure = () => {
    setJoinedCode("");
    setError("Invalid access code or group expired.");
  };

  if (joinedCode) {
    return <LivePad roomId={joinedCode} accessCode={joinedCode} onAuthFailure={handleAuthFailure} />;
  }

  return (
    <div className="center-wrapper">
      <form className="form-card" onSubmit={handleJoin}>
        <h1>Join Group</h1>
        <p>Enter the access code to join the private live session.</p>
        
        <div className="input-group">
          <label>Access Code</label>
          <input 
            type="text" 
            placeholder="e.g. AbC123Xy"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            autoFocus
          />
        </div>

        {error && <div style={{ color: "var(--error)", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}

        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={!accessCode.trim()}>
          Join Session
        </button>
      </form>
    </div>
  );
}
