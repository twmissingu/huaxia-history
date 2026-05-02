'use client';

import { motion } from 'framer-motion';
import { SearchX, Home, ArrowRight } from 'lucide-react';
import { InkLink } from '@/components/ink-transition/InkLink';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Decorative ink drop */}
        <div className="relative mx-auto mb-8 h-32 w-32">
          <motion.div
            className="absolute inset-0 rounded-full bg-cinnabar/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <SearchX className="h-12 w-12 text-cinnabar/60" />
          </div>
        </div>

        {/* Error code */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl font-black text-stone-200 tracking-wider mb-2"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl font-bold text-stone-800 mb-2"
        >
          此页已湮没于历史长河
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm text-stone-500 mb-8 leading-relaxed"
        >
          就像那些被岁月掩埋的古城遗址，<br />
          您要找的页面或许从未存在，或已随风而逝。
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <InkLink
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-cinnabar text-white px-6 py-3 text-sm font-medium transition-all hover:bg-cinnabar/90 hover:shadow-md"
          >
            <Home className="h-4 w-4" />
            返回首页
          </InkLink>
          <InkLink
            href="/timeline"
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition-all hover:bg-stone-50 hover:border-stone-400"
          >
            浏览时间线
            <ArrowRight className="h-4 w-4" />
          </InkLink>
        </motion.div>

        {/* Poem */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 text-xs text-stone-400 font-serif italic leading-relaxed"
        >
          「大江东去，浪淘尽，千古风流人物。」<br />
          —— 苏轼《念奴娇·赤壁怀古》
        </motion.p>
      </motion.div>
    </div>
  );
}
