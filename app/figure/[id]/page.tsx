import { notFound } from 'next/navigation';
import { InkLink } from '@/components/ink-transition/InkLink';
import { Metadata } from 'next';
import figures from '@/data/figures.json';
import events from '@/data/events.json';
import { HistoricalFigure, Relation, HistoricalEvent } from '@/types/index';
import { FigureHero } from '@/components/figure/FigureHero';
import { RelationGraph } from '@/components/figure/RelationGraph';
import { FigureTimeline } from '@/components/figure/FigureTimeline';
import { getDynastyColor } from '@/lib/utils';
import { ArrowLeft, Award, BookOpen, Tag } from 'lucide-react';

interface FigurePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  return (figures as HistoricalFigure[]).map((figure) => ({
    id: figure.id,
  }));
}

export async function generateMetadata({
  params,
}: FigurePageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const figure = (figures as HistoricalFigure[]).find((f) => f.id === decodedId);

  if (!figure) {
    return {
      title: '人物未找到 | 华夏志',
    };
  }

  return {
    title: `${figure.name} | 华夏志`,
    description: figure.bio.slice(0, 120) + '…',
  };
}

export default async function FigurePage({ params }: FigurePageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const figure = (figures as HistoricalFigure[]).find((f) => f.id === decodedId);

  if (!figure) {
    notFound();
  }

  const dynastyColor = getDynastyColor(figure.dynasty);

  return (
    <div className="min-h-screen pb-20">
      {/* Back button */}
      <div className="mx-auto max-w-5xl px-6 pt-6">
        <InkLink
          href="/"
          className="inline-flex items-center gap-2 text-sm text-ink-medium transition-colors hover:text-ink-black"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </InkLink>
      </div>

      {/* Hero */}
      <FigureHero figure={figure} />

      <div className="mx-auto max-w-5xl px-6">
        {/* Bio */}
        <section className="py-12">
          <h2 className="mb-6 text-2xl font-bold text-ink-black">生平简介</h2>
          <p className="text-lg leading-[1.9] text-ink-dark">{figure.bio}</p>

          {/* Categories & Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {figure.category.map((cat) => (
              <span
                key={cat}
                className="rounded-md px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: `${dynastyColor}12`,
                  color: dynastyColor,
                }}
              >
                {cat}
              </span>
            ))}
            {figure.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-md bg-paper-dark px-3 py-1 text-sm text-ink-medium"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </section>

        <div className="ink-divider" />

        {/* Achievements */}
        <section className="py-12">
          <div className="mb-6 flex items-center gap-3">
            <Award className="h-5 w-5 text-ink-medium" />
            <h2 className="text-2xl font-bold text-ink-black">主要成就</h2>
          </div>
          <ul className="space-y-4">
            {figure.achievements.map((achievement, index) => (
              <li
                key={index}
                className="flex items-start gap-4"
              >
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: dynastyColor }}
                />
                <span className="text-base leading-relaxed text-ink-dark">
                  {achievement}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline */}
        <FigureTimeline
          figure={figure}
          relatedEvents={(events as HistoricalEvent[]).filter(
            (e) =>
              (e.relatedFigures ?? []).some((rf) => {
                const stripped = rf.replace(/^figure-/, '');
                return stripped === figure.id || rf === figure.id;
              }) ||
              (e.year >= figure.birthYear && e.year <= figure.deathYear)
          )}
        />

        {/* Works */}
        {figure.works && figure.works.length > 0 && (
          <>
            <div className="ink-divider" />
            <section className="py-12">
              <div className="mb-6 flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-ink-medium" />
                <h2 className="text-2xl font-bold text-ink-black">代表作品</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {figure.works.map((work) => (
                  <span
                    key={work}
                    className="rounded-full border px-5 py-2 text-sm font-medium text-ink-dark transition-colors hover:bg-paper-dark"
                    style={{ borderColor: `${dynastyColor}35` }}
                  >
                    {work}
                  </span>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Relations */}
      <div className="ink-divider" />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="mb-8 text-2xl font-bold text-ink-black text-center">人物关系</h2>
        <RelationGraph 
          figure={figure} 
          relatedFigures={(figures as HistoricalFigure[]).filter(f => 
            figure.relations.some((r: Relation) => r.figureId === f.id)
          )}
        />
      </div>

      {/* Footer back button */}
      <div className="mx-auto max-w-5xl px-6 pt-8">
        <InkLink
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-paper-dark px-5 py-2.5 text-sm font-medium text-ink-dark transition-colors hover:bg-paper-darker hover:text-ink-black"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </InkLink>
      </div>
    </div>
  );
}
