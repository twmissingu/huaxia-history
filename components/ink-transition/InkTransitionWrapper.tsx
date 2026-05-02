"use client";

import { InkTransition } from "./InkTransition";
import { useInkTransitionContext } from "./InkTransitionContext";

export function InkTransitionWrapper() {
  const { transition, onTransitionComplete } = useInkTransitionContext();

  return (
    <InkTransition
      isActive={transition.isActive}
      originX={transition.originX}
      originY={transition.originY}
      onComplete={onTransitionComplete}
    />
  );
}
