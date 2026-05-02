'use client';

import { motion } from 'framer-motion';
import { Dynasty } from '@/types/index';
import { cn } from '@/lib/utils';

interface DynastySelectorProps {
  dynasties: Dynasty[];
  selectedDynasty: Dynasty | null;
  onSelectDynasty: (dynasty: Dynasty) => void;
}

export function DynastySelector({
  dynasties,
  selectedDynasty,
  onSelectDynasty,
}: DynastySelectorProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <div className="flex gap-3 px-4 py-3 min-w-max snap-x snap-mandatory">
        {dynasties.map((dynasty, index) => {
          const isActive = selectedDynasty?.id === dynasty.id;
          return (
            <motion.button
              key={dynasty.id}
              onClick={() => onSelectDynasty(dynasty)}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-colors snap-start',
                'min-w-[130px] shrink-0 select-none',
                isActive
                  ? 'border-ink-dark bg-paper-dark shadow-lg'
                  : 'border-ink-lighter/40 bg-paper/80 hover:bg-paper-dark hover:border-ink-light'
              )}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35 }}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 ring-2 ring-offset-1 ring-offset-paper"
                style={{
                  backgroundColor: dynasty.color,
                  boxShadow: `0 0 0 2px var(--paper), 0 0 0 3.5px ${dynasty.color}`,
                }}
              />
              <div className="text-left">
                <div
                  className={cn(
                    'font-serif font-bold text-base leading-tight',
                    isActive ? 'text-ink-black' : 'text-ink-dark'
                  )}
                >
                  {dynasty.name}
                </div>
                <div className="text-[11px] text-ink-light font-serif mt-0.5 tracking-wide">
                  {dynasty.period}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
