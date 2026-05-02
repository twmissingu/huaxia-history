"use client";

import { createContext, useContext, ReactNode } from "react";
import { useInkTransition } from "./useInkTransition";

type InkTransitionContextValue = ReturnType<typeof useInkTransition>;

const InkTransitionContext = createContext<InkTransitionContextValue | null>(
  null
);

export function InkTransitionProvider({ children }: { children: ReactNode }) {
  const transitionApi = useInkTransition();

  return (
    <InkTransitionContext.Provider value={transitionApi}>
      {children}
    </InkTransitionContext.Provider>
  );
}

export function useInkTransitionContext(): InkTransitionContextValue {
  const ctx = useContext(InkTransitionContext);
  if (!ctx) {
    throw new Error(
      "useInkTransitionContext must be used within InkTransitionProvider"
    );
  }
  return ctx;
}
