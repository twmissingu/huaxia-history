import { notFound } from 'next/navigation';
import { InkLink } from '@/components/ink-transition/InkLink';
import { ArrowLeft } from 'lucide-react';

import { DynastyHero } from '@/components/dynasty/DynastyHero';
import { KeyEvents } from '@/components/dynasty/KeyEvents';
import { KeyFigures } from '@/components/dynasty/KeyFigures';

import dynasties from '@/data/dynasties.json';
import events from '@/data/events.json';
import figures from '@/data/figures.json';

import type { Dynasty, HistoricalEvent, HistoricalFigure } from '@/types/index';

export function generateStaticParams(): { id: string }[] {
  return (dynasties as Dynasty[]).map((d) => ({ id: d.id }));
}

interface DynastyPageProps {
  params: Promise<{ id: string }>;
}

export default async function DynastyPage({ params }: DynastyPageProps) {
  const { id } = await params;

  const dynasty = (dynasties as Dynasty[]).find((d) => d.id === id);
  if (!dynasty) {
    notFound();
  }

  const dynastyEvents = (events as HistoricalEvent[]).filter(
    (e) => e.dynasty === id
  );

  const dynastyFigures = (figures as HistoricalFigure[]).filter(
    (f) => f.dynasty === id
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <DynastyHero dynasty={dynasty} />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Overview */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">
            朝代概览
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-stone-700">
            {dynasty.overview}
          </p>
        </section>

        {/* Key Events */}
        {dynastyEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">
              重大事件
            </h2>
            <KeyEvents events={dynastyEvents} />
          </section>
        )}

        {/* Key Figures */}
        {dynastyFigures.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-stone-900">
              代表人物
            </h2>
            <KeyFigures figures={dynastyFigures} />
          </section>
        )}

        {/* Back to timeline */}
        <div className="pt-8">
          <InkLink
            href="/timeline"
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回时间轴
          </InkLink>
        </div>
      </div>
    </div>
  );
}
