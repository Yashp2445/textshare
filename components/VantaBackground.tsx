"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";
// @ts-ignore - vanta has no TypeScript definitions by default
import FOG from "vanta/dist/vanta.fog.min";

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!vantaRef.current) return;

    const isDark = resolvedTheme !== "light";

    if (vantaEffect.current) {
      vantaEffect.current.destroy();
    }

    try {
      vantaEffect.current = FOG({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: isDark ? 0xf59e0b : 0xd97706,
        midtoneColor: isDark ? 0x162030 : 0xe5e2d8,
        lowlightColor: isDark ? 0x080c14 : 0xedeae0,
        baseColor: isDark ? 0x0b0f17 : 0xf8f7f4,
        blurFactor: 0.6,
        speed: 1.0,
        zoom: 0.85,
      });
    } catch (err) {
      console.error("Vanta initialization error:", err);
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [resolvedTheme]);

  return <div ref={vantaRef} className="vanta-bg-container" aria-hidden="true" />;
}
