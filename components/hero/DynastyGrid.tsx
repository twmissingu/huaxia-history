"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynastiesData from "@/data/dynasties.json";
import { getDynastyColor, formatPeriod } from "@/lib/utils";
import type { Dynasty } from "@/types/index";
import { ArrowRight } from "lucide-react";

const dynasties = dynastiesData as Dynasty[];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function DynastyGrid() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 paper-texture">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-black text-ink-black tracking-wider mb-4">
          历代王朝
        </h2>
        <p className="text-ink-medium text-sm sm:text-base tracking-wide">
          从夏禹治水到康乾盛世，十四朝风云变幻
        </p>
        <div className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-cinnabar/40 to-transparent" />
      </motion.div>

      {/* Dynasty cards grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
      >
        {dynasties.map((dynasty) => {
          const color = getDynastyColor(dynasty.id);
          return (
            <motion.div key={dynasty.id} variants={itemVariants}>
              <Link
                href={`/dynasty/${dynasty.id}/`}
                className="group relative flex flex-col items-center p-4 rounded-xl bg-white/40 border border-ink-black/5 transition-all duration-300 hover:bg-white/70 hover:shadow-lg hover:shadow-ink-black/5 hover:-translate-y-1"
              >
                {/* Dynasty name */}
                <span
                  className="text-2xl sm:text-3xl font-black mb-1 transition-transform duration-300 group-hover:scale-110"
                  style={{ color }}
                >
                  {dynasty.name}
                </span>

                {/* Period */}
                <span className="text-[10px] text-ink-light tracking-wider mb-2">
                  {dynasty.period}
                </span>

                {/* Tagline */}
                <span className="text-[10px] text-ink-light/60 text-center leading-snug line-clamp-2">
                  {dynasty.tagline}
                </span>

                {/* Hover arrow */}
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  <ArrowRight className="w-3.5 h-3.5" style={{ color }} />
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-1/2"
                  style={{ backgroundColor: color }}
                />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px ink-divider" />
      <div className="absolute bottom-0 left-0 right-0 h-px ink-divider" />
    </section>
  );
}
