'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBox, addToHistory } from '@/components/search/SearchBox';
import figures from '@/data/figures.json';
import dynasties from '@/data/dynasties.json';
import events from '@/data/events.json';
import { HistoricalFigure, Dynasty, HistoricalEvent } from '@/types/index';
import {
  getDynastyColor,
  getDynastyName,
  formatYear,
  cn,
} from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';
import {
  Crown,
  Scroll,
  User,
  SearchX,
  ArrowRight,
  Calendar,
  MapPin,
  Lightbulb,
} from 'lucide-react';

type SearchResult =
  | { type: 'dynasty'; data: Dynasty }
  | { type: 'event'; data: HistoricalEvent }
  | { type: 'figure'; data: HistoricalFigure };

const POPULAR_TAGS = ['秦始皇', '丝绸之路', '安史之乱', '科举', '贞观之治'];

const FUN_FACTS = [
  '秦始皇统一六国时，仅有39岁。',
  '唐朝长安城人口超过百万，是当时世界上最大的城市。',
  '科举制度历时1300年，产生了约10万名进士。',
  '郑和下西洋比哥伦布发现新大陆早87年。',
  '宋朝的GDP曾占当时全世界的22%以上。',
  '《四库全书》收录图书3503种，共79337卷。',
  '长城总长度超过2万公里，可绕地球半圈。',
  '活字印刷术比古腾堡的金属活字早约400年。',
];

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '');
}

