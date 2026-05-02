"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  gradient: string;
}

const stats: StatItem[] = [
  {
    value: 14,
    suffix: "",
    label: "朝",
    gradient: "from-cinnabar to-gilt",
  },
  {
    value: 208,
    suffix: "",
    label: "事",
    gradient: "from-gilt to-cinnabar",
  },
  {
    value: 106,
    suffix: "",
    label: "人",
    gradient: "from-cinnabar via-gilt to-cinnabar",
  },
  {
    value: 4000,
    suffix: "+",
    label: "年",
    gradient: "from-gilt to-cinnabar",
  },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 2,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function StatsSection() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 paper-texture overflow-hidden">
      {/* Top decorative divider */}
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />

      {/* Subtle background accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        {/* Section label */}
        <motion.div variants={itemVariants} className="text-center mb-14">
          <span className="inline-block text-xs tracking-[0.4em] text-ink-light uppercase mb-3">
            历史数据
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-ink-black tracking-wider">
            数字里的华夏
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-3">
                <span
                  className={cn(
                    "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight bg-gradient-to-br bg-clip-text text-transparent",
                    stat.gradient
                  )}
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <span className="text-lg sm:text-xl font-serif text-ink-medium tracking-[0.2em]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom decorative divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px ink-divider" />
    </section>
  );
}
