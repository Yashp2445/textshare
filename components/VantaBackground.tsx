"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";
// @ts-ignore
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
        highlightColor: isDark ? 0xa855f7 : 0x8b5cf6,
        midtoneColor: isDark ? 0x2e1065 : 0xf3e8ff,
        lowlightColor: isDark ? 0x060709 : 0xf7f6f4,
        baseColor: isDark ? 0x08080a : 0xf7f6f4,
        blurFactor: 0.75,
        speed: 0.9,
        zoom: 0.8,
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
