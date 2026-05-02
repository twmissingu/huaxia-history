'use client';

import { useRef, useEffect, type ReactNode } from 'react';

interface FocusEffectProps {
  children: ReactNode;
  className?: string;
}

const registry = new Set<HTMLElement>();
let listening = false;

function updateAll() {
  const viewportCenter = window.innerHeight / 2;
  const maxDistance = window.innerHeight * 0.55;

  registry.forEach((el) => {
    // Guard against detached elements (StrictMode, Suspense, etc.)
    if (!el.isConnected) return;
    const rect = el.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const distance = Math.abs(elementCenter - viewportCenter);
    const ratio = Math.min(distance / maxDistance, 1);

    const opacity = 1 - ratio * 0.55;
    const blur = ratio * 2.5;

    el.style.opacity = String(Math.round(opacity * 100) / 100);
    el.style.filter = `blur(${Math.round(blur * 10) / 10}px)`;
  });
}

function ensureListener() {
  if (listening) return;
  listening = true;
  window.addEventListener('scroll', updateAll, { passive: true });
  window.addEventListener('resize', updateAll, { passive: true });
  requestAnimationFrame(updateAll);
}

function removeListener() {
  if (!listening || registry.size > 0) return;
  listening = false;
  window.removeEventListener('scroll', updateAll);
  window.removeEventListener('resize', updateAll);
}

export function FocusEffect({ children, className }: FocusEffectProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registry.add(el);
    ensureListener();
    updateAll();

    return () => {
      registry.delete(el);
      removeListener();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: 'opacity 0.35s ease-out, filter 0.35s ease-out' }}
    >
      {children}
    </div>
  );
}
