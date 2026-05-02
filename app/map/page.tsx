'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapView } from '@/components/map/MapView';
import { DynastySelector } from '@/components/map/DynastySelector';
import { TimeSlider } from '@/components/map/TimeSlider';
import { RouteAnimation } from '@/components/map/RouteAnimation';
import dynastiesData from '@/data/dynasties.json';
import eventsData from '@/data/events.json';
import { Dynasty, HistoricalEvent } from '@/types/index';
import { formatPeriod } from '@/lib/utils';
import {
  Crown,
  Clock,
  X,
  MapPinned,
  Route,
  Ship,
  Castle,
  Anchor,
  BookOpen,
} from 'lucide-react';

const dynasties = dynastiesData as Dynasty[];
const events = eventsData as HistoricalEvent[];

const MIN_YEAR = -2070;
const MAX_YEAR = 1912;

export default function MapPage() {
  const [selectedDynasty, setSelectedDynasty] = useState<Dynasty | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(618);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  const activeDynasty = useMemo(() => {
    return (
      dynasties.find((d) => currentYear >= d.startYear && currentYear <= d.endYear) || null
    );
  }, [currentYear]);

  const displayDynasty = selectedDynasty || activeDynasty;

  const handleSelectDynasty = (dynasty: Dynasty) => {
    setSelectedDynasty(dynasty);
    setCurrentYear(Math.round((dynasty.startYear + dynasty.endYear) / 2));
  };

  const handleClearSelection = () => {
    setSelectedDynasty(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="pt-24 pb-2 px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-3 mb-1">
            <MapPinned className="w-7 h-7 text-cinnabar" />
            <h1 className="text-4xl md:text-5xl font-serif font-black text-ink-black tracking-widest">
              山河图
            </h1>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-ink-medium font-serif text-base md:text-lg tracking-wider mt-1"
        >
          时空联动，纵览九州
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="ink-divider max-w-xs mx-auto mt-3"
        />
      </div>

      {/* Dynasty Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <DynastySelector
          dynasties={dynasties}
          selectedDynasty={selectedDynasty}
          onSelectDynasty={handleSelectDynasty}
        />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 md:px-8 pb-2 min-h-0">
        {/* Map Area */}
        <motion.div
          className="flex-1 min-h-[420px] sm:min-h-[480px] lg:min-h-0 relative min-w-0"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.6, ease: 'easeOut' }}
        >
          <MapView
            dynasties={dynasties}
            events={events}
            selectedDynasty={selectedDynasty}
            currentYear={currentYear}
            onSelectDynasty={handleSelectDynasty}
            viewBox={undefined}
          >
            {/* Route overlay */}
            {activeRoute && <RouteAnimation routeId={activeRoute} />}
          </MapView>

          {/* Route selector */}
          <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2 w-[104px]">
            <RouteButton
              active={activeRoute === 'silk-road'}
              onClick={() => setActiveRoute((prev) => prev === 'silk-road' ? null : 'silk-road')}
              icon={<Route className="h-3.5 w-3.5" />}
              label="丝绸之路"
            />
            <RouteButton
              active={activeRoute === 'grand-canal'}
              onClick={() => setActiveRoute((prev) => prev === 'grand-canal' ? null : 'grand-canal')}
              icon={<Ship className="h-3.5 w-3.5" />}
              label="京杭大运河"
            />
            <RouteButton
              active={activeRoute === 'great-wall'}
              onClick={() => setActiveRoute((prev) => prev === 'great-wall' ? null : 'great-wall')}
              icon={<Castle className="h-3.5 w-3.5" />}
              label="万里长城"
            />
            <RouteButton
              active={activeRoute === 'zhenghe-voyage'}
              onClick={() => setActiveRoute((prev) => prev === 'zhenghe-voyage' ? null : 'zhenghe-voyage')}
              icon={<Anchor className="h-3.5 w-3.5" />}
              label="郑和下西洋"
            />
            <RouteButton
              active={activeRoute === 'xuanzang-journey'}
              onClick={() => setActiveRoute((prev) => prev === 'xuanzang-journey' ? null : 'xuanzang-journey')}
              icon={<BookOpen className="h-3.5 w-3.5" />}
              label="玄奘西行"
            />
          </div>
        </motion.div>

        {/* Info Panel — always shows dynasty info, width is stable */}
        <aside className="lg:w-80 shrink-0 glass-paper rounded-2xl p-5 border border-ink-lighter/15 overflow-y-auto max-h-[520px] lg:max-h-none shadow-lg scrollbar-stable">
          {displayDynasty ? (
            <DynastyInfo
              dynasty={displayDynasty}
              isSelected={!!selectedDynasty}
              onClear={handleClearSelection}
            />
          ) : (
            <div className="text-center py-12 text-ink-light">
              <p className="text-sm font-serif">滑动时间轴或选择朝代查看详情</p>
            </div>
          )}
        </aside>
      </div>

      {/* Time Slider */}
      <motion.div
        className="shrink-0 pb-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
      >
        <TimeSlider
          minYear={MIN_YEAR}
          maxYear={MAX_YEAR}
          currentYear={currentYear}
          dynasties={dynasties}
          onChange={setCurrentYear}
        />
      </motion.div>

      {/* Data Source Attribution */}
      <div className="shrink-0 pb-2 px-4 md:px-8">
        <p className="text-[10px] text-ink-lighter font-serif text-center">
          地理数据部分来源于哈佛大学中国历史地理信息系统（CHGIS）· 人物数据部分来源于 Wikipedia（via grand-timeline）
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────

function RouteButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 w-full whitespace-nowrap text-xs font-serif shadow-sm transition-all border ${
        active
          ? 'bg-paper-dark border-cinnabar/40 text-ink-black shadow-md'
          : 'glass-paper border-ink-lighter/15 text-ink-medium hover:text-ink-dark'
      }`}
      title={label}
    >
      {icon}
      {label}
    </button>
  );
}

function DynastyInfo({
  dynasty,
  isSelected,
  onClear,
}: {
  dynasty: Dynasty;
  isSelected: boolean;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-3xl font-serif font-black text-ink-black tracking-wide">
            {dynasty.name}
          </h2>
          <p className="text-sm text-ink-medium font-serif mt-0.5">{dynasty.shortName}</p>
        </div>
        {isSelected && (
          <button
            type="button"
            onClick={onClear}
            className="p-1.5 rounded-lg hover:bg-paper-dark transition-colors"
            aria-label="清除选择"
          >
            <X className="w-4 h-4 text-ink-light" />
          </button>
        )}
      </div>

      <div
        className="w-full h-1 rounded-full mb-4"
        style={{ backgroundColor: dynasty.color }}
      />

      <div className="space-y-3">
        <InfoRow
          icon={<Clock className="w-4 h-4" />}
          text={formatPeriod(dynasty.startYear, dynasty.endYear)}
        />
        <InfoRow
          icon={<Crown className="w-4 h-4" />}
          text={dynasty.capital}
        />
      </div>

      <div className="ink-divider my-4" />

      <p className="text-sm text-ink-dark leading-relaxed font-serif text-justify">
        {dynasty.overview}
      </p>

      <div
        className="mt-4 p-3.5 rounded-xl border-l-[3px] bg-paper-dark/40"
        style={{ borderColor: dynasty.color }}
      >
        <p className="text-sm font-serif italic text-ink-medium leading-relaxed">
          「{dynasty.tagline}」
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-ink-light shrink-0">{icon}</span>
      <span className="text-ink-dark font-serif">{text}</span>
    </div>
  );
}
