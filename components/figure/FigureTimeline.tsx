'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, ScrollText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatYear, getDynastyColor, cn, withBasePath } from '@/lib/utils';
import type { HistoricalEvent, HistoricalFigure } from '@/types/index';
import { categoryColors, categoryLabels } from '@/types/index';
import { InkLink } from '@/components/ink-transition/InkLink';

interface FigureTimelineProps {
  figure: HistoricalFigure;
  relatedEvents: HistoricalEvent[];
}

export function FigureTimeline({ figure, relatedEvents }: FigureTimelineProps) {
  const dynastyColor = getDynastyColor(figure.dynasty);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (relatedEvents.length === 0) {
    return null;
  }

  // Sort events by year
  const sortedEvents = [...relatedEvents].sort((a, b) => a.year - b.year);

  // Build timeline items: birth, events, death
  const timelineItems: Array<{
    type: 'birth' | 'event' | 'death';
    year: number;
    title: string;
    description?: string;
    location?: string;
    category?: string;
    eventId?: string;
    hasImage?: boolean;
    image?: string;
  }> = [];

  // Birth
  timelineItems.push({
    type: 'birth',
    year: figure.birthYear,
    title: `${figure.name}出生`,
    description: `生于${figure.birthplace}`,
  });

  // Events in lifetime
  sortedEvents.forEach((event) => {
    timelineItems.push({
      type: 'event',
      year: event.year,
      title: event.title,
      description: event.description,
      location: event.location,
      category: event.category,
      eventId: event.id,
      hasImage: !!event.image && event.image.trim() !== '',
      image: event.image,
    });
  });

  // Death
  timelineItems.push({
    type: 'death',
    year: figure.deathYear,
    title: `${figure.name}去世`,
  });

  // Re-sort by year
  timelineItems.sort((a, b) => a.year - b.year);

  return (
    <section className="py-12">
      <div className="mb-8 flex items-center gap-3">
        <Calendar className="h-5 w-5 text-ink-medium" />
        <h2 className="text-2xl font-bold text-ink-black">生平大事记</h2>
      </div>

      <div className="relative">
        {/* Center line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-px md:left-1/2 md:-translate-x-px"
          style={{ backgroundColor: `${dynastyColor}30` }}
        />

        <div className="space-y-8">
          {timelineItems.map((item, index) => (
            <motion.div
              key={`${item.type}-${item.year}-${item.title}-${index}`}
              initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={cn(
                'relative flex items-start gap-4 md:gap-0',
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              )}
            >
              {/* Content */}
              <div
                className={cn(
                  'flex-1 md:w-[calc(50%-2rem)]',
                  index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                )}
              >
                {item.type === 'event' && item.eventId ? (
                  <InkLink
                    href={`/event/${item.eventId}`}
                    className="group block"
                  >
                    <TimelineCard item={item} dynastyColor={dynastyColor} />
                  </InkLink>
                ) : (
                  <TimelineCard item={item} dynastyColor={dynastyColor} />
                )}
              </div>

              {/* Dot */}
              <div className="relative z-10 flex shrink-0 items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border-2 border-paper bg-white shadow-sm',
                    item.type === 'birth' && 'h-5 w-5 border-[3px]',
                    item.type === 'death' && 'h-5 w-5 border-[3px]'
                  )}
                  style={{ borderColor: dynastyColor }}
                />
              </div>

              {/* Year label */}
              <div
                className={cn(
                  'hidden md:block md:w-[calc(50%-2rem)]',
                  index % 2 === 0 ? 'md:pl-8 md:text-left' : 'md:pr-8 md:text-right'
                )}
              >
                <span
                  className="inline-block font-mono text-sm font-bold tracking-wider"
                  style={{ color: dynastyColor }}
                >
                  {formatYear(item.year)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineCard({
  item,
  dynastyColor,
}: {
  item: {
    type: 'birth' | 'event' | 'death';
    year: number;
    title: string;
    description?: string;
    location?: string;
    category?: string;
    hasImage?: boolean;
    image?: string;
  };
  dynastyColor: string;
}) {
  const isMilestone = item.type === 'birth' || item.type === 'death';

  return (
    <div
      className={cn(
        'rounded-xl border bg-white p-4 shadow-sm transition-all',
        isMilestone ? 'border-l-4' : 'border-l-4 hover:shadow-md hover:-translate-y-0.5',
        'group-hover:shadow-md'
      )}
      style={{
        borderLeftColor: isMilestone ? dynastyColor : dynastyColor,
        borderColor: isMilestone ? `${dynastyColor}30` : undefined,
      }}
    >
      {/* Image for events */}
      {item.hasImage && item.image && (
        <div
          className="mb-3 h-24 w-full rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${withBasePath(item.image)})` }}
        >
          <div className="h-full w-full rounded-lg bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      {/* Mobile year */}
      <span className="md:hidden font-mono text-xs font-bold" style={{ color: dynastyColor }}>
        {formatYear(item.year)}
      </span>

      {/* Title */}
      <h3
        className={cn(
          'text-base font-bold',
          isMilestone ? 'text-ink-black' : 'text-ink-dark group-hover:text-cinnabar'
        )}
      >
        {item.title}
      </h3>

      {/* Description */}
      {item.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-ink-medium line-clamp-3">
          {item.description}
        </p>
      )}

      {/* Meta */}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-light">
        {item.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.location}
          </span>
        )}
        {item.category && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
            style={{ backgroundColor: categoryColors[item.category as keyof typeof categoryColors] ?? '#6b5b4f' }}
          >
            {categoryLabels[item.category as keyof typeof categoryLabels] ?? item.category}
          </span>
        )}
      </div>
    </div>
  );
}
