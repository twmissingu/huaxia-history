"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export interface InkTransitionProps {
  isActive: boolean;
  originX?: number;
  originY?: number;
  onComplete?: () => void;
}

/**
 * Chinese ink-wash painting style page transition.
 *
 * When active, an ink drop falls from the click position, then expands outward
 * in an organic, irregular shape (like real ink spreading on rice paper),
 * covering the entire viewport. The new page then fades in underneath.
 */
export function InkTransition({
  isActive,
  originX = 0,
  originY = 0,
  onComplete,
}: InkTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const mainCircleRef = useRef<SVGCircleElement>(null);
  const layer1Ref = useRef<SVGCircleElement>(null);
  const layer2Ref = useRef<SVGCircleElement>(null);
  const layer3Ref = useRef<SVGCircleElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const turbulence2Ref = useRef<SVGFETurbulenceElement>(null);
  const pageContentRef = useRef<HTMLDivElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const getCoverRadius = useCallback(() => {
    if (typeof window === "undefined") return 1000;
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Radius needed to cover the screen from any origin point
    return Math.sqrt(Math.max(originX, w - originX) ** 2 + Math.max(originY, h - originY) ** 2) * 1.1;
  }, [originX, originY]);

  useEffect(() => {
    if (!isActive) return;

    const mainCircle = mainCircleRef.current;
    const layer1 = layer1Ref.current;
    const layer2 = layer2Ref.current;
    const layer3 = layer3Ref.current;
    const turbulence = turbulenceRef.current;
    const turbulence2 = turbulence2Ref.current;
    const pageContent = pageContentRef.current;

    if (!mainCircle || !layer1 || !layer2 || !layer3 || !turbulence || !turbulence2 || !pageContent) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const coverRadius = getCoverRadius();

    // Set initial positions
    gsap.set([mainCircle, layer1, layer2, layer3], {
      attr: { cx: originX, cy: originY },
    });

    gsap.set(mainCircle, { attr: { r: 0 } });
    gsap.set(layer1, { attr: { r: 0 }, opacity: 0 });
    gsap.set(layer2, { attr: { r: 0 }, opacity: 0 });
    gsap.set(layer3, { attr: { r: 0 }, opacity: 0 });
    gsap.set(pageContent, { opacity: 0 });

    // Create the timeline
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    timelineRef.current = tl;

    // Phase 1 (0 - 0.3s): Ink drop scales from 0 to initial size at click position
    tl.to(
      mainCircle,
      {
        attr: { r: Math.min(window.innerWidth, window.innerHeight) * 0.08 },
        duration: 0.3,
        ease: "power2.out",
      },
      0
    );

    // Phase 2 (0.3 - 1.2s): Ink spreads outward with organic distortion to cover screen
    // Animate the turbulence for organic edge movement
    tl.to(
      turbulence,
      {
        attr: { baseFrequency: "0.015 0.015" },
        duration: 0.9,
        ease: "power1.inOut",
      },
      0.3
    );

    tl.to(
      turbulence2,
      {
        attr: { baseFrequency: "0.012 0.012" },
        duration: 0.9,
        ease: "power1.inOut",
      },
      0.3
    );

    // Main ink layer expands
    tl.to(
      mainCircle,
      {
        attr: { r: coverRadius },
        duration: 0.9,
        ease: "power3.inOut",
      },
      0.3
    );

    // Secondary layers with slight delays for depth
    tl.to(
      layer1,
      {
        attr: { r: coverRadius * 1.05 },
        opacity: 0.6,
        duration: 0.95,
        ease: "power3.inOut",
      },
      0.35
    );

    tl.to(
      layer2,
      {
        attr: { r: coverRadius * 1.1 },
        opacity: 0.35,
        duration: 1.0,
        ease: "power3.inOut",
      },
      0.4
    );

    tl.to(
      layer3,
      {
        attr: { r: coverRadius * 1.15 },
        opacity: 0.15,
        duration: 1.05,
        ease: "power3.inOut",
      },
      0.45
    );

    // Phase 3 (0.9 - 1.5s): New page content fades in underneath
    tl.to(
      pageContent,
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      0.9
    );

    // Phase 4 (1.5s): Ink overlay fades out revealing new page fully
    tl.to(
      [mainCircle, layer1, layer2, layer3],
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      },
      1.5
    );

    return () => {
      tl.kill();
    };
  }, [isActive, originX, originY, onComplete, getCoverRadius]);

  // Reset on deactivation
  useEffect(() => {
    if (!isActive) {
      const mainCircle = mainCircleRef.current;
      const layer1 = layer1Ref.current;
      const layer2 = layer2Ref.current;
      const layer3 = layer3Ref.current;
      const pageContent = pageContentRef.current;

      if (mainCircle) gsap.set(mainCircle, { attr: { r: 0 }, opacity: 1 });
      if (layer1) gsap.set(layer1, { attr: { r: 0 }, opacity: 0 });
      if (layer2) gsap.set(layer2, { attr: { r: 0 }, opacity: 0 });
      if (layer3) gsap.set(layer3, { attr: { r: 0 }, opacity: 0 });
      if (pageContent) gsap.set(pageContent, { opacity: 0 });

      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-[100] pointer-events-none",
        isActive ? "opacity-100" : "opacity-0"
      )}
      aria-hidden="true"
    >
      {/* Paper grain texture overlay — visible through the ink */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23paperGrain)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: "100vw", height: "100vh" }}
      >
        <defs>
          {/* Main ink displacement filter — creates organic, blob-like edges */}
          <filter id="inkDistortion" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.08 0.08"
              numOctaves="5"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="60"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="2" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="over" />
          </filter>

          {/* Secondary displacement for extra layer variation */}
          <filter id="inkDistortion2" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              ref={turbulence2Ref}
              type="fractalNoise"
              baseFrequency="0.06 0.06"
              numOctaves="4"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="80"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="3" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="over" />
          </filter>

          {/* Radial gradient for ink diffusion depth */}
          <radialGradient id="inkGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0f0a" stopOpacity="1" />
            <stop offset="70%" stopColor="#1a0f0a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1a0f0a" stopOpacity="0.85" />
          </radialGradient>

          <radialGradient id="inkGradientLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a0f0a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1a0f0a" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* Layer 3: Outermost, most transparent and distorted */}
        <circle
          ref={layer3Ref}
          cx={originX}
          cy={originY}
          r="0"
          fill="url(#inkGradientLight)"
          filter="url(#inkDistortion2)"
          opacity="0"
        />

        {/* Layer 2: Mid diffusion */}
        <circle
          ref={layer2Ref}
          cx={originX}
          cy={originY}
          r="0"
          fill="url(#inkGradient)"
          filter="url(#inkDistortion)"
          opacity="0"
        />

        {/* Layer 1: Slightly larger, slightly transparent */}
        <circle
          ref={layer1Ref}
          cx={originX}
          cy={originY}
          r="0"
          fill="#1a0f0a"
          filter="url(#inkDistortion2)"
          opacity="0"
        />

        {/* Main ink layer: Deepest and most opaque */}
        <circle
          ref={mainCircleRef}
          cx={originX}
          cy={originY}
          r="0"
          fill="#1a0f0a"
          filter="url(#inkDistortion)"
        />
      </svg>

      {/* New page content container — fades in during Phase 3 */}
      <div
        ref={pageContentRef}
        className="absolute inset-0 bg-paper"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
