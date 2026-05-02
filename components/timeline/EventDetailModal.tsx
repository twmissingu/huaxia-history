'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Landmark, ScrollText, Users } from 'lucide-react';
import Link from 'next/link';
import { cn, formatYear, getDynastyName } from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';
import { categoryLabels, categoryColors } from '@/types/index';
import type { HistoricalEvent } from '@/types/index';
import figuresData from '@/data/figures.json';
import type { HistoricalFigure } from '@/types/index';

interface EventDetailModalProps {
  event: HistoricalEvent | null;
  isOpen: boolean;
  onClose: () => void;
  originRect?: DOMRect | null;
  dynastyColor: string;
}

const figures = figuresData as HistoricalFigure[];

function lookupFigure(figureId: string): HistoricalFigure | undefined {
  const exact = figures.find((f) => f.id === figureId);
  if (exact) return exact;

  const stripped = figureId.replace(/^figure-/, '');
  const byStripped = figures.find((f) => f.id === stripped);
  if (byStripped) return byStripped;

  const normalized = stripped.replace(/-/g, '');
  return figures.find((f) => f.id === normalized);
}

function getFigureName(figureId: string): string {
  return lookupFigure(figureId)?.name || figureId.replace(/^figure-/, '');
}

function getFigureHref(figureId: string): string {
  const figure = lookupFigure(figureId);
  return figure ? `/figure/${figure.id}` : `/figure/${figureId.replace(/^figure-/, '')}`;
}

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  originRect,
  dynastyColor,
}: EventDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const initial = useMemo(() => {
    if (!originRect) return { opacity: 0, scale: 0.85 };
    const cardCenterX = originRect.left + originRect.width / 2;
    const cardCenterY = originRect.top + originRect.height / 2;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    return {
      opacity: 0,
      scale: 0.6,
      x: cardCenterX - vw / 2,
      y: cardCenterY - vh / 2,
    };
  }, [originRect]);

  const hasImage = event?.image && event.image.trim() !== '';

  return (
    <AnimatePresence>
      {isOpen && event && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-ink-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={initial}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={cn(
                'relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl',
                'bg-paper shadow-2xl border border-ink-lighter/20',
                'pointer-events-auto'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Event hero image */}
              {hasImage && (
                <div className="relative h-48 w-full overflow-hidden">
                  <SafeImage
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/30 to-transparent" />
                </div>
              )}

              {/* Accent bar */}
              <div className="h-1.5 w-full" style={{ backgroundColor: dynastyColor }} />

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-ink-light transition-colors hover:bg-paper-dark hover:text-ink-black"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 md:p-8">
                {/* Badges */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: dynastyColor }}
                  >
                    <Landmark className="h-3 w-3" />
                    {getDynastyName(event.dynasty)}
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColors[event.category] ?? '#6b5b4f' }}
                  >
                    {categoryLabels[event.category] ?? event.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold leading-snug text-ink-black md:text-3xl">
                  {event.title}
                </h2>

                {/* Meta */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span className="font-mono font-semibold" style={{ color: dynastyColor }}>
                      {formatYear(event.year)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                    {event.coordinates && (
                      <span className="text-xs text-ink-light">
                        ({event.coordinates[1].toFixed(2)}°N, {event.coordinates[0].toFixed(2)}°E)
                      </span>
                    )}
                  </span>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <p className="text-base leading-relaxed text-ink-dark md:text-lg">
                    {event.description}
                  </p>
                </div>

                {/* Significance */}
                <div
                  className="mt-6 rounded-xl border-l-4 bg-paper-dark/30 p-4 md:p-5"
                  style={{ borderColor: dynastyColor }}
                >
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-black">
                    <ScrollText className="h-4 w-4" style={{ color: dynastyColor }} />
                    历史意义
                  </div>
                  <p className="text-sm leading-relaxed text-ink-dark md:text-base">
                    {event.significance}
                  </p>
                </div>

                {/* Related Figures */}
                {event.relatedFigures.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-black">
                      <Users className="h-4 w-4 text-ink-medium" />
                      相关人物
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.relatedFigures.map((figureId) => (
                        <Link
                          key={figureId}
                          href={getFigureHref(figureId)}
                          className={cn(
                            'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all',
                            'border-ink-lighter/30 bg-paper-dark/50 text-ink-dark hover:bg-paper-dark hover:text-ink-black hover:shadow-sm'
                          )}
                        >
                          {getFigureName(figureId)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
