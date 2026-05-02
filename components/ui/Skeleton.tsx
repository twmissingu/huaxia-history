'use client';

import { cn } from '@/lib/utils';

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-paper-darker/60 dark:bg-paper-dark/40',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-ink-lighter/10 bg-white dark:bg-paper-dark p-5 shadow-sm space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function FigureHeroSkeleton() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-start md:gap-10">
          <Skeleton className="mx-auto mb-8 md:mx-0 md:mb-0 h-48 w-36 sm:h-56 sm:w-40 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-14 w-48" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-64" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="h-4 w-4 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RelationGraphSkeleton() {
  return (
    <div className="flex items-center justify-center h-[400px] rounded-2xl border border-ink-lighter/10 bg-white dark:bg-paper-dark">
      <div className="text-center space-y-3">
        <div className="mx-auto h-12 w-12 rounded-full border-2 border-dashed border-ink-lighter/40 animate-spin" style={{ animationDuration: '3s' }} />
        <p className="text-sm text-ink-light">正在绘制关系图谱…</p>
      </div>
    </div>
  );
}
