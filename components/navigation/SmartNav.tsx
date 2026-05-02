"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Clock, Map, ScrollText, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContextLabel } from "./ContextLabel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useInkTransitionContext } from "@/components/ink-transition/InkTransitionContext";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/timeline/", label: "时间线", icon: Clock },
  { href: "/map/", label: "地图", icon: Map },
  { href: "/dynasty/", label: "朝代", icon: ScrollText },
];

export function SmartNav() {
  const pathname = usePathname();
  const { handleLinkClick } = useInkTransitionContext();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(!isHome);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Initialize scroll state based on current position (handles mid-page refresh)
    const initialY = window.scrollY;
    if (initialY > 50) {
      setIsScrolled(true);
    } else if (isHome) {
      setIsScrolled(false);
    }
    lastScrollYRef.current = initialY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else if (isHome) {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass-paper shadow-[0_4px_30px_rgba(26,15,10,0.08)]"
            : "bg-transparent"
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300",
            isScrolled ? "h-14" : "h-[4.5rem]"
          )}
        >
          {/* Logo */}
          <Link href="/" onClick={handleLinkClick("/")} className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded border-2 border-cinnabar text-cinnabar">
              <span className="text-[10px] font-black leading-none">华夏</span>
            </div>
            <span
              className={cn(
                "text-lg font-bold tracking-wider transition-colors duration-300",
                isScrolled ? "text-ink-black" : "text-white"
              )}
            >
              华夏志
            </span>
          </Link>

          {/* Context Label */}
          <div className="hidden md:flex items-center gap-3">
            <div className="h-5 w-px bg-ink-lighter/30" />
            <ContextLabel isScrolled={isScrolled} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <ThemeToggle
              className={cn(
                "mr-1",
                isScrolled ? "text-ink-black" : "text-white"
              )}
            />
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleLinkClick(item.href)}
                  className={cn(
                    "relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    active
                      ? isScrolled
                        ? "text-cinnabar bg-cinnabar/5"
                        : "text-white/90 bg-white/10"
                      : isScrolled
                        ? "text-ink-medium hover:text-ink-black hover:bg-ink-black/5"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full",
                        isScrolled ? "bg-cinnabar" : "bg-white"
                      )}
                      style={{ width: "40%" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden relative z-50 p-2 rounded-lg transition-colors duration-300",
              isScrolled
                ? "text-ink-black hover:bg-ink-black/5"
                : "text-white hover:bg-white/10"
            )}
            aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-paper shadow-2xl"
            >
              <div className="pt-20 px-6 pb-8 flex flex-col h-full">
                <div className="flex flex-col gap-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 + 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={(e) => {
                            setIsMobileMenuOpen(false);
                            handleLinkClick(item.href)(e);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
                            active
                              ? "text-cinnabar bg-cinnabar/5"
                              : "text-ink-dark hover:text-ink-black hover:bg-ink-black/5"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                          {active && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cinnabar" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-auto pt-8">
                  <div className="ink-divider mb-6" />
                  <p className="text-xs text-ink-light leading-relaxed">
                    华夏志 — 探索中华五千年文明
                  </p>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
