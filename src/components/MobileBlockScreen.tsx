import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, ArrowLeftRight, Layout, MousePointer2, AppWindow } from 'lucide-react';

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const FEATURES = [
  {
    icon: AppWindow,
    text: 'نوافذ تفاعلية قابلة للتحريك والتحجيم',
  },
  {
    icon: Layout,
    text: 'شريط المهام وسطح المكتب الذكي',
  },
  {
    icon: MousePointer2,
    text: 'تجربة استخدام تعتمد على الماوس ولوحة المفاتيح',
  },
] as const;

export const MobileBlockScreen: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0B0A] text-[#F3EFE7] select-none overflow-hidden"
      dir="rtl"
      role="alert"
      aria-label="هذه المنصة غير متاحة على الأجهزة المحمولة"
    >
      {/* Ambient Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#DFCA9F]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-16 right-8 w-56 h-56 bg-purple-600/6 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-12 left-8 w-40 h-40 bg-[#DFCA9F]/5 rounded-full blur-[60px] pointer-events-none" />

      <motion.main
        className="relative z-10 flex flex-col items-center px-6 max-w-sm text-center"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        {/* Device Transition Icon */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          variants={ITEM_VARIANTS}
        >
          <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/20">
            <Smartphone className="w-7 h-7 text-red-400/80 stroke-[1.5]" />
          </div>

          <ArrowLeftRight className="w-5 h-5 text-[#756F66] animate-pulse" />

          <div className="p-3 rounded-2xl bg-[#DFCA9F]/10 border border-[#DFCA9F]/30 shadow-lg shadow-[#DFCA9F]/5">
            <Monitor className="w-7 h-7 text-[#DFCA9F] stroke-[1.5]" />
          </div>
        </motion.div>

        {/* Primary Heading */}
        <motion.h1
          className="text-xl font-bold text-[#F8F4EC] leading-relaxed tracking-tight mb-3"
          variants={ITEM_VARIANTS}
        >
          هذه المنصة مُصممة لأجهزة
          <br />
          <span className="bg-gradient-to-l from-[#DFCA9F] to-[#CCA868] bg-clip-text text-transparent">
            الكمبيوتر فقط
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-sm text-[#9E988F] leading-relaxed mb-6 max-w-xs"
          variants={ITEM_VARIANTS}
        >
          بوابة المدرسة هي بيئة عمل تفاعلية تحاكي سطح المكتب، وتتطلب شاشة أكبر
          لتجربة كاملة وفعّالة.
        </motion.p>

        {/* Feature Card */}
        <motion.div
          className="w-full rounded-2xl bg-[#141311]/90 border border-white/10 p-5 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-xl mb-6"
          variants={ITEM_VARIANTS}
        >
          <p className="text-[11px] font-semibold text-[#DFCA9F] mb-3.5 tracking-wide">
            لماذا يُشترط جهاز كمبيوتر؟
          </p>

          <ul className="space-y-3" role="list">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-right"
              >
                <div className="shrink-0 w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#C8C2B7] stroke-[1.5]" />
                </div>
                <span className="text-xs text-[#B8B1A5] leading-relaxed">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Instruction Pill */}
        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DFCA9F]/10 border border-[#DFCA9F]/20"
          variants={ITEM_VARIANTS}
        >
          <Monitor className="w-4 h-4 text-[#DFCA9F]" />
          <span className="text-xs font-semibold text-[#DFCA9F]">
            يُرجى فتح المنصة من جهاز كمبيوتر أو لابتوب
          </span>
        </motion.div>

        {/* Brand Footer */}
        <motion.p
          className="text-[10px] text-[#504A43] mt-8"
          variants={ITEM_VARIANTS}
        >
          منحة المدرسة لتطوير مهندسي المستقبل • الدفعة السادسة 2026
        </motion.p>
      </motion.main>
    </div>
  );
};
