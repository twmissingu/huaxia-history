'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getDynastyName, formatYear } from '@/lib/utils';
import dynastiesData from '@/data/dynasties.json';
import figuresData from '@/data/figures.json';
import eventsData from '@/data/events.json';
import type { Dynasty, HistoricalFigure, HistoricalEvent } from '@/types/index';

const dynasties = dynastiesData as Dynasty[];
const figures = figuresData as HistoricalFigure[];
const events = eventsData as HistoricalEvent[];

let mapDynastyState: string | null = null;
let mapYearState: number | null = null;
const subscribers = new Set<() => void>();

export function setMapContextLabel(dynasty: string | null, year: number | null) {
  mapDynastyState = dynasty;
  mapYearState = year;
  subscribers.forEach((cb) => cb());
}

interface ContextLabelProps {
  isScrolled: boolean;
}

export function ContextLabel({ isScrolled }: ContextLabelProps) {
  const pathname = usePathname();
  const [label, setLabel] = useState('华夏志');
  const [subLabel, setSubLabel] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  // Subscribe to map context updates
  useEffect(() => {
    const cb = () => forceUpdate((n) => n + 1);
    subscribers.add(cb);
    return () => {
      subscribers.delete(cb);
    };
  }, []);

  useEffect(() => {
    setLabel('华夏志');
    setSubLabel(null);

    if (pathname === '/' || pathname === '/search/' || pathname === '/search') {
      setLabel('华夏志');
      setSubLabel(null);
      return;
    }

    if (pathname.startsWith('/event/')) {
      const id = pathname.split('/')[2];
      const event = events.find((e) => e.id === id);
      if (event) {
        setLabel(event.title);
        setSubLabel(getDynastyName(event.dynasty));
      }
      return;
    }

    if (pathname === '/timeline/' || pathname === '/timeline') {
      const update = () => {
        const headers = document.querySelectorAll('[data-dynasty-header]');
        if (headers.length === 0) return;

        const viewportCenter = window.innerHeight / 2;
        let best: Element | null = null;
        let bestDist = Infinity;

        for (const h of headers) {
          const rect = h.getBoundingClientRect();
          const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          if (dist < bestDist) {
            bestDist = dist;
            best = h;
          }
        }

        if (best) {
          setLabel(best.getAttribute('data-dynasty-name') || '');
          setSubLabel(best.getAttribute('data-dynasty-period') || '');
        }
      };

      window.addEventListener('scroll', update, { passive: true });
      const timeout = setTimeout(update, 300);
      return () => {
        window.removeEventListener('scroll', update);
        clearTimeout(timeout);
      };
    }

    if (pathname.startsWith('/dynasty/')) {
      const id = pathname.split('/')[2];
      const dynasty = dynasties.find((d) => d.id === id);
      if (dynasty) {
        setLabel(dynasty.name);
        setSubLabel(dynasty.period);
      }
      return;
    }

    if (pathname.startsWith('/figure/')) {
      const id = pathname.split('/')[2];
      const figure = figures.find((f) => f.id === id);
      if (figure) {
        setLabel(figure.name);
        setSubLabel(getDynastyName(figure.dynasty));
      }
      return;
    }

    if (pathname === '/map/' || pathname === '/map') {
      if (mapDynastyState) {
        const dynasty = dynasties.find((d) => d.id === mapDynastyState);
        if (dynasty) {
          setLabel(dynasty.name);
          setSubLabel(mapYearState != null ? formatYear(mapYearState) : dynasty.period);
        }
      } else if (mapYearState != null) {
        const dynasty = dynasties.find(
          (d) => mapYearState! >= d.startYear && mapYearState! <= d.endYear
        );
        if (dynasty) {
          setLabel(dynasty.name);
          setSubLabel(formatYear(mapYearState));
        } else {
          setLabel(formatYear(mapYearState));
        }
      }
      return;
    }
  }, [pathname]);

  const isHome = pathname === '/';
  const textColor = isHome && !isScrolled ? 'text-white/70' : 'text-ink-medium';

  const displayText = subLabel ? `${label} · ${subLabel}` : label;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={displayText}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -3 }}
        transition={{ duration: 0.22 }}
        className={cn('hidden md:inline-block text-sm font-medium tracking-wide', textColor)}
      >
        {displayText}
      </motion.span>
    </AnimatePresence>
  );
}
