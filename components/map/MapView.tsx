'use client';

import { useState, useMemo, useCallback, memo } from 'react';

import { Dynasty, HistoricalEvent, City, categoryColors } from '@/types/index';
import { formatYear } from '@/lib/utils';
import { Crown, ScrollText, MapPin, Plus, Minus, RotateCcw } from 'lucide-react';

import { useMapZoom } from './useMapZoom';
import geoPaths from '@/data/geo-paths.json';

// ─── Projection ───────────────────────────────────────────────────────────

export const VIEWBOX_W = 1200;
export const VIEWBOX_H = 850;
const MIN_LON = 80;
const MAX_LON = 135;
const MIN_LAT = 17;
const MAX_LAT = 55;

export function project(lon: number, lat: number): [number, number] {
  const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * VIEWBOX_W;
  const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * VIEWBOX_H;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// ─── Territory blobs (SVG viewBox coords) ─────────────────────────────────

const TERRITORIES: Record<string, string> = {
  xia: 'M 530,500 L 570,490 L 590,520 L 550,540 L 520,530 Z',
  shang:
    'M 520,460 L 580,450 L 610,480 L 580,510 L 530,500 L 500,480 Z',
  zhou:
    'M 460,410 L 550,395 L 650,415 L 670,460 L 630,510 L 550,525 L 470,505 L 440,460 Z',
  qin:
    'M 430,390 L 550,370 L 680,395 L 710,450 L 660,530 L 550,550 L 440,515 L 405,450 Z',
  han:
    'M 370,360 L 550,335 L 750,360 L 800,445 L 745,545 L 630,590 L 500,610 L 390,565 L 325,470 Z',
  sanguo:
    'M 520,370 L 620,360 L 670,410 L 640,495 L 560,505 L 495,460 Z M 355,430 L 440,420 L 470,485 L 415,515 L 340,490 Z M 620,495 L 705,485 L 735,550 L 680,595 L 595,580 Z',
  jin:
    'M 470,430 L 580,420 L 690,440 L 730,495 L 690,565 L 605,600 L 495,585 L 435,520 Z',
  sui:
    'M 410,395 L 550,375 L 680,400 L 720,455 L 675,545 L 570,590 L 455,565 L 390,500 Z',
  tang:
    'M 330,330 L 550,310 L 745,335 L 820,420 L 775,525 L 670,590 L 515,610 L 375,565 L 285,455 L 305,370 Z',
  wudai:
    'M 510,395 L 605,385 L 650,430 L 615,495 L 540,505 L 475,460 Z',
  song:
    'M 435,445 L 560,435 L 660,455 L 710,510 L 670,585 L 575,615 L 460,600 L 395,540 Z',
  yuan:
    'M 255,255 L 550,225 L 840,260 L 940,355 L 885,495 L 750,580 L 565,610 L 370,575 L 240,455 L 220,350 Z',
  ming:
    'M 305,305 L 550,285 L 755,310 L 835,395 L 790,510 L 665,585 L 510,605 L 355,570 L 265,465 L 285,370 Z',
  qing:
    'M 195,195 L 550,175 L 890,200 L 1010,305 L 975,460 L 870,565 L 715,630 L 550,650 L 315,615 L 185,510 L 165,385 L 185,280 Z',
};

// ─── Graticule labels ─────────────────────────────────────────────────────

const LON_LABELS = [80, 90, 100, 110, 120, 130];
const LAT_LABELS = [55, 45, 35, 25, 17];

// ─── Types ────────────────────────────────────────────────────────────────

interface MapViewProps {
  dynasties: Dynasty[];
  events: HistoricalEvent[];
  selectedDynasty: Dynasty | null;
  currentYear: number;
  onSelectDynasty: (dynasty: Dynasty) => void;
  viewBox?: string;
  trail?: React.ReactNode;
  children?: React.ReactNode;
}

interface TooltipState {
  svgX: number;
  svgY: number;
  content: React.ReactNode;
}

// ─── Memoized Sub-components ──────────────────────────────────────────────
// Extracted to stable React.memo components so hover state changes
// (setTooltip) do NOT cause SVG DOM rebuild → no mouseleave flicker.

const EventMarker = memo(function EventMarker({
  event,
  onHover,
}: {
  event: HistoricalEvent;
  onHover: (event: HistoricalEvent, hovering: boolean) => void;
}) {
  if (!event.coordinates) return null;
  const [cx, cy] = project(event.coordinates[0], event.coordinates[1]);
  const color = categoryColors[event.category];

  const handleEnter = useCallback(() => onHover(event, true), [event, onHover]);
  const handleLeave = useCallback(() => onHover(event, false), [event, onHover]);

  return (
    <g className="cursor-pointer" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <circle cx={cx} cy={cy} r={4.5} fill={color} stroke="#f5f0e8" strokeWidth={1.5} opacity={0.9} />
    </g>
  );
});

const CityMarker = memo(function CityMarker({
  city,
  dynastyColor,
  onHover,
}: {
  city: City;
  dynastyColor: string;
  onHover: (city: City, color: string, hovering: boolean) => void;
}) {
  const [cx, cy] = project(city.coordinates[0], city.coordinates[1]);

  const handleEnter = useCallback(() => onHover(city, dynastyColor, true), [city, dynastyColor, onHover]);
  const handleLeave = useCallback(() => onHover(city, dynastyColor, false), [city, dynastyColor, onHover]);

  if (city.type === 'capital') {
    return (
      <g className="cursor-pointer" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <circle cx={cx} cy={cy} r={5.5} fill="none" stroke={dynastyColor} strokeWidth={1.5} opacity={0.7} />
        <circle cx={cx} cy={cy} r={2.5} fill={dynastyColor} opacity={0.85} />
      </g>
    );
  }

  if (city.type === 'battlefield') {
    const s = 3.5;
    const d = `M ${cx},${cy - s} L ${cx + s},${cy} L ${cx},${cy + s} L ${cx - s},${cy} Z`;
    return (
      <g className="cursor-pointer" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <path d={d} fill="#c0392b" opacity={0.75} stroke="#f5f0e8" strokeWidth={0.8} />
      </g>
    );
  }

  // major city
  return (
    <g className="cursor-pointer" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <circle cx={cx} cy={cy} r={2.8} fill={dynastyColor} opacity={0.6} stroke="#f5f0e8" strokeWidth={0.8} />
    </g>
  );
});

const CapitalMarker = memo(function CapitalMarker({
  dynasty,
  isSelected,
  onSelect,
  onHover,
}: {
  dynasty: Dynasty;
  isSelected: boolean;
  onSelect: (dynasty: Dynasty) => void;
  onHover: (dynasty: Dynasty, hovering: boolean) => void;
}) {
  const [cx, cy] = project(dynasty.capitalCoordinates[0], dynasty.capitalCoordinates[1]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(dynasty);
    },
    [dynasty, onSelect]
  );
  const handleEnter = useCallback(() => onHover(dynasty, true), [dynasty, onHover]);
  const handleLeave = useCallback(() => onHover(dynasty, false), [dynasty, onHover]);

  return (
    <g className="cursor-pointer" onClick={handleClick} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {isSelected && (
        <circle
          cx={cx}
          cy={cy}
          r={10}
          fill={dynasty.color}
          opacity={0.3}
          style={{ pointerEvents: 'none' }}
        >
          <animate
            attributeName="r"
            values="10;30;10"
            dur="2.2s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />
          <animate
            attributeName="opacity"
            values="0.3;0;0.3"
            dur="2.2s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
          />
        </circle>
      )}
      <circle cx={cx} cy={cy} r={7} fill={dynasty.color} stroke="#f5f0e8" strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={10} fill="none" stroke={dynasty.color} strokeWidth={1.2} opacity={0.5} />
    </g>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────

export function MapView({
  dynasties,
  events,
  selectedDynasty,
  currentYear,
  onSelectDynasty,
  viewBox: customViewBox,
  trail,
  children,
}: MapViewProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const {
    viewBox: zoomViewBox,
    isZoomed,
    zoomIn,
    zoomOut,
    reset,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
  } = useMapZoom();

  const effectiveViewBox = customViewBox || zoomViewBox;

  const activeDynasty = useMemo(() => {
    return (
      dynasties.find((d) => currentYear >= d.startYear && currentYear <= d.endYear) || null
    );
  }, [dynasties, currentYear]);

  const visibleEvents = useMemo(() => {
    if (selectedDynasty) {
      return events.filter((e) => e.dynasty === selectedDynasty.id);
    }
    return events.filter((e) => e.year <= currentYear && e.year >= currentYear - 250);
  }, [events, selectedDynasty, currentYear]);

  const visibleCities = useMemo(() => {
    const target = selectedDynasty || activeDynasty;
    if (!target || !target.cities || target.cities.length === 0) return [];
    return target.cities || [];
  }, [selectedDynasty, activeDynasty]);

  const territoryKey = selectedDynasty?.id || activeDynasty?.id;

  const handleCapitalHover = useCallback(
    (dynasty: Dynasty, hovering: boolean) => {
      if (!hovering) {
        setTooltip(null);
        return;
      }
      const [cx, cy] = project(dynasty.capitalCoordinates[0], dynasty.capitalCoordinates[1]);
      setTooltip({
        svgX: cx,
        svgY: cy,
        content: (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 shrink-0" style={{ color: dynasty.color }} />
              <span className="font-bold font-serif text-ink-black">
                {dynasty.name}朝都城
              </span>
            </div>
            <p className="text-sm text-ink-dark font-serif">{dynasty.capital}</p>
            <p className="text-xs text-ink-light mt-1 font-serif">{dynasty.period}</p>
          </div>
        ),
      });
    },
    []
  );

  const handleEventHover = useCallback(
    (event: HistoricalEvent, hovering: boolean) => {
      if (!hovering) {
        setTooltip(null);
        return;
      }
      if (!event.coordinates) return;
      const [cx, cy] = project(event.coordinates[0], event.coordinates[1]);
      setTooltip({
        svgX: cx,
        svgY: cy,
        content: (
          <div className="min-w-[180px] max-w-[320px]">
            <div className="flex items-center gap-2 mb-1.5">
              <ScrollText className="w-4 h-4 shrink-0 text-cinnabar" />
              <span className="font-bold font-serif text-ink-black text-sm leading-tight">
                {event.title}
              </span>
            </div>
            <p className="text-xs text-ink-medium font-serif">
              {formatYear(event.year)} · {event.location}
            </p>
            <p className="text-xs text-ink-dark mt-2 leading-relaxed">
              {event.description}
            </p>
            {event.significance && (
              <p className="text-[11px] text-ink-medium mt-2 leading-relaxed border-t border-ink-lighter/20 pt-1.5">
                {event.significance}
              </p>
            )}
          </div>
        ),
      });
    },
    []
  );

  const handleCityHover = useCallback(
    (city: City, dynastyColor: string, hovering: boolean) => {
      if (!hovering) {
        setTooltip(null);
        return;
      }
      const [cx, cy] = project(city.coordinates[0], city.coordinates[1]);
      setTooltip({
        svgX: cx,
        svgY: cy,
        content: (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 shrink-0" style={{ color: dynastyColor }} />
              <span className="font-bold font-serif text-ink-black">
                {city.name}
              </span>
              {city.type === 'capital' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                  都城
                </span>
              )}
              {city.type === 'battlefield' && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                  战场
                </span>
              )}
            </div>
            <p className="text-xs text-ink-dark font-serif">{city.description}</p>
          </div>
        ),
      });
    },
    []
  );

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-0 rounded-2xl overflow-hidden border-2 border-ink-lighter/20 shadow-inner">
      {/* Paper texture overlay inside map */}
      <div className="absolute inset-0 paper-texture opacity-60 pointer-events-none z-0" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(26,15,10,0.06) 100%)',
        }}
      />

      <svg
        viewBox={effectiveViewBox}
        className="absolute inset-0 w-full h-full z-[1] cursor-grab active:cursor-grabbing"
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        <defs>
          {/* Ink-wash blur filter for territories */}
          <filter id="inkWash" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.7" />
            </feComponentTransfer>
          </filter>

          {/* Inner shadow for China outline */}
          <filter id="innerShadow">
            <feOffset dx="0" dy="1" />
            <feGaussianBlur stdDeviation="2" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="rgba(26,15,10,0.08)" floodOpacity="1" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>

          {/* Glow filter for selected capital */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Grid lines ── */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`gh-${i}`}
            x1={0}
            y1={(VIEWBOX_H / 5) * i}
            x2={VIEWBOX_W}
            y2={(VIEWBOX_H / 5) * i}
            stroke="var(--ink-lighter)"
            strokeWidth={0.4}
            opacity={0.25}
            strokeDasharray="6,6"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`gv-${i}`}
            x1={(VIEWBOX_W / 6) * i}
            y1={0}
            x2={(VIEWBOX_W / 6) * i}
            y2={VIEWBOX_H}
            stroke="var(--ink-lighter)"
            strokeWidth={0.4}
            opacity={0.25}
            strokeDasharray="6,6"
          />
        ))}

        {/* ── Territory overlays ── */}
        {territoryKey && TERRITORIES[territoryKey] && (
          <path
            key={territoryKey}
            d={TERRITORIES[territoryKey]}
            fill={dynasties.find((d) => d.id === territoryKey)?.color || '#8b7355'}
            filter="url(#inkWash)"
            opacity={0.14}
            style={{ transition: 'opacity 0.9s ease-in-out' }}
          />
        )}

        {/* ── Province landmass (fills the country outline) ── */}
        <g opacity={0.9}>
          {geoPaths.provinces.map((p, i) => (
            <path
              key={`prov-fill-${i}`}
              d={p.d}
              fill="rgba(212, 196, 168, 0.22)"
              stroke="none"
              fillRule="evenodd"
            />
          ))}
        </g>

        {/* ── Province borders ── */}
        <g opacity={0.3}>
          {geoPaths.provinces.map((p, i) => (
            <path
              key={`prov-stroke-${i}`}
              d={p.d}
              fill="none"
              stroke="var(--ink-medium)"
              strokeWidth={0.5}
              fillRule="evenodd"
            />
          ))}
        </g>

        {/* ── Rivers ── */}
        <g opacity={0.4}>
          {geoPaths.rivers.map((r, i) => (
            <path
              key={`river-${i}`}
              d={r.d}
              fill="none"
              stroke="#5B8DB8"
              strokeWidth={0.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* ── Lakes ── */}
        <g opacity={0.35}>
          {geoPaths.lakes.map((l, i) => (
            <path
              key={`lake-${i}`}
              d={l.d}
              fill="#87CEEB"
              stroke="#6BA3D0"
              strokeWidth={0.4}
              fillRule="evenodd"
            />
          ))}
        </g>

        {/* ── Graticule labels ── */}
        {LON_LABELS.map((lon) => {
          const [x] = project(lon, MIN_LAT);
          return (
            <text
              key={`lon-${lon}`}
              x={x}
              y={VIEWBOX_H - 6}
              fontSize={9}
              fill="var(--ink-light)"
              opacity={0.5}
              textAnchor="middle"
              fontFamily="serif"
            >
              {lon}°
            </text>
          );
        })}

        {LAT_LABELS.map((lat) => {
          const [, y] = project(MIN_LON, lat);
          return (
            <text
              key={`lat-${lat}`}
              x={10}
              y={y + 3}
              fontSize={9}
              fill="var(--ink-light)"
              opacity={0.5}
              fontFamily="serif"
            >
              {lat}°
            </text>
          );
        })}

        {/* ── Cardinal directions ── */}
        <text
          x={VIEWBOX_W / 2}
          y={20}
          fontSize={14}
          fill="var(--ink-light)"
          opacity={0.4}
          textAnchor="middle"
          fontFamily="serif"
          fontWeight={700}
        >
          北
        </text>
        <text
          x={VIEWBOX_W / 2}
          y={VIEWBOX_H - 8}
          fontSize={14}
          fill="var(--ink-light)"
          opacity={0.4}
          textAnchor="middle"
          fontFamily="serif"
          fontWeight={700}
        >
          南
        </text>
        <text
          x={12}
          y={VIEWBOX_H / 2}
          fontSize={14}
          fill="var(--ink-light)"
          opacity={0.4}
          textAnchor="middle"
          fontFamily="serif"
          fontWeight={700}
        >
          西
        </text>
        <text
          x={VIEWBOX_W - 12}
          y={VIEWBOX_H / 2}
          fontSize={14}
          fill="var(--ink-light)"
          opacity={0.4}
          textAnchor="middle"
          fontFamily="serif"
          fontWeight={700}
        >
          东
        </text>

        {/* ── Compass rose ── */}
        <g transform={`translate(${VIEWBOX_W - 70}, 55)`} opacity={0.35}>
          <circle cx={0} cy={0} r={28} fill="none" stroke="var(--ink-medium)" strokeWidth={1} />
          <circle cx={0} cy={0} r={22} fill="none" stroke="var(--ink-light)" strokeWidth={0.5} strokeDasharray="2,2" />
          <path d="M 0,-20 L 4,-4 L 20,0 L 4,4 L 0,20 L -4,4 L -20,0 L -4,-4 Z" fill="var(--ink-medium)" />
          <text x={0} y={-24} fontSize={10} fill="var(--ink-medium)" textAnchor="middle" fontFamily="serif" fontWeight={700}>
            北
          </text>
        </g>

        {/* ── Flight trail ── */}
        {trail}

        {/* ── Mountain symbols (western regions) ── */}
        <g opacity={0.15} fill="var(--ink-medium)">
          <path d="M 180,520 L 200,480 L 220,520 Z" />
          <path d="M 210,510 L 230,470 L 250,510 Z" />
          <path d="M 120,400 L 140,360 L 160,400 Z" />
          <path d="M 90,380 L 110,340 L 130,380 Z" />
          <path d="M 260,280 L 280,240 L 300,280 Z" />
        </g>

        {/* ── Capital markers ── */}
        {dynasties.map((dynasty) => {
          const isSelected = selectedDynasty?.id === dynasty.id;
          const isActive = activeDynasty?.id === dynasty.id;
          const visible = isSelected || isActive || !selectedDynasty;
          if (!visible) return null;
          return (
            <CapitalMarker
              key={dynasty.id}
              dynasty={dynasty}
              isSelected={isSelected}
              onSelect={onSelectDynasty}
              onHover={handleCapitalHover}
            />
          );
        })}

        {/* ── Event markers ── */}
        {visibleEvents.slice(0, 24).map((event) => (
          <EventMarker key={event.id} event={event} onHover={handleEventHover} />
        ))}

        {/* ── City markers ── */}
        {visibleCities.map((city) => {
          const dColor = selectedDynasty?.color || activeDynasty?.color || '#8b7355';
          return (
            <CityMarker
              key={`city-${city.name}`}
              city={city}
              dynastyColor={dColor}
              onHover={handleCityHover}
            />
          );
        })}

        {/* ── Route overlays ── */}
        {children}
      </svg>

      {/* ── HTML Tooltip Overlay ── */}
      {tooltip && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${(tooltip.svgX / VIEWBOX_W) * 100}%`,
            top: `${(tooltip.svgY / VIEWBOX_H) * 100}%`,
            transform: 'translate(14px, -50%)',
            transition: 'opacity 0.15s ease',
          }}
        >
          <div className="glass-paper rounded-xl px-4 py-3 shadow-xl border border-ink-lighter/20 w-fit">
            {tooltip.content}
          </div>
        </div>
      )}

      {/* ── Zoom Controls ── */}
      <div className="absolute top-3 right-3 z-10">
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={zoomIn}
            className="flex h-8 w-8 items-center justify-center rounded-lg glass-paper border border-ink-lighter/15 text-ink-medium shadow-sm transition-all hover:text-ink-dark hover:shadow-md active:scale-95"
            aria-label="放大"
            title="放大"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="flex h-8 w-8 items-center justify-center rounded-lg glass-paper border border-ink-lighter/15 text-ink-medium shadow-sm transition-all hover:text-ink-dark hover:shadow-md active:scale-95"
            aria-label="缩小"
            title="缩小"
          >
            <Minus className="h-4 w-4" />
          </button>
          {isZoomed && (
            <button
              type="button"
              onClick={reset}
              className="flex h-8 w-8 items-center justify-center rounded-lg glass-paper border border-ink-lighter/15 text-ink-medium shadow-sm transition-all hover:text-ink-dark hover:shadow-md active:scale-95"
              aria-label="重置视图"
              title="重置视图"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="absolute bottom-3 left-3 glass-paper rounded-lg px-3 py-2 text-xs font-serif text-ink-medium shadow-sm z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-ink-dark ring-2 ring-offset-1 ring-offset-paper" />
          <span>都城</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-cinnabar ring-2 ring-offset-1 ring-offset-paper" />
          <span>历史事件</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-ink-medium opacity-60 ring-2 ring-offset-1 ring-offset-paper" />
          <span>城镇</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width={10} height={10} className="shrink-0">
            <path d="M 5,1 L 9,5 L 5,9 L 1,5 Z" fill="#c0392b" opacity={0.75} />
          </svg>
          <span>战场</span>
        </div>
      </div>

      {/* ── Active dynasty badge ── */}
      {(activeDynasty || selectedDynasty) && (
        <div className="absolute top-3 left-3 glass-paper rounded-lg px-3 py-1.5 shadow-sm z-10 flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor:
                selectedDynasty?.color || activeDynasty?.color || '#8b7355',
            }}
          />
          <span className="text-sm font-serif font-bold text-ink-dark">
            {(selectedDynasty || activeDynasty)?.name}
          </span>
        </div>
      )}
    </div>
  );
}
