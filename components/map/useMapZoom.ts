'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { VIEWBOX_W, VIEWBOX_H } from './MapView';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 1.25;

interface ZoomState {
  scale: number;
  centerX: number;
  centerY: number;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function computeViewBox(state: ZoomState): string {
  const vbW = VIEWBOX_W / state.scale;
  const vbH = VIEWBOX_H / state.scale;
  const vbX = clamp(state.centerX - vbW / 2, 0, VIEWBOX_W - vbW);
  const vbY = clamp(state.centerY - vbH / 2, 0, VIEWBOX_H - vbH);
  return `${vbX} ${vbY} ${vbW} ${vbH}`;
}

export function useMapZoom() {
  const [state, setState] = useState<ZoomState>({
    scale: 1,
    centerX: VIEWBOX_W / 2,
    centerY: VIEWBOX_H / 2,
  });

  const isZoomed = state.scale > 1;

  const viewBox = useMemo(() => computeViewBox(state), [state]);

  const zoomIn = useCallback(() => {
    setState((prev) => {
      const nextScale = clamp(prev.scale * ZOOM_STEP, MIN_SCALE, MAX_SCALE);
      if (nextScale === prev.scale) return prev;
      return { ...prev, scale: nextScale };
    });
  }, []);

  const zoomOut = useCallback(() => {
    setState((prev) => {
      const nextScale = clamp(prev.scale / ZOOM_STEP, MIN_SCALE, MAX_SCALE);
      if (nextScale === prev.scale) return prev;
      return { ...prev, scale: nextScale };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      scale: 1,
      centerX: VIEWBOX_W / 2,
      centerY: VIEWBOX_H / 2,
    });
  }, []);

  const pan = useCallback((dx: number, dy: number) => {
    setState((prev) => {
      const vbW = VIEWBOX_W / prev.scale;
      const vbH = VIEWBOX_H / prev.scale;
      const nextCenterX = clamp(prev.centerX - dx / prev.scale, vbW / 2, VIEWBOX_W - vbW / 2);
      const nextCenterY = clamp(prev.centerY - dy / prev.scale, vbH / 2, VIEWBOX_H - vbH / 2);
      return { ...prev, centerX: nextCenterX, centerY: nextCenterY };
    });
  }, []);

  const zoomAt = useCallback((svgX: number, svgY: number, delta: number) => {
    setState((prev) => {
      const factor = delta > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
      const nextScale = clamp(prev.scale * factor, MIN_SCALE, MAX_SCALE);
      if (nextScale === prev.scale) return prev;

      // Zoom towards mouse pointer: new center = pointer + (oldCenter - pointer) * (oldScale / newScale)
      const ratio = prev.scale / nextScale;
      const nextCenterX = clamp(svgX + (prev.centerX - svgX) * ratio, VIEWBOX_W / (2 * nextScale), VIEWBOX_W - VIEWBOX_W / (2 * nextScale));
      const nextCenterY = clamp(svgY + (prev.centerY - svgY) * ratio, VIEWBOX_H / (2 * nextScale), VIEWBOX_H - VIEWBOX_H / (2 * nextScale));

      return { scale: nextScale, centerX: nextCenterX, centerY: nextCenterY };
    });
  }, []);

  // Drag state (ref to avoid re-renders during drag)
  const dragRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({
    dragging: false,
    lastX: 0,
    lastY: 0,
  });

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    dragRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
    target.style.cursor = 'grabbing';
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    pan(dx, dy);
  }, [pan]);

  const onPointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    dragRef.current.dragging = false;
    e.currentTarget.style.cursor = 'grab';
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * VIEWBOX_W;
      const svgY = ((e.clientY - rect.top) / rect.height) * VIEWBOX_H;
      zoomAt(svgX, svgY, e.deltaY);
    },
    [zoomAt]
  );

  return {
    viewBox,
    isZoomed,
    zoomIn,
    zoomOut,
    reset,
    pan,
    zoomAt,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
  };
}
