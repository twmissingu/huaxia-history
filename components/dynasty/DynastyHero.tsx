'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

import { formatPeriod, getDynastyColor, cn, withBasePath } from '@/lib/utils';
import type { Dynasty } from '@/types/index';

interface DynastyHeroProps {
  dynasty: Dynasty;
}

export function DynastyHero({ dynasty }: DynastyHeroProps) {
  const primaryColor = getDynastyColor(dynasty.id);
  const heroImage = dynasty.heroImage;

  return (
    <section className="relative overflow-hidden">
      {/* Background: image or gradient */}
      {heroImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${withBasePath(heroImage)})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}cc 0%, ${dynasty.secondaryColor}aa 60%, ${primaryColor}88 100%)`,
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${dynasty.secondaryColor} 100%)`,
          }}
        />
      )}

      {/* Subtle texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={cn(
            'text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl',
            'drop-shadow-lg'
          )}
        >
          {dynasty.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="mt-4 font-mono text-lg text-white/90 sm:text-xl"
        >
          {formatPeriod(dynasty.startYear, dynasty.endYear)}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="mt-3 font-serif text-xl italic text-white/85 sm:text-2xl"
        >
          {dynasty.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-white/95 backdrop-blur-sm"
        >
          <MapPin className="h-4 w-4" />
          <span>都城：{dynasty.capital}</span>
        </motion.div>
      </div>

      {/* Bottom fade into content */}
      <div className="h-8 bg-gradient-to-b from-transparent to-stone-50" />
    </section>
  );
}
