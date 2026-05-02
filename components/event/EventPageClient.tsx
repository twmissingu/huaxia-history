'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Landmark,
  ScrollText,
  Users,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { InkLink } from '@/components/ink-transition/InkLink';
import eventsData from '@/data/events.json';
import figuresData from '@/data/figures.json';
import dynastiesData from '@/data/dynasties.json';
import type { HistoricalEvent, HistoricalFigure, Dynasty } from '@/types/index';
import {
  getDynastyColor,
  getDynastyName,
  formatYear,
  cn,
} from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';
import { categoryColors, categoryLabels } from '@/types/index';

const events = eventsData as HistoricalEvent[];
const figures = figuresData as HistoricalFigure[];
const dynasties = dynastiesData as Dynasty[];

function lookupFigure(figureId: string): HistoricalFigure | undefined {
  const exact = figures.find((f) => f.id === figureId);
  if (exact) return exact;
  const stripped = figureId.replace(/^figure-/, '');
  return figures.find((f) => f.id === stripped);
}

function getFigureName(figureId: string): string {
  return lookupFigure(figureId)?.name || figureId.replace(/^figure-/, '');
}

function getFigureHref(figureId: string): string {
  const figure = lookupFigure(figureId);
  return figure ? `/figure/${figure.id}` : `/figure/${figureId.replace(/^figure-/, '')}`;
}

export function EventPageClient({ event }: { event: HistoricalEvent }) {
  if (!event) return null;

  const dynasty = dynasties.find((d) => d.id === event.dynasty);
  const dynastyColor = getDynastyColor(event.dynasty);
  const dynastyName = getDynastyName(event.dynasty);
  const hasImage = event.image && event.image.trim() !== '';
  const categoryColor = categoryColors[event.category] ?? '#6b5b4f';
  const categoryLabel = categoryLabels[event.category] ?? event.category;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden">
        {hasImage ? (
          <>
            <SafeImage
              src={event.image}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-stone-50" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${dynastyColor}22 0%, ${dynastyColor}0d 100%)`,
            }}
          />
        )}

        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 text-center">
          {/* Dynasty badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2"
          >
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white"
              style={{ backgroundColor: dynastyColor }}
            >
              <Landmark className="h-3 w-3" />
              {dynastyName}
            </span>
            <span
              className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-white"
              style={{ backgroundColor: categoryColor }}
            >
              {categoryLabel}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white"
            style={{
              textShadow: hasImage
                ? '0 2px 20px rgba(0,0,0,0.4)'
                : 'none',
              color: hasImage ? 'white' : 'var(--ink-black)',
            }}
          >
            {event.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-5"
          >
            <span
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{
                color: hasImage ? 'rgba(255,255,255,0.85)' : 'var(--ink-medium)',
              }}
            >
              <Calendar className="h-4 w-4" />
              <span className="font-mono font-bold" style={{ color: dynastyColor }}>
                {formatYear(event.year)}
              </span>
            </span>
            <span
              className="flex items-center gap-1.5 text-sm"
              style={{
                color: hasImage ? 'rgba(255,255,255,0.7)' : 'var(--ink-light)',
              }}
            >
              <MapPin className="h-4 w-4" />
              {event.location}
              {event.coordinates && (
                <span className="text-xs opacity-60">
                  ({event.coordinates[1].toFixed(2)}°N, {event.coordinates[0].toFixed(2)}°E)
                </span>
              )}
            </span>
          </motion.div>
        </div>

        {/* Fade to content */}
        <div className="h-8 bg-gradient-to-b from-transparent to-stone-50" />
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Left column */}
          <div className="space-y-8">
            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5" style={{ color: dynastyColor }} />
                <h2 className="text-xl font-bold text-stone-900">事件概述</h2>
              </div>
              <p className="text-base leading-relaxed text-stone-700 text-justify">
                {event.description}
              </p>
            </motion.section>

            {/* Significance */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={cn(
                'rounded-xl border-l-4 bg-white p-5 shadow-sm',
                'border-l-4'
              )}
              style={{ borderLeftColor: dynastyColor }}
            >
              <div className="flex items-center gap-2 mb-2">
                <ScrollText className="h-5 w-5" style={{ color: dynastyColor }} />
                <h2 className="text-lg font-bold text-stone-900">历史意义</h2>
              </div>
              <p className="text-base leading-relaxed text-stone-700">
                {event.significance}
              </p>
            </motion.section>

            {/* Back button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <InkLink
                href="/timeline"
                className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
              >
                <ArrowLeft className="h-4 w-4" />
                返回时间线
              </InkLink>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Dynasty card */}
            {dynasty && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <InkLink
                  href={`/dynasty/${dynasty.id}`}
                  className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {dynasty.heroImage ? (
                      <SafeImage
                        src={dynasty.heroImage}
                        alt={dynasty.name}
                        className="h-10 w-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <span
                        className="h-10 w-10 rounded-lg shrink-0"
                        style={{ backgroundColor: dynastyColor }}
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">{dynasty.name}朝</h3>
                      <p className="text-xs text-stone-500">{dynasty.period}</p>
                    </div>
                  </div>
                  <p className="text-sm text-stone-600 line-clamp-3">{dynasty.overview}</p>
                </InkLink>
              </motion.div>
            )}

            {/* Related Figures */}
            {event.relatedFigures.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-stone-500" />
                  <h3 className="text-sm font-bold text-stone-700">相关人物</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {event.relatedFigures.map((figureId) => {
                    const figure = lookupFigure(figureId);
                    const fColor = figure
                      ? getDynastyColor(figure.dynasty)
                      : dynastyColor;
                    return (
                      <InkLink
                        key={figureId}
                        href={getFigureHref(figureId)}
                        className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-3 transition-all hover:shadow-sm hover:border-stone-300"
                      >
                        {figure?.image ? (
                          <SafeImage
                            src={figure.image}
                            alt={getFigureName(figureId)}
                            className="h-9 w-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                            style={{ backgroundColor: fColor }}
                          >
                            {getFigureName(figureId).charAt(0)}
                          </div>
                        )}
                        <span className="text-sm font-medium text-stone-800">
                          {getFigureName(figureId)}
                        </span>
                      </InkLink>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Location info */}
            {event.coordinates && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-stone-500" />
                  <h3 className="text-sm font-bold text-stone-700">地理位置</h3>
                </div>
                <p className="text-sm text-stone-600">{event.location}</p>
                <p className="mt-1 text-xs text-stone-400 font-mono">
                  {event.coordinates[1].toFixed(4)}°N, {event.coordinates[0].toFixed(4)}°E
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
