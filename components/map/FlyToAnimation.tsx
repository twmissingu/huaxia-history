'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { project, VIEWBOX_W, VIEWBOX_H } from './MapView';

export interface FlyToTarget {
  center: [number, number];
  zoom?: number;
}

export function useFlyToViewBox(
  target: FlyToTarget | null,
  duration = 1.5
): string {
  const [displayVb, setDisplayVb] = useState({
    x: 0,
    y: 0,
    w: VIEWBOX_W,
    h: VIEWBOX_H,
  });
  const currentVbRef = useRef(displayVb);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let targetW = VIEWBOX_W;
    let targetH = VIEWBOX_H;

    if (target) {
      const [px, py] = project(target.center[0], target.center[1]);
      const zoom = target.zoom ?? 2.5;
      targetW = VIEWBOX_W / zoom;
      targetH = VIEWBOX_H / zoom;
      targetX = Math.max(0, Math.min(px - targetW / 2, VIEWBOX_W - targetW));
      targetY = Math.max(0, Math.min(py - targetH / 2, VIEWBOX_H - targetH));
    }

    controlsRef.current?.stop();
    controlsRef.current = animate(
      currentVbRef.current,
      { x: targetX, y: targetY, w: targetW, h: targetH },
      {
        duration,
        ease: 'easeInOut',
        onUpdate: (latest) => {
          const v = latest as { x: number; y: number; w: number; h: number };
          currentVbRef.current = v;
          setDisplayVb({ ...v });
        },
      }
    );

    return () => controlsRef.current?.stop();
  }, [target, duration]);

  return `${displayVb.x} ${displayVb.y} ${displayVb.w} ${displayVb.h}`;
}

interface FlightTrailProps {
  from: [number, number] | null;
  to: [number, number] | null;
  active: boolean;
}

export function FlightTrail({ from, to, active }: FlightTrailProps) {
  if (!from || !to || !active) return null;

  const [x1, y1] = project(from[0], from[1]);
  const [x2, y2] = project(to[0], to[1]);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 100;

  const pathD = `M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`;

  return (
    <g pointerEvents="none">
      <motion.path
        d={pathD}
        fill="none"
        stroke="#c9372c"
        strokeWidth={2}
        strokeDasharray="6,5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} r={2.5} fill="#c9372c" opacity={0}>
          <animateMotion
            dur="1.5s"
            begin={`${i * 0.18}s`}
            path={pathD}
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="1.5s"
            begin={`${i * 0.18}s`}
            fill="freeze"
          />
        </circle>
      ))}
    </g>
  );
}
