"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Calculator } from "lucide-react";

export function HeaderNav() {
  const pathname = usePathname();
  const isCalc = pathname.startsWith("/calculator");

  return (
    <nav className="header-segmented-nav" aria-label="Main Navigation">
      <Link
        href="/"
        className={`nav-segment-item ${!isCalc ? "active" : ""}`}
      >
        <FileText size={14} />
        <span>LivePad</span>
      </Link>

      <Link
        href="/calculator"
        className={`nav-segment-item ${isCalc ? "active" : ""}`}
      >
        <Calculator size={14} />
        <span>Scientific Calc</span>
      </Link>
    </nav>
  );
}