function getResultUrl(result: SearchResult): string {
  switch (result.type) {
    case 'dynasty':
      return `/dynasty/${result.data.id}`;
    case 'event':
      return `/event/${result.data.id}`;
    case 'figure':
      return `/figure/${result.data.id}`;
  }
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const normalizedQuery = normalizeText(query);
  const normalizedText = normalizeText(text);

  if (!normalizedText.includes(normalizedQuery)) {
    return <>{text}</>;
  }

  const parts: { text: string; match: boolean }[] = [];
  let lastIndex = 0;
  let searchFrom = 0;

  while (true) {
    const idx = normalizedText.indexOf(normalizedQuery, searchFrom);
    if (idx === -1) break;

    let origStart = 0;
    let normPos = 0;
    for (let i = 0; i < text.length; i++) {
      if (normPos === idx) {
        origStart = i;
        break;
      }
      if (!/\s/.test(text[i])) {
        normPos++;
      }
    }

    let origEnd = origStart;
    normPos = idx;
    for (let i = origStart; i < text.length; i++) {
      if (normPos === idx + normalizedQuery.length) {
        origEnd = i;
        break;
      }
      if (!/\s/.test(text[i])) {
        normPos++;
      }
      origEnd = i + 1;
    }

    if (lastIndex < origStart) {
      parts.push({ text: text.slice(lastIndex, origStart), match: false });
    }
    parts.push({ text: text.slice(origStart, origEnd), match: true });
    lastIndex = origEnd;
    searchFrom = idx + 1;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), match: false });
  }

  return (
    <>
      {parts.map((part, i) =>
        part.match ? (
          <mark
            key={i}
            className="rounded-sm bg-cinnabar/15 px-0.5 font-semibold text-cinnabar"
          >
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-paper-dark px-1.5 text-[11px] font-bold text-ink-medium">
      {count}
    </span>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const router = useRouter();

  const allFigures = figures as HistoricalFigure[];
  const allDynasties = dynasties as Dynasty[];
  const allEvents = events as HistoricalEvent[];

  const normalizedQuery = useMemo(
    () => normalizeText(query.trim()),
    [query]
  );

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    const matched: SearchResult[] = [];

    allDynasties.forEach((d) => {
      const haystack = normalizeText(
        `${d.name} ${d.shortName} ${d.overview} ${d.tagline}`
      );
      if (haystack.includes(normalizedQuery)) {
        matched.push({ type: 'dynasty', data: d });
      }
    });

    allEvents.forEach((e) => {
      const haystack = normalizeText(
        `${e.title} ${e.description} ${e.significance} ${e.location}`
      );
      if (haystack.includes(normalizedQuery)) {
        matched.push({ type: 'event', data: e });
      }
    });

    allFigures.forEach((f) => {
      const haystack = normalizeText(
        `${f.name} ${f.courtesyName ?? ''} ${f.artName ?? ''} ${f.bio} ${f.tags.join(' ')} ${f.titles.join(' ')} ${f.achievements.join(' ')} ${f.works?.join(' ') ?? ''}`
      );
      if (haystack.includes(normalizedQuery)) {
        matched.push({ type: 'figure', data: f });
      }
    });

    return matched;
  }, [normalizedQuery, allDynasties, allEvents, allFigures]);

  const grouped = useMemo(() => {
    const dynasties = results.filter((r) => r.type === 'dynasty');
    const events = results.filter((r) => r.type === 'event');
    const figures = results.filter((r) => r.type === 'figure');
    return { dynasties, events, figures };
  }, [results]);

  const flatResults = useMemo(
    () => [...grouped.dynasties, ...grouped.events, ...grouped.figures],
    [grouped]
  );

  const randomFunFact = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < normalizedQuery.length; i++) {
      hash = ((hash << 5) - hash) + normalizedQuery.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % FUN_FACTS.length;
    return FUN_FACTS[index];
  }, [normalizedQuery]);

  // Reset focused index when query changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [normalizedQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flatResults.length === 0) {
        if (e.key === 'Enter' && query.trim()) {
          e.preventDefault();
          addToHistory(query);
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < flatResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : flatResults.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const index = focusedIndex >= 0 ? focusedIndex : 0;
        const result = flatResults[index];
        if (result) {
          addToHistory(query);
          router.push(getResultUrl(result));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flatResults, focusedIndex, query, router]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0) {
      document
        .getElementById(`search-result-${focusedIndex}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [focusedIndex]);

  const dynastyCount = grouped.dynasties.length;
  const eventCount = grouped.events.length;

  const renderDynastyCard = useCallback(
    (result: SearchResult, globalIndex: number) => {
      const d = (result as Extract<SearchResult, { type: 'dynasty' }>).data;
      const isFocused = globalIndex === focusedIndex;
      const hasHero = d.heroImage && d.heroImage.trim() !== '';
      return (
        <motion.div layout key={d.id} id={`search-result-${globalIndex}`}>
          <Link
            href={`/dynasty/${d.id}`}
            onClick={() => addToHistory(query)}
            className={cn(
              'group flex items-start gap-4 rounded-xl border p-5 transition-all duration-300',
              isFocused
                ? 'border-cinnabar/40 bg-paper-dark shadow-md ring-2 ring-cinnabar/20'
                : 'border-transparent bg-paper-dark/40 hover:border-ink-lighter/30 hover:bg-paper-dark hover:shadow-md'
            )}
          >
            {hasHero ? (
              <SafeImage
                src={d.heroImage}
                alt={d.name}
                className="mt-1 h-10 w-10 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span
                className="mt-1 h-10 w-10 shrink-0 rounded-lg"
                style={{ backgroundColor: d.color }}
              />
            )}
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  'text-lg font-semibold transition-colors group-hover:text-cinnabar',
                  isFocused ? 'text-cinnabar' : 'text-ink-black'
                )}
              >
                <Highlight text={d.name} query={query} />
                <span className="ml-2 text-sm font-normal text-ink-light">
                  <Highlight text={d.period} query={query} />
                </span>
              </h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-medium">
                <Highlight text={d.overview} query={query} />
              </p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-lighter transition-all group-hover:translate-x-1 group-hover:text-ink-medium" />
          </Link>
        </motion.div>
      );
    },
    [query, focusedIndex]
  );

  const renderEventCard = useCallback(
    (result: SearchResult, globalIndex: number) => {
      const e = (result as Extract<SearchResult, { type: 'event' }>).data;
      const dynastyColor = getDynastyColor(e.dynasty);
      const isFocused = globalIndex === focusedIndex;
      return (
        <motion.div layout key={e.id} id={`search-result-${globalIndex}`}>
          <Link
            href={`/event/${e.id}`}
            onClick={() => addToHistory(query)}
            className={cn(
              'group flex items-start gap-4 rounded-xl border p-5 transition-all duration-300',
              isFocused
                ? 'border-cinnabar/40 bg-paper-dark shadow-md ring-2 ring-cinnabar/20'
                : 'border-transparent bg-paper-dark/40 hover:border-ink-lighter/30 hover:bg-paper-dark hover:shadow-md'
            )}
          >
            <div
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${dynastyColor}18` }}
            >
              <Scroll className="h-5 w-5" style={{ color: dynastyColor }} />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  'text-lg font-semibold transition-colors group-hover:text-cinnabar',
                  isFocused ? 'text-cinnabar' : 'text-ink-black'
                )}
              >
                <Highlight text={e.title} query={query} />
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-light">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatYear(e.year)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <Highlight text={e.location} query={query} />
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-medium">
                <Highlight text={e.description} query={query} />
              </p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-lighter transition-all group-hover:translate-x-1 group-hover:text-ink-medium" />
          </Link>
        </motion.div>
      );
    },
    [query, focusedIndex]
  );

  const renderFigureCard = useCallback(
    (result: SearchResult, globalIndex: number) => {
      const f = (result as Extract<SearchResult, { type: 'figure' }>).data;
      const dynastyColor = getDynastyColor(f.dynasty);
      const isFocused = globalIndex === focusedIndex;
      const hasImage = f.image && f.image.trim() !== '';
      return (
        <motion.div layout key={f.id} id={`search-result-${globalIndex}`}>
          <Link
            href={`/figure/${f.id}`}
            onClick={() => addToHistory(query)}
            className={cn(
              'group flex items-start gap-4 rounded-xl border p-5 transition-all duration-300',
              isFocused
                ? 'border-cinnabar/40 bg-paper-dark shadow-md ring-2 ring-cinnabar/20'
                : 'border-transparent bg-paper-dark/40 hover:border-ink-lighter/30 hover:bg-paper-dark hover:shadow-md'
            )}
          >
            {hasImage ? (
              <SafeImage
                src={f.image}
                alt={f.name}
                className="mt-1 h-10 w-10 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${dynastyColor}18` }}
              >
                <User className="h-5 w-5" style={{ color: dynastyColor }} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  'text-lg font-semibold transition-colors group-hover:text-cinnabar',
                  isFocused ? 'text-cinnabar' : 'text-ink-black'
                )}
              >
                <Highlight text={f.name} query={query} />
                {f.courtesyName && (
                  <span className="ml-2 text-sm font-normal text-ink-light">
                    字<Highlight text={f.courtesyName} query={query} />
                  </span>
                )}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-light">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${dynastyColor}12`,
                    color: dynastyColor,
                  }}
                >
                  {getDynastyName(f.dynasty)}
                </span>
                <span>
                  {formatYear(f.birthYear)} — {formatYear(f.deathYear)}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-medium">
                <Highlight text={f.bio} query={query} />
              </p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-ink-lighter transition-all group-hover:translate-x-1 group-hover:text-ink-medium" />
          </Link>
        </motion.div>
      );
    },
    [query, focusedIndex]
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-ink-lighter/10 bg-paper-dark/30">
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center text-3xl font-bold text-ink-black sm:text-4xl"
          >
            全站搜索
          </motion.h1>
          <SearchBox value={query} onChange={setQuery} />

          {/* Popular tags */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-5 flex flex-wrap justify-center gap-2"
          >
            {POPULAR_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  addToHistory(tag);
                }}
                className="rounded-full border border-ink-lighter/30 bg-paper/80 px-4 py-1.5 text-sm text-ink-medium transition-all hover:border-ink-light hover:bg-paper-dark hover:text-ink-dark hover:shadow-sm"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <AnimatePresence mode="wait">
          {query.trim() === '' ? (
            <motion.div
              key="empty-query"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <p className="text-ink-light text-sm">
                输入关键词开始探索中华五千年历史
              </p>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center"
            >
              <SearchX className="mx-auto h-10 w-10 text-ink-lighter" />
              <p className="mt-4 text-lg text-ink-dark">
                未找到与「
                <span className="font-semibold text-ink-black">{query}</span>
                」相关的内容
              </p>
              <p className="mt-2 text-sm text-ink-light">
                尝试使用更简短的关键词，或检查拼写是否正确
              </p>

              {/* Fun fact */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 mx-auto max-w-md glass-paper rounded-xl p-5 border border-ink-lighter/15 text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-gilt" />
                  <span className="text-xs font-medium text-ink-light uppercase tracking-wider">
                    历史趣闻
                  </span>
                </div>
                <p className="text-sm text-ink-dark font-serif leading-relaxed">
                  {randomFunFact}
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Summary */}
              <p className="text-sm text-ink-light">
                找到{' '}
                <span className="font-semibold text-ink-dark">
                  {results.length}
                </span>{' '}
                条相关结果
                {focusedIndex >= 0 && (
                  <span className="ml-2 text-ink-lighter">
                    （按 ↑ ↓ 选择，Enter 打开）
                  </span>
                )}
              </p>

              {/* Dynasties */}
              {grouped.dynasties.length > 0 && (
                <motion.section layout>
                  <div className="mb-4 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-ink-medium" />
                    <h2 className="text-lg font-bold text-ink-black">朝代</h2>
                    <CountBadge count={grouped.dynasties.length} />
                  </div>
                  <div className="grid gap-3">
                    {grouped.dynasties.map((r, i) =>
                      renderDynastyCard(r, i)
                    )}
                  </div>
                </motion.section>
              )}

              {/* Events */}
              {grouped.events.length > 0 && (
                <motion.section layout>
                  <div className="mb-4 flex items-center gap-2">
                    <Scroll className="h-4 w-4 text-ink-medium" />
                    <h2 className="text-lg font-bold text-ink-black">事件</h2>
                    <CountBadge count={grouped.events.length} />
                  </div>
                  <div className="grid gap-3">
                    {grouped.events.map((r, i) =>
                      renderEventCard(r, i + dynastyCount)
                    )}
                  </div>
                </motion.section>
              )}

              {/* Figures */}
              {grouped.figures.length > 0 && (
                <motion.section layout>
                  <div className="mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-ink-medium" />
                    <h2 className="text-lg font-bold text-ink-black">人物</h2>
                    <CountBadge count={grouped.figures.length} />
                  </div>
                  <div className="grid gap-3">
                    {grouped.figures.map((r, i) =>
                      renderFigureCard(r, i + dynastyCount + eventCount)
                    )}
                  </div>
                </motion.section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
