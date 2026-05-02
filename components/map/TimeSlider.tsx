'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dynasty } from '@/types/index';
import { formatYear } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimeSliderProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  dynasties: Dynasty[];
  onChange: (year: number) => void;
}

export function TimeSlider({
  minYear,
  maxYear,
  currentYear,
  dynasties,
  onChange,
}: TimeSliderProps) {
  const range = maxYear - minYear;
  const percentage = Math.max(0, Math.min(100, ((currentYear - minYear) / range) * 100));

  const dynastyMarkers = useMemo(() => {
    return dynasties.map((d) => ({
      id: d.id,
      name: d.name,
      color: d.color,
      startPct: ((d.startYear - minYear) / range) * 100,
      widthPct: Math.max(0.5, ((d.endYear - d.startYear) / range) * 100),
    }));
  }, [dynasties, minYear, range]);

  const majorTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let y = -2000; y <= 2000; y += 500) {
      if (y >= minYear && y <= maxYear) {
        ticks.push(y);
      }
    }
    return ticks;
  }, [minYear, maxYear]);

  return (
    <div className="w-full px-4 md:px-8 py-4 select-none">
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          key={currentYear}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Clock className="w-5 h-5 text-ink-medium" />
          <span className="font-serif text-2xl md:text-3xl font-black text-ink-black tracking-wide">
            {formatYear(currentYear)}
          </span>
        </motion.div>
      </div>

      <div className="relative">
        {/* Dynasty color segments */}
        <div className="relative h-2.5 w-full rounded-full overflow-hidden bg-paper-darker/80">
          {dynastyMarkers.map((d) => (
            <div
              key={d.id}
              className="absolute top-0 h-full"
              style={{
                left: `${d.startPct}%`,
                width: `${d.widthPct}%`,
                backgroundColor: d.color,
                opacity: 0.22,
              }}
            />
          ))}

          {/* Current position indicator */}
          <div
            className="absolute top-0 w-0.5 h-full bg-cinnabar z-10"
            style={{ left: `${percentage}%` }}
          />
        </div>

        {/* Range input */}
        <input
          type="range"
          min={0}
          max={range}
          value={currentYear - minYear}
          onChange={(e) => onChange(minYear + Number(e.target.value))}
          className="absolute inset-0 w-full h-2.5 appearance-none bg-transparent cursor-pointer z-20"
          style={{ marginTop: 0 }}
        />

        {/* Major tick marks */}
        <div className="relative h-4 mt-1">
          {majorTicks.map((y) => {
            const pct = ((y - minYear) / range) * 100;
            return (
              <div
                key={y}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-px h-1.5 bg-ink-lighter/50" />
                <span className="text-[10px] text-ink-lighter font-serif mt-0.5">
                  {formatYear(y)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynasty labels */}
        <div className="relative h-5 mt-1">
          {dynastyMarkers.map((d) => {
            const labelWidth = Math.max(d.widthPct, 2.5);
            return (
              <div
                key={d.id}
                className="absolute top-0 text-[10px] font-serif text-ink-light/80 whitespace-nowrap text-center"
                style={{
                  left: `${d.startPct + d.widthPct / 2}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <span
                  className="inline-block px-1"
                  title={d.name}
                >
                  {d.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--cinnabar);
          cursor: pointer;
          border: 3px solid var(--paper-bg);
          box-shadow: 0 2px 8px rgba(26, 15, 10, 0.25);
          transition: transform 0.15s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--cinnabar);
          cursor: pointer;
          border: 3px solid var(--paper-bg);
          box-shadow: 0 2px 8px rgba(26, 15, 10, 0.25);
        }
        input[type='range']::-webkit-slider-runnable-track {
          height: 10px;
          background: transparent;
        }
        input[type='range']::-moz-range-track {
          height: 10px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
