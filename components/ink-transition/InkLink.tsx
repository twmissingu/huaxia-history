"use client";

import Link from "next/link";
import { useInkTransitionContext } from "./InkTransitionContext";
import { cn } from "@/lib/utils";

interface InkLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Drop-in replacement for Next.js `<Link>` that triggers the ink-drop page transition.
 * Works in both client and server components (it is itself a client component).
 */
export function InkLink({ href, children, className, onClick }: InkLinkProps) {
  const { handleLinkClick } = useInkTransitionContext();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        handleLinkClick(href)(e);
      }}
      className={cn(className)}
    >
      {children}
    </Link>
  );
}
