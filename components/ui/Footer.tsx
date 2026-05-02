"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Map, Search, ScrollText } from "lucide-react";
import { useInkTransitionContext } from "@/components/ink-transition/InkTransitionContext";

const footerLinks = [
  {
    title: "探索",
    links: [
      { label: "时间线", href: "/timeline/", icon: Clock },
      { label: "历史地图", href: "/map/", icon: Map },
      { label: "搜索", href: "/search/", icon: Search },
    ],
  },
  {
    title: "朝代",
    links: [
      { label: "秦朝", href: "/dynasty/qin/" },
      { label: "汉朝", href: "/dynasty/han/" },
      { label: "唐朝", href: "/dynasty/tang/" },
      { label: "宋朝", href: "/dynasty/song/" },
      { label: "明朝", href: "/dynasty/ming/" },
      { label: "清朝", href: "/dynasty/qing/" },
    ],
  },
];

export function Footer() {
  const { handleLinkClick } = useInkTransitionContext();

  return (
    <footer className="relative bg-ink-black text-white/60 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cinnabar/30 to-transparent" />

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" onClick={handleLinkClick("/")} className="inline-flex items-center gap-2 group mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded border-2 border-cinnabar/60 text-cinnabar/80">
                <span className="text-[10px] font-black leading-none">华夏</span>
              </div>
              <span className="text-lg font-bold tracking-wider text-white/80">
                华夏志
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/30 max-w-sm mb-6">
              以时间为轴，以空间为卷，用现代数字技术重新演绎中华五千年的辉煌历程。
              从夏商周的星火初燃，到明清的盛世华章。
            </p>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              <span className="text-xs text-white/20 tracking-widest">
                上下五千年 · 一览华夏史
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={handleLinkClick(link.href)}
                      className="text-sm text-white/30 hover:text-cinnabar/80 transition-colors duration-300 flex items-center gap-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/15">
              华夏志 · 中国历史可视化项目
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-white/15">
                数据仅供学习交流
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
