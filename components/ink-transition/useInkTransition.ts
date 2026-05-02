"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface InkTransitionState {
  isActive: boolean;
  originX: number;
  originY: number;
}

interface UseInkTransitionReturn {
  /** Current transition state — pass this to `<InkTransition />` */
  transition: InkTransitionState;
  /** Call when the ink animation has fully completed */
  onTransitionComplete: () => void;
  /** Wrap any navigation call with this to trigger the ink transition */
  navigate: (href: string, event?: React.MouseEvent) => void;
  /** Wrap a link's onClick handler to capture coordinates and trigger transition */
  handleLinkClick: (href: string) => (e: React.MouseEvent) => void;
}

const TRANSITION_COVER_DELAY = 850; // ms — time until ink fully covers screen

/**
 * Hook that wraps Next.js App Router navigation with the ink-drop page transition.
 *
 * Usage in a layout or page wrapper:
 * ```tsx
 * const { transition, onTransitionComplete, handleLinkClick } = useInkTransition();
 *
 * <InkTransition
 *   isActive={transition.isActive}
 *   originX={transition.originX}
 *   originY={transition.originY}
 *   onComplete={onTransitionComplete}
 * />
 *
 * <Link href="/timeline" onClick={handleLinkClick("/timeline")}>时间线</Link>
 * ```
 */
export function useInkTransition(): UseInkTransitionReturn {
  const router = useRouter();
  const [transition, setTransition] = useState<InkTransitionState>({
    isActive: false,
    originX: 0,
    originY: 0,
  });

  const pendingHrefRef = useRef<string | null>(null);
  const isTransitioningRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTransitionComplete = useCallback(() => {
    isTransitioningRef.current = false;
    setTransition((prev) => ({ ...prev, isActive: false }));
    pendingHrefRef.current = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const navigate = useCallback(
    (href: string, event?: React.MouseEvent) => {
      // Don't transition for external links or anchor-only links
      if (href.startsWith("http") || href.startsWith("mailto:")) {
        window.location.href = href;
        return;
      }
      if (href.startsWith("#")) {
        // Anchor links: allow default browser behavior
        window.location.hash = href;
        return;
      }

      // Prevent double-transition
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      const clientX = event?.clientX ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
      const clientY = event?.clientY ?? (typeof window !== "undefined" ? window.innerHeight / 2 : 0);

      setTransition({
        isActive: true,
        originX: clientX,
        originY: clientY,
      });

      pendingHrefRef.current = href;

      // Navigate once the ink has covered the screen
      timeoutRef.current = setTimeout(() => {
        router.push(href);
      }, TRANSITION_COVER_DELAY);
    },
    [router]
  );

  // Cleanup pending timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleLinkClick = useCallback(
    (href: string) => {
      return (e: React.MouseEvent) => {
        // Let the browser handle modifier clicks normally (open in new tab, etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
          return;
        }

        e.preventDefault();
        navigate(href, e);
      };
    },
    [navigate]
  );

  return {
    transition,
    onTransitionComplete,
    navigate,
    handleLinkClick,
  };
}
