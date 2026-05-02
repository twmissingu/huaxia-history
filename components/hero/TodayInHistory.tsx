"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { cn, formatYear, getDynastyColor, getDynastyName } from "@/lib/utils";
import type { HistoricalEvent } from "@/types/index";
import eventsData from "@/data/events.json";

const events = eventsData as HistoricalEvent[];

/**
 * Deterministically select a random event using a rotating seed.
 * The seed changes daily so a different event is featured each day,
 * while remaining SSR-safe (no Math.random during render).
 */
function getRandomEvent(): HistoricalEvent | null {
  if (events.length === 0) return null;
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % events.length;
  return events[index];
}

function getCategoryLabel(category: HistoricalEvent["category"]): string {
  const labels: Record<string, string> = {
    politics: "政治",
    military: "军事",
    culture: "文化",
    technology: "科技",
  };
  return labels[category] || category;
}

export default function TodayInHistory() {
  const todaysEvent = useMemo(() => getRandomEvent(), []);
  if (!todaysEvent) return null;
  const dynastyColor = getDynastyColor(todaysEvent.dynasty);

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 paper-texture overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />

      {/* Decorative background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${dynastyColor}10 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.4em] text-ink-light uppercase mb-3">
            <CalendarDays className="w-3.5 h-3.5" />
            风云往事
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-ink-black tracking-wider">
            回眸千年
          </h2>
          <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-cinnabar/40 to-transparent" />
        </motion.div>

        {/* Event card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="relative group">
            {/* Card */}
            <div
              className={cn(
                "relative rounded-2xl border bg-white/50 backdrop-blur-sm p-6 sm:p-10",
                "transition-all duration-500 hover:shadow-xl hover:shadow-ink-black/5 hover:-translate-y-1"
              )}
              style={{ borderColor: `${dynastyColor}20` }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-8 bottom-8 w-1 rounded-full"
                style={{ backgroundColor: dynastyColor }}
              />

              {/* Top row: year + dynasty + category */}
              <div className="flex flex-wrap items-center gap-3 mb-5 pl-5">
                <span
                  className="text-3xl sm:text-4xl font-black tracking-tight"
                  style={{ color: dynastyColor }}
                >
                  {formatYear(todaysEvent.year)}
                </span>
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium tracking-wider border"
                  style={{
                    color: dynastyColor,
                    borderColor: `${dynastyColor}30`,
                    backgroundColor: `${dynastyColor}08`,
                  }}
                >
                  {getDynastyName(todaysEvent.dynasty)}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium tracking-wider bg-ink-black/5 text-ink-medium border border-ink-black/5">
                  {getCategoryLabel(todaysEvent.category)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-ink-black tracking-wide mb-4 pl-5">
                {todaysEvent.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-ink-medium leading-relaxed mb-8 pl-5 line-clamp-4">
                {todaysEvent.description}
              </p>

              {/* Footer: location + link */}
              <div className="flex flex-wrap items-center justify-between gap-4 pl-5">
                <span className="text-xs text-ink-light tracking-wider">
                  <span className="text-ink-lighter">地点 · </span>
                  {todaysEvent.location}
                </span>

                <Link
                  href="/timeline/"
                  className="group/link inline-flex items-center gap-2 text-sm font-medium tracking-wider transition-colors duration-300"
                  style={{ color: dynastyColor }}
                >
                  <span className="relative">
                    了解更多
                    <span
                      className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover/link:w-full"
                      style={{ backgroundColor: dynastyColor }}
                    />
                  </span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Decorative corner ornament */}
            <div
              className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white/90 shadow-lg"
              style={{ backgroundColor: dynastyColor }}
            >
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px ink-divider" />
    </section>
  );
}
