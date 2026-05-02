'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import { cn, formatYear } from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';
import { categoryLabels, categoryColors } from '@/types/index';
import type { HistoricalEvent, EventCategory } from '@/types/index';

interface KeyEventsProps {
  events: HistoricalEvent[];
}

export function KeyEvents({ events }: KeyEventsProps) {
  const sortedEvents = [...events].sort((a, b) => a.year - b.year);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {sortedEvents.map((event, index) => {
        const hasImage = event.image && event.image.trim() !== '';
        return (
          <motion.article
            key={event.id}
            initial={mounted ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={cn(
              'group relative rounded-lg border border-stone-200 bg-white shadow-sm overflow-hidden',
              'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'
            )}
          >
            {/* Event image header */}
            {hasImage && (
              <div className="relative h-28 w-full overflow-hidden">
                <SafeImage
                  src={event.image}
                  alt={event.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            {/* Colored left border by category */}
            <div
              className={cn(
                'absolute left-0 w-1 rounded-l-lg',
                hasImage ? 'top-28 bottom-0' : 'top-0 h-full'
              )}
              style={{
                backgroundColor: categoryColors[event.category as EventCategory],
              }}
            />

            <div className={cn('p-5', hasImage && 'pt-4')}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <time className="font-mono text-sm font-medium text-stone-500">
                  {formatYear(event.year)}
                </time>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                  style={{
                    backgroundColor:
                      categoryColors[event.category as EventCategory],
                  }}
                >
                  {categoryLabels[event.category as EventCategory]}
                </span>
              </div>

              <h3 className="mb-1.5 text-base font-semibold text-stone-900 group-hover:text-stone-800">
                {event.title}
              </h3>

              <p className="line-clamp-3 text-sm leading-relaxed text-stone-600">
                {event.description}
              </p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
