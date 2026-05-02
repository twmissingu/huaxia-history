'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const STORAGE_KEY = 'huaxia-search-history';

function getHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addToHistory(term: string) {
  const history = getHistory();
  const cleaned = term.trim();
  if (!cleaned) return;
  const updated = [cleaned, ...history.filter((h) => h !== cleaned)].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

function removeFromHistory(term: string) {
  const history = getHistory();
  const updated = history.filter((h) => h !== term);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

export function SearchBox({
  value,
  onChange,
  placeholder = '搜索朝代、事件、人物…',
}: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setHistory(getHistory());
    }
  }, [isFocused]);

  const handleSelect = useCallback(
    (term: string) => {
      onChange(term);
      setIsFocused(false);
      inputRef.current?.focus();
    },
    [onChange]
  );

  const handleRemove = useCallback(
    (term: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      removeFromHistory(term);
      setHistory(getHistory());
    },
    []
  );

  const handleClearAll = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    clearHistory();
    setHistory([]);
  }, []);

  const showDropdown = isFocused && value.length === 0 && history.length > 0;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative mx-auto w-full max-w-2xl"
    >
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border bg-paper px-5 py-4 shadow-sm transition-all duration-300',
          'focus-within:border-ink-lighter/50 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-ink-lighter/20'
        )}
      >
        <Search className="h-5 w-5 shrink-0 text-ink-light" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={cn(
            'w-full bg-transparent text-lg text-ink-black placeholder:text-ink-lighter',
            'focus:outline-none'
          )}
        />
        <AnimatePresence>
          {value.length > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper-dark text-ink-medium transition-colors hover:bg-ink-lighter/30 hover:text-ink-dark"
              aria-label="清除搜索"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Recent searches dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink-lighter/20 bg-paper shadow-xl"
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-lighter/10">
              <span className="text-xs font-medium text-ink-light flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                最近搜索
              </span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-ink-light hover:text-cinnabar transition-colors flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                清空
              </button>
            </div>
            <ul className="py-1">
              {history.map((term) => (
                <li key={term} className="group relative">
                  <button
                    type="button"
                    onClick={() => handleSelect(term)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-ink-dark transition-colors hover:bg-paper-dark"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-ink-lighter" />
                      {term}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(term, e)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-ink-lighter transition-colors hover:bg-ink-lighter/20 hover:text-ink-medium opacity-0 group-hover:opacity-100"
                    aria-label={`删除 ${term}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
