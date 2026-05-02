"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Map, Users, ChevronDown } from "lucide-react";
import { DynastyGrid } from "@/components/hero/DynastyGrid";
import StatsSection from "@/components/hero/StatsSection";
import QuoteCarousel from "@/components/hero/QuoteCarousel";
import TodayInHistory from "@/components/hero/TodayInHistory";
import { useInkTransitionContext } from "@/components/ink-transition/InkTransitionContext";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const featureCards = [
  {
    title: "时间线",
    description: "从夏商周到明清，纵览五千年历史脉络",
    icon: Clock,
    href: "/timeline/",
  },
  {
    title: "历史地图",
    description: "穿越时空，见证华夏疆域的变迁与融合",
    icon: Map,
    href: "/map/",
  },
  {
    title: "人物图谱",
    description: "群星璀璨，探寻改变历史的伟大灵魂",
    icon: Users,
    href: "/timeline/",
  },
];

function InkParticles() {
  // Use seeded random to avoid hydration mismatch
  const particles = Array.from({ length: 12 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const rnd = (n: number) => ((seed * (i + 1) * n) % 1000) / 1000;
    return {
      id: i,
      size: rnd(1) * 120 + 40,
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
            background: "radial-gradient(circle, rgba(201,55,44,0.08) 0%, rgba(201,55,44,0) 70%)",
            filter: "blur(20px)",
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            opacity: [0.3, 0.7, 0.4, 0.3],
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

function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 40%, rgba(201,55,44,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 60%, rgba(212,175,55,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 30%, rgba(139,69,19,0.1) 0%, transparent 50%),
            radial-gradient(ellipse 70% 40% at 70% 20%, rgba(201,55,44,0.06) 0%, transparent 50%)
          `,
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 70%, rgba(201,55,44,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 80% at 60% 30%, rgba(212,175,55,0.06) 0%, transparent 45%)
          `,
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
    >
      <span className="text-[11px] tracking-[0.3em] text-white/30 uppercase">
        向下滚动
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 text-white/30" />
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  const { handleLinkClick } = useInkTransitionContext();
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0f]">
        {/* AI Hero Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(/huaxia-history/images/hero-master.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#0a0a0f]/40 to-[#0a0a0f]/90" />

        <GradientMesh />
        <InkParticles />

        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Seal */}
          <motion.div
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded border-2 border-cinnabar/60 text-cinnabar/80">
              <span className="text-xs font-black leading-none">华夏</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={fadeInUp}
            className="flex items-baseline gap-2 sm:gap-3 mb-6"
          >
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider text-white">
              华夏志
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-light text-white/40 tracking-widest">
              · 史
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl md:text-3xl text-white/60 tracking-[0.15em] mb-8 font-light"
          >
            上下五千年，一览华夏史
          </motion.p>

          {/* Decorative line */}
          <motion.div
            variants={fadeInUp}
            className="w-16 h-px bg-gradient-to-r from-transparent via-cinnabar/50 to-transparent mb-8"
          />

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-sm sm:text-base text-white/35 leading-relaxed max-w-lg tracking-wide"
          >
            从黄河流域的星火初燃，到万里江山的盛世华章。
            <br className="hidden sm:block" />
            以时间为轴，以空间为卷，重述中华民族的辉煌历程。
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            <Link
              href="/timeline/"
              onClick={handleLinkClick("/timeline/")}
              className="group relative px-8 py-3 rounded-lg bg-cinnabar/90 text-white text-sm font-medium tracking-wider overflow-hidden transition-all duration-300 hover:bg-cinnabar hover:shadow-[0_0_30px_rgba(201,55,44,0.3)]"
            >
              <span className="relative z-10">探索时间线</span>
            </Link>
            <Link
              href="/map/"
              onClick={handleLinkClick("/map/")}
              className="px-8 py-3 rounded-lg border border-white/15 text-white/70 text-sm font-medium tracking-wider transition-all duration-300 hover:border-white/30 hover:text-white hover:bg-white/5"
            >
              浏览地图
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards - Partially visible at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {featureCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    onClick={handleLinkClick(card.href)}
                    className="group relative flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cinnabar/10 text-cinnabar/70 transition-colors duration-300 group-hover:bg-cinnabar/20 group-hover:text-cinnabar">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white/80 mb-1 transition-colors duration-300 group-hover:text-white">
                        {card.title}
                      </h3>
                      <p className="text-xs text-white/30 leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                    <motion.div
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ChevronDown className="w-4 h-4 text-white/20 -rotate-90" />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* Statistics Section */}
      <StatsSection />

      <QuoteCarousel />

      <TodayInHistory />

      {/* Dynasty Overview Section */}
      <DynastyGrid />
    </div>
  );
}
