'use client';

import { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
}

/**
 * Image wrapper that handles load failures gracefully.
 * Shows a colored placeholder instead of a broken-image icon.
 */
export function SafeImage({
  className,
  fallbackClassName,
  onError,
  src,
  alt,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-paper-darker/40 text-ink-light',
          className,
          fallbackClassName
        )}
        role="img"
        aria-label={alt || '图片加载失败'}
      >
        <span className="text-xs">{alt?.charAt(0) || '图'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}
