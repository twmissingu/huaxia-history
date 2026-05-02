import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import eventsData from '@/data/events.json';
import type { HistoricalEvent } from '@/types/index';
import { EventPageClient } from '@/components/event/EventPageClient';

const events = eventsData as HistoricalEvent[];

export function generateStaticParams(): { id: string }[] {
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = events.find((e) => e.id === id);
  if (!event) {
    return { title: '事件未找到 | 华夏志' };
  }
  return {
    title: `${event.title} | 华夏志`,
    description: event.description.slice(0, 120) + '…',
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = events.find((e) => e.id === id);
  if (!event) {
    notFound();
  }
  return <EventPageClient event={event} />;
}
