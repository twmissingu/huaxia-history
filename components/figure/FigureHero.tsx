'use client';

import { motion } from 'framer-motion';
import { HistoricalFigure } from '@/types/index';
import { getDynastyColor, getDynastyName, formatYear } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';

interface FigureHeroProps {
  figure: HistoricalFigure;
}

export function FigureHero({ figure }: FigureHeroProps) {
  const dynastyColor = getDynastyColor(figure.dynasty);
  const dynastyName = getDynastyName(figure.dynasty);
  const portraitImage = figure.image;

  const hasExtraNames = figure.courtesyName || figure.artName;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${dynastyColor}15 0%, ${dynastyColor}08 50%, transparent 100%)`,
      }}
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${dynastyColor} 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-start md:gap-10">
          {/* Portrait */}
          {portraitImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mx-auto mb-8 md:mx-0 md:mb-0 shrink-0"
            >
              <SafeImage
                src={portraitImage}
                alt={figure.name}
                className="h-48 w-36 sm:h-56 sm:w-40 rounded-2xl object-cover shadow-xl"
                style={{
                  boxShadow: `0 0 0 4px ${dynastyColor}40, 0 20px 40px -10px rgba(26,15,10,0.3)`,
                }}
              />
            </motion.div>
          )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex-1"
        >
          {/* Dynasty badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: dynastyColor }}
            />
            <span
              className="rounded-full px-4 py-1 text-sm font-semibold tracking-wider"
              style={{
                backgroundColor: `${dynastyColor}18`,
                color: dynastyColor,
                border: `1px solid ${dynastyColor}30`,
              }}
            >
              {dynastyName}
            </span>
          </motion.div>

          {/* Figure name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-5xl font-black tracking-wide text-ink-black sm:text-6xl md:text-7xl"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {figure.name}
          </motion.h1>

          {/* Courtesy / art names */}
          {hasExtraNames && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-3 text-lg text-ink-light sm:text-xl"
            >
              {figure.courtesyName && (
                <span className="mr-4">字{figure.courtesyName}</span>
              )}
              {figure.artName && (
                <span>号{figure.artName}</span>
              )}
            </motion.p>
          )}

          {/* Life dates */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-4 font-mono text-sm tracking-wider text-ink-medium"
          >
            {formatYear(figure.birthYear)} — {formatYear(figure.deathYear)}
            <span className="ml-3 text-ink-lighter">
              ({figure.birthplace})
            </span>
          </motion.p>

          {/* Titles */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {figure.titles.map((title) => (
              <span
                key={title}
                className="rounded-md bg-paper-dark px-3 py-1 text-sm text-ink-medium"
              >
                {title}
              </span>
            ))}
          </motion.div>

          {/* Quote */}
          {figure.quote && (
            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 border-l-4 pl-6 italic"
              style={{ borderColor: `${dynastyColor}60` }}
            >
              <span
                className="block text-4xl leading-none text-ink-lighter"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="mt-1 text-xl font-medium leading-relaxed text-ink-dark sm:text-2xl">
                {figure.quote}
              </p>
              <span
                className="mt-2 block text-right text-4xl leading-none text-ink-lighter"
                aria-hidden="true"
              >
                &rdquo;
              </span>
            </motion.blockquote>
          )}
        </motion.div>
        </div>
      </div>

      {/* Bottom ink divider */}
      <div className="ink-divider" />
    </section>
  );
}
