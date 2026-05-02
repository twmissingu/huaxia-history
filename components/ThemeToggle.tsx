'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial state
    const isDarkMode =
      document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark, mounted]);

  if (!mounted) {
    return (
      <div className={cn('h-9 w-9 rounded-lg', className)} />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-lg',
        'transition-colors duration-300',
        'hover:bg-ink-black/5 dark:hover:bg-white/10',
        className
      )}
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4 text-gilt" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4 text-cinnabar" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
