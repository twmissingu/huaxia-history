'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import { CategoryFilter } from '@/components/timeline/CategoryFilter';
import { TimelineView } from '@/components/timeline/TimelineView';
import type { EventCategory } from '@/types/index';

export default function TimelinePage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all');

  return (
    <div className="min-h-screen bg-paper-texture">
      {/* Page header */}
      <div className="relative overflow-hidden px-4 pb-8 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <ScrollText className="h-8 w-8 text-cinnabar" />
            <h1 className="text-4xl font-black tracking-wide text-ink-black md:text-5xl">
              历史长河
            </h1>
            <ScrollText className="h-8 w-8 text-cinnabar" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg text-ink-medium"
          >
            从夏禹传启到清末新政，纵览华夏四千年风云变幻
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto mt-6 h-px w-32 bg-ink-lighter/40"
          />
        </div>
      </div>

      {/* Category filter */}
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Timeline */}
      <TimelineView activeCategory={activeCategory} />

      {/* Era data attribution */}
      <div className="py-4 text-center">
        <p className="text-[10px] text-ink-lighter font-serif">
          年号数据来源于 grand-timeline 开源项目
        </p>
      </div>
    </div>
  );
}
