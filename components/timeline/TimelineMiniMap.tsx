'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getDynastyName } from '@/lib/utils';
import type { Dynasty } from '@/types/index';

interface TimelineMiniMapProps {
  dynasties: Dynasty[];
}

export function TimelineMiniMap({ dynasties }: TimelineMiniMapProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const totalSpan = useMemo(() => {
    if (dynasties.length === 0) return 1;
    const starts = dynasties.map((d) => d.startYear);
    const ends = dynasties.map((d) => d.endYear);
    return Math.max(...ends) - Math.min(...starts);
  }, [dynasties]);

  const minYear = useMemo(() => {
    if (dynasties.length === 0) return 0;
    return Math.min(...dynasties.map((d) => d.startYear));
  }, [dynasties]);

  const segments = useMemo(() => {
    if (dynasties.length === 0 || totalSpan <= 0) return [];
    return dynasties.map((d) => {
      const top = ((d.startYear - minYear) / totalSpan) * 100;
      const height = ((d.endYear - d.startYear) / totalSpan) * 100;
      return { dynasty: d, top: Math.max(0, top), height: Math.max(height, 1.2) };
    });
  }, [dynasties, totalSpan, minYear]);

  const updateScroll = useCallback(() => {
    const timelineEl = document.querySelector('[data-timeline-container]') as HTMLElement | null;
    if (!timelineEl) {
      setIsVisible(false);
      return;
    }

    const rect = timelineEl.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const isInView = rect.top < viewportH && rect.bottom > 0;
    setIsVisible(isInView);

    if (!isInView) return;

    const timelineTop = rect.top + window.scrollY;
    const timelineHeight = rect.height;
    const scrollCenter = window.scrollY + viewportH * 0.5;
    const progress = (scrollCenter - timelineTop) / timelineHeight;
    setScrollProgress(Math.max(0, Math.min(1, progress)));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, [updateScroll]);

  const handleSegmentClick = (dynastyId: string) => {
    const el = document.querySelector(`[data-dynasty-header="${dynastyId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block',
            'h-[60vh] w-3 rounded-full bg-paper-dark/60 border border-ink-lighter/20 shadow-sm overflow-hidden'
          )}
        >
          {segments.map(({ dynasty, top, height }) => (
            <button
              type="button"
              key={dynasty.id}
              onClick={() => handleSegmentClick(dynasty.id)}
              className="absolute left-0 right-0 cursor-pointer transition-opacity hover:opacity-80"
              style={{
                top: `${top}%`,
                height: `${height}%`,
                backgroundColor: dynasty.color,
              }}
              title={`${getDynastyName(dynasty.id)} (${dynasty.period})`}
            />
          ))}

          <div
            className="absolute left-[-2px] right-[-2px] h-1 rounded-full bg-ink-black/70 border border-white/40 shadow-sm pointer-events-none"
            style={{ top: `${scrollProgress * 100}%`, transform: 'translateY(-50%)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
