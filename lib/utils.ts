import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const BASE_PATH = '/huaxia-history';

export function withBasePath(path: string): string {
  if (!path || path.startsWith('http') || path.startsWith(BASE_PATH)) return path;
  return `${BASE_PATH}${path}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year: number | undefined | null): string {
  if (year == null || Number.isNaN(year)) {
    return '年代不详';
  }
  if (year < 0) {
    return `公元前${Math.abs(year)}年`;
  }
  return `公元${year}年`;
}

export function formatPeriod(startYear: number, endYear: number): string {
  return `${formatYear(startYear)} — ${formatYear(endYear)}`;
}

export function getDynastyColor(id: string): string {
  const colors: Record<string, string> = {
    xia: '#8b7355',
    shang: '#7a8b69',
    zhou: '#8b4513',
    qin: '#c9372c',
    han: '#c9372c',
    sanguo: '#8b0000',
    jin: '#6b8e6b',
    sui: '#4682b4',
    tang: '#d4af37',
    wudai: '#808080',
    song: '#87ceeb',
    yuan: '#228b22',
    ming: '#cd853f',
    qing: '#4169e1',
  };
  return colors[id] || '#6b5b4f';
}

export function getDynastyName(id: string): string {
  const names: Record<string, string> = {
    xia: '夏',
    shang: '商',
    zhou: '周',
    qin: '秦',
    han: '汉',
    sanguo: '三国',
    jin: '晋',
    sui: '隋',
    tang: '唐',
    wudai: '五代十国',
    song: '宋',
    yuan: '元',
    ming: '明',
    qing: '清',
  };
  return names[id] || id;
}
