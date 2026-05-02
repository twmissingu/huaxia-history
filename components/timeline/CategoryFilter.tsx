'use client';

import { cn } from '@/lib/utils';
import { categoryLabels, type EventCategory } from '@/types/index';

interface CategoryFilterProps {
  activeCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
}

const tabs: { key: EventCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'politics', label: categoryLabels.politics },
  { key: 'military', label: categoryLabels.military },
  { key: 'culture', label: categoryLabels.culture },
  { key: 'technology', label: categoryLabels.technology },
];

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="sticky top-0 z-40 w-full border-b border-ink-lighter/30 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-3 [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => onCategoryChange(tab.key)}
              className={cn(
                'relative shrink-0 px-5 py-2 text-sm font-medium transition-colors duration-300',
                'rounded-full',
                activeCategory === tab.key
                  ? 'text-ink-black'
                  : 'text-ink-light hover:text-ink-dark'
              )}
            >
              {tab.label}
              {activeCategory === tab.key && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-cinnabar" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
