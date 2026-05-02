'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, ArrowRight, Clock } from 'lucide-react';
import dynastiesData from '@/data/dynasties.json';
import { getDynastyColor, formatPeriod } from '@/lib/utils';
import type { Dynasty } from '@/types/index';
import { cn } from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';

const dynasties = dynastiesData as Dynasty[];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function DynastiesPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Crown className="w-7 h-7 text-cinnabar" />
            <h1 className="text-4xl md:text-5xl font-serif font-black text-ink-black tracking-widest">
              历代王朝
            </h1>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-ink-medium font-serif text-base md:text-lg tracking-wider mt-2"
        >
          从夏禹治水到康乾盛世，十四朝风云变幻
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="ink-divider max-w-xs mx-auto mt-4"
        />
      </section>

      {/* Dynasty Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {dynasties.map((dynasty) => {
            const color = getDynastyColor(dynasty.id);
            const hasHero = dynasty.heroImage && dynasty.heroImage.trim() !== '';

            return (
              <motion.div key={dynasty.id} variants={itemVariants}>
                <Link
                  href={`/dynasty/${dynasty.id}/`}
                  className={cn(
                    'group block rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden',
                    'transition-all duration-300 hover:shadow-xl hover:-translate-y-1'
                  )}
                >
                  {/* Hero image or gradient header */}
                  <div
                    className={cn(
                      'h-36 w-full relative overflow-hidden',
                      !hasHero && 'bg-gradient-to-br'
                    )}
                    style={
                      !hasHero
                        ? {
                            background: `linear-gradient(135deg, ${color} 0%, ${dynasty.secondaryColor} 100%)`,
                          }
                        : undefined
                    }
                  >
                    {hasHero && (
                      <>
                        <SafeImage
                          src={dynasty.heroImage}
                          alt={dynasty.name}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(135deg, ${color}cc 0%, ${dynasty.secondaryColor}aa 60%, ${color}88 100%)`,
                          }}
                        />
                      </>
                    )}

                    {/* Dynasty name overlaid on header */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <span className="text-5xl font-black tracking-wider drop-shadow-lg">
                        {dynasty.name}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-sm text-stone-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-mono">
                          {formatPeriod(dynasty.startYear, dynasty.endYear)}
                        </span>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                        }}
                      >
                        {dynasty.capital.split('（')[0]}
                      </span>
                    </div>

                    <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4">
                      {dynasty.overview}
                    </p>

                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs italic text-stone-400 line-clamp-1 flex-1 mr-3"
                      >
                        「{dynasty.tagline}」
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium transition-colors duration-200" style={{ color }}>
                        详情
                        <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
                    style={{ backgroundColor: color }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
