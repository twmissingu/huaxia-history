'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import eventsData from '@/data/events.json';
import dynastiesData from '@/data/dynasties.json';
import { getDynastyColor, getDynastyName } from '@/lib/utils';
import type { HistoricalEvent, Dynasty, EventCategory } from '@/types/index';
import { EventCard } from './EventCard';
import { EventDetailModal } from './EventDetailModal';
import { FocusEffect } from './FocusEffect';
import { TimelineMiniMap } from './TimelineMiniMap';

interface TimelineViewProps {
  activeCategory: EventCategory | 'all';
}

const events = eventsData as HistoricalEvent[];
const dynasties = dynastiesData as Dynasty[];

interface DynastyGroup {
  dynasty: Dynasty;
  events: HistoricalEvent[];
}

export function TimelineView({ activeCategory }: TimelineViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectEvent = (event: HistoricalEvent, rect: DOMRect) => {
    setSelectedEvent(event);
    setOriginRect(rect);
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const groupedEvents = useMemo(() => {
    const filtered =
      activeCategory === 'all'
        ? events
        : events.filter((e) => e.category === activeCategory);

    const groups: DynastyGroup[] = [];
    const dynastyMap = new Map<string, Dynasty>();
    dynasties.forEach((d) => dynastyMap.set(d.id, d));

    // Sort by dynasty chronology, then by event year
    const sorted = [...filtered].sort((a, b) => {
      const dynA = dynastyMap.get(a.dynasty);
      const dynB = dynastyMap.get(b.dynasty);
      if (!dynA || !dynB) return 0;
      // First by dynasty start year
      if (dynA.startYear !== dynB.startYear) {
        return dynA.startYear - dynB.startYear;
      }
      // Then by event year within the same dynasty
      return a.year - b.year;
    });

    for (const event of sorted) {
      const dynasty = dynastyMap.get(event.dynasty);
      if (!dynasty) continue;

      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.dynasty.id === event.dynasty) {
        lastGroup.events.push(event);
      } else {
        groups.push({ dynasty, events: [event] });
      }
    }

    return groups;
  }, [activeCategory]);

  // Pre-compute global event indices to keep render pure
  const eventIndexMap = useMemo(() => {
    let index = 0;
    const map = new Map<string, { alignment: 'left' | 'right'; index: number }>();
    for (const group of groupedEvents) {
      for (const event of group.events) {
        map.set(event.id, {
          alignment: index % 2 === 0 ? 'left' : 'right',
          index,
        });
        index++;
      }
    }
    return map;
  }, [groupedEvents]);

  return (
    <>
      <div className="relative mx-auto max-w-5xl px-4 py-12" data-timeline-container>
        {/* Center axis line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-ink-lighter/30 md:left-1/2 md:-translate-x-px" />

        <div className="space-y-10">
          {groupedEvents.map((group) => {
            const dynastyColor = getDynastyColor(group.dynasty.id);

            return (
              <div key={group.dynasty.id} className="relative">
                {/* Dynasty header */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5 }}
                  className="relative mb-8 flex items-center justify-center"
                  data-dynasty-header={group.dynasty.id}
                  data-dynasty-name={getDynastyName(group.dynasty.id)}
                  data-dynasty-period={group.dynasty.period}
                >
                  {/* Header dot on axis */}
                  <div
                    className="absolute left-4 z-0 h-4 w-4 rounded-full border-2 border-paper md:left-1/2 md:-translate-x-1/2"
                    style={{ backgroundColor: dynastyColor }}
                  />

                  <div
                    className="relative z-10 ml-10 inline-flex items-center gap-3 rounded-full border px-6 py-2 md:ml-0"
                    style={{
                      borderColor: `${dynastyColor}60`,
                      backgroundColor: 'var(--paper-bg)'
                    }}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: dynastyColor }}
                    />
                    <span className="text-base font-bold text-ink-black">
                      {getDynastyName(group.dynasty.id)}
                    </span>
                    <span className="mx-1 h-4 w-px bg-ink-lighter/30" />
                    <span className="text-sm text-ink-light">
                      {group.dynasty.period}
                    </span>
                  </div>
                </motion.div>

                {/* Events in this dynasty */}
                <div className="space-y-8">
                  {group.events.map((event) => {
                    const meta = eventIndexMap.get(event.id)!;
                    return (
                      <FocusEffect key={event.id}>
                        <EventCard
                          event={event}
                          dynastyColor={dynastyColor}
                          alignment={meta.alignment}
                          index={meta.index}
                          onSelect={handleSelectEvent}
                        />
                      </FocusEffect>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* End of timeline marker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative mt-16 flex items-center justify-center"
        >
          <div className="absolute left-4 h-3 w-3 rounded-full border-2 border-ink-lighter bg-paper md:left-1/2 md:-translate-x-1/2" />
          <span className="ml-10 text-sm text-ink-light md:ml-0">
            — 历史长河，绵延不息 —
          </span>
        </motion.div>
      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        originRect={originRect}
        dynastyColor={selectedEvent ? getDynastyColor(selectedEvent.dynasty) : '#6b5b4f'}
      />

      <TimelineMiniMap dynasties={dynasties} />
    </>
  );
}
