"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn, getDynastyName, getDynastyColor } from "@/lib/utils";

interface QuoteItem {
  text: string;
  author: string;
  dynasty: string;
}

const quotes: QuoteItem[] = [
  {
    text: "天生我材必有用，千金散尽还复来。",
    author: "李白",
    dynasty: "tang",
  },
  {
    text: "老骥伏枥，志在千里；烈士暮年，壮心不已。",
    author: "曹操",
    dynasty: "sanguo",
  },
  {
    text: "莫等闲，白了少年头，空悲切。",
    author: "岳飞",
    dynasty: "song",
  },
  {
    text: "人生自古谁无死，留取丹心照汗青。",
    author: "文天祥",
    dynasty: "song",
  },
  {
    text: "大江东去，浪淘尽，千古风流人物。",
    author: "苏轼",
    dynasty: "song",
  },
  {
    text: "以铜为镜，可以正衣冠；以史为镜，可以知兴替；以人为镜，可以明得失。",
    author: "李世民",
    dynasty: "tang",
  },
  {
    text: "人固有一死，或重于泰山，或轻于鸿毛。",
    author: "司马迁",
    dynasty: "han",
  },
  {
    text: "路漫漫其修远兮，吾将上下而求索。",
    author: "屈原",
    dynasty: "zhou",
  },
  {
    text: "鞠躬尽瘁，死而后已。",
    author: "诸葛亮",
    dynasty: "sanguo",
  },
];

function InkParticles() {
  // Use seeded random to avoid hydration mismatch
  const particles = Array.from({ length: 8 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = (n: number) => ((seed * (i + 1) * n) % 1000) / 1000;
    return {
      id: i,
      size: rnd(1) * 100 + 40,
      left: rnd(2) * 100,
      top: rnd(3) * 100,
      duration: rnd(4) * 20 + 15,
      delay: rnd(5) * 10,
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background:
              "radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(201,55,44,0) 70%)",
            filter: "blur(20px)",
          }}
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -30, 15, 0],
            opacity: [0.2, 0.5, 0.3, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function QuoteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrentIndex((prev) => {
      setDirection(index > prev ? 1 : -1);
      return (index + quotes.length) % quotes.length;
    });
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % quotes.length;
      setDirection(1);
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev - 1 + quotes.length) % quotes.length;
      setDirection(-1);
      return next;
    });
  }, []);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % quotes.length;
        setDirection(1);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentQuote = quotes[currentIndex];
  const dynastyColor = getDynastyColor(currentQuote.dynasty);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a0a0f 0%, #1a0f0a 100%)",
        }}
      />

      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <InkParticles />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs tracking-[0.4em] text-white/30 uppercase mb-3">
            千古名句
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white/90 tracking-wider">
            先贤之语
          </h2>
          <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-cinnabar/50 to-transparent" />
        </motion.div>

        {/* Carousel */}
        <div className="relative min-h-[280px] sm:min-h-[240px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-white/10 mb-6 rotate-180" />

              {/* Quote text */}
              <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white/80 leading-relaxed tracking-wide mb-8 max-w-3xl">
                {currentQuote.text}
              </blockquote>

              {/* Author & dynasty */}
              <div className="flex items-center gap-3">
                <span className="text-sm sm:text-base text-gilt font-medium tracking-wider">
                  {currentQuote.author}
                </span>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wider border"
                  style={{
                    color: dynastyColor,
                    borderColor: `${dynastyColor}40`,
                    backgroundColor: `${dynastyColor}10`,
                  }}
                >
                  {getDynastyName(currentQuote.dynasty)}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-10">
          {/* Prev arrow */}
          <button
            type="button"
            onClick={goPrev}
            className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-white/25 hover:text-white/70 hover:bg-white/5"
            aria-label="上一条"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {quotes.map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  "relative w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-gilt w-6"
                    : "bg-white/20 hover:bg-white/40"
                )}
                aria-label={`转到第 ${index + 1} 条`}
              />
            ))}
          </div>

          {/* Next arrow */}
          <button
            type="button"
            onClick={goNext}
            className="group flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-white/25 hover:text-white/70 hover:bg-white/5"
            aria-label="下一条"
          >
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Top and bottom dividers */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
