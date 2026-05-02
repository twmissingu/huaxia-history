'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { cn, formatYear } from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';
import { categoryLabels, categoryColors } from '@/types/index';
import type { HistoricalEvent } from '@/types/index';

interface EventCardProps {
  event: HistoricalEvent;
  dynastyColor: string;
  alignment: 'left' | 'right';
  index: number;
  onSelect?: (event: HistoricalEvent, rect: DOMRect) => void;
}

export function EventCard({ event, dynastyColor, alignment, index, onSelect }: EventCardProps) {
  const hasImage = event.image && event.image.trim() !== '';
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.div
      initial={mounted ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index % 2 === 0 ? 0 : 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'relative w-full md:w-[calc(50%-2rem)]',
        alignment === 'left' ? 'md:mr-auto' : 'md:ml-auto'
      )}
    >
      {/* Connector dot on timeline axis */}
      <div
        className={cn(
          'absolute top-6 hidden h-3 w-3 rounded-full border-2 border-paper md:block',
          alignment === 'left' ? '-right-[calc(2rem+6px)]' : '-left-[calc(2rem+6px)]'
        )}
        style={{ backgroundColor: dynastyColor }}
      />

      {/* Connector line to axis */}
      <div
        className={cn(
          'absolute top-[1.875rem] hidden h-px bg-ink-lighter/40 md:block',
          alignment === 'left' ? 'left-full w-8' : 'right-full w-8'
        )}
      />

      <div
        className={cn(
          'group relative overflow-hidden rounded-lg bg-paper shadow-sm',
          'border border-ink-lighter/20',
          'transition-all duration-500',
          'hover:-translate-y-1 hover:shadow-lg',
          'cursor-pointer'
        )}
        onClick={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          onSelect?.(event, rect);
        }}
        style={{ borderLeftWidth: '4px', borderLeftColor: dynastyColor }}
      >
        {/* Event image */}
        {hasImage && (
          <div className="relative h-32 w-full overflow-hidden">
            <SafeImage
              src={event.image}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Category badge */}
        <div
          className={cn(
            'absolute right-3 rounded-full px-2.5 py-0.5 text-xs font-medium text-white z-10',
            hasImage ? 'top-[7.5rem]' : 'top-3'
          )}
          style={{ backgroundColor: categoryColors[event.category] }}
        >
          {categoryLabels[event.category]}
        </div>

        <div className="p-5 pr-20">
          {/* Year */}
          <div
            className="mb-2 font-mono text-sm font-semibold tracking-wide"
            style={{ color: dynastyColor }}
          >
            {formatYear(event.year)}
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-bold leading-snug text-ink-black">
            {event.title}
          </h3>

          {/* Description */}
          <p className="mb-3 text-sm leading-relaxed text-ink-medium line-clamp-3">
            {event.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-ink-light">
            <MapPin className="h-3 w-3" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
