"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Plus, KeyRound } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function HeaderNav() {
  const pathname = usePathname();

  const isPublic = pathname === "/";
  const isCreate = pathname === "/group/create";
  const isJoin = pathname === "/group/join";

  return (
    <div className="header-inner">
      <Link href="/" className="logo">
        <div className="logo-icon-box glow-violet">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <span className="logo-text">LiveShare</span>
      </Link>

      <nav className="header-segmented-nav" aria-label="Main Navigation">
        <Link
          href="/"
          className={`nav-segment-item ${isPublic ? "active" : ""}`}
        >
          <Globe size={14} />
          <span>Public Room</span>
        </Link>
        <Link
          href="/group/create"
          className={`nav-segment-item ${isCreate ? "active" : ""}`}
        >
          <Plus size={14} />
          <span>New Private Room</span>
        </Link>
        <Link
          href="/group/join"
          className={`nav-segment-item ${isJoin ? "active" : ""}`}
        >
          <KeyRound size={14} />
          <span>Join with Code</span>
        </Link>
      </nav>

      <div className="nav-actions">
        <ThemeToggle />
      </div>
    </div>
  );
}
