'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useInkTransitionContext } from '@/components/ink-transition/InkTransitionContext';

import { cn, formatYear } from '@/lib/utils';

import type { HistoricalFigure } from '@/types/index';

interface KeyFiguresProps {
  figures: HistoricalFigure[];
}

function getInitial(name: string): string {
  return name.charAt(0);
}

function generateAvatarColor(name: string): string {
  const colors = [
    '#c9372c',
    '#8b4513',
    '#4682b4',
    '#228b22',
    '#d4af37',
    '#8b0000',
    '#6b8e6b',
    '#cd853f',
    '#4169e1',
    '#8b7355',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function KeyFigures({ figures }: KeyFiguresProps) {
  const { handleLinkClick } = useInkTransitionContext();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-300">
        {figures.map((figure, index) => {
          const avatarColor = generateAvatarColor(figure.name);
          const dateRange =
            figure.birthYear && figure.deathYear
              ? `${formatYear(figure.birthYear)} — ${formatYear(figure.deathYear)}`
              : null;

          return (
            <motion.div
              key={figure.id}
              initial={mounted ? { opacity: 0, x: 16 } : { opacity: 1, x: 0 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="shrink-0"
            >
              <Link
                href={`/figure/${figure.id}/`}
                onClick={handleLinkClick(`/figure/${figure.id}/`)}
                className={cn(
                  'block w-44 rounded-xl border border-stone-200 bg-white p-4 shadow-sm',
                  'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'
                )}
              >
                {/* Avatar */}
                <div className="mb-3 flex justify-center">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white shadow-inner"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {getInitial(figure.name)}
                  </div>
                </div>

                {/* Name */}
                <h3 className="mb-1 text-center text-base font-semibold text-stone-900">
                  {figure.name}
                </h3>

                {/* Titles */}
                {figure.titles.length > 0 && (
                  <p className="mb-2 text-center text-xs text-stone-500">
                    {figure.titles.slice(0, 2).join(' · ')}
                  </p>
                )}

                {/* Dates */}
                {dateRange && (
                  <p className="text-center font-mono text-xs text-stone-400">
                    {dateRange}
                  </p>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Fade indicators for scroll hint */}
      <div className="pointer-events-none absolute bottom-4 right-0 top-0 w-12 bg-gradient-to-l from-stone-50 to-transparent" />
    </div>
  );
}
