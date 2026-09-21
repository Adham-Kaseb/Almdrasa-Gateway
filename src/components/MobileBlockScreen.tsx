import React from "react";
import { motion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  ArrowLeft,
  Laptop,
  Code2,
  BookOpen,
  FolderGit2,
} from "lucide-react";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "بدء جلسة دراسية ومذاكرة حقيقية",
    desc: "البوابة أُعدت لمرافقتك أثناء الاستذكار والاستعانة بأدواتها ودروسك بتركيز كامل",
    badge: "Study Session",
  },
  {
    icon: Code2,
    title: "كتابة وتطبيق الأكواد (Code Editor)",
    desc: "التطبيق البرمجي الفعلي والمشاريع تتطلب استخدام محرر الأكواد ولوحة المفاتيح والماوس",
    badge: "Code Editor",
  },
  {
    icon: FolderGit2,
    title: "بيئة العمل ومتطلبات الدراسة",
    desc: "إنجاز مهام الدبلومة ومتابعة التطبيقات البرمجية باحترافية لا توفرها شاشات الهواتف",
    badge: "Workspace",
  },
] as const;

export const MobileBlockScreen: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-[#0C0B09] text-[#F3EFE7] select-none overflow-y-auto px-4 py-8"
      dir="rtl"
      role="alert"
      aria-label="هذه المنصة غير متاحة على الأجهزة المحمولة"
    >
      {/* Dynamic Ambient Background Aura & Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-105 h-105 bg-linear-to-b from-[#DFCA9F]/14 via-[#CCA868]/6 to-transparent rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-yellow-500/5 rounded-full blur-[90px]" />

        {/* Subtle Luxury Grid Lines Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #DFCA9F 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <motion.main
        className="relative z-10 flex flex-col items-center max-w-md w-full text-center"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        {/* Dynamic Dual-Device Comparison Card */}
        <motion.div
          className="flex items-center justify-center gap-3.5 mb-6"
          variants={ITEM_VARIANTS}
        >
          {/* Mobile Phone (Restricted) */}
          <div className="relative group p-3.5 rounded-2xl bg-linear-to-b from-rose-950/30 to-rose-950/10 border border-rose-500/25 shadow-lg shadow-rose-950/30 flex flex-col items-center gap-1.5">
            <Smartphone className="w-7 h-7 text-rose-400 stroke-[1.5]" />
            <span className="text-[10px] font-bold text-rose-400/90 tracking-tight">
              غير مدعوم
            </span>
          </div>

          {/* Smooth Directional Transfer Indicator */}
          <div className="flex flex-col items-center justify-center w-8">
            <div className="w-8 h-8 rounded-full bg-white/4 border border-white/10 flex items-center justify-center text-[#DFCA9F]">
              <ArrowLeft className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          {/* Desktop / Laptop (Supported & Highlighted) */}
          <div className="relative p-3.5 rounded-2xl bg-linear-to-b from-[#DFCA9F]/20 to-[#DFCA9F]/5 border border-[#DFCA9F]/40 shadow-[0_8px_24px_rgba(223,202,159,0.15)] flex flex-col items-center gap-1.5">
            <Monitor className="w-7 h-7 text-[#DFCA9F] stroke-[1.5]" />
            <span className="text-[10px] font-extrabold text-[#DFCA9F] tracking-tight">
              تجربة كاملة
            </span>
          </div>
        </motion.div>

        {/* Primary Heading */}
        <motion.h1
          className="text-2xl sm:text-3xl font-black text-[#F8F4EC] tracking-tight mb-5 flex flex-col items-center gap-2"
          variants={ITEM_VARIANTS}
        >
          <span>هذه المنصة مُصممة لأجهزة</span>
          <span className="bg-linear-to-l from-[#DFCA9F] via-[#F3E2BD] to-[#CCA868] bg-clip-text text-transparent pb-1">
            الكمبيوتر واللابتوب فقط
          </span>
        </motion.h1>

        {/* Glassmorphism Feature Card */}
        <motion.div
          className="w-full rounded-2xl bg-linear-to-b from-[#181715]/95 to-[#12110F]/95 border border-white/10 p-4.5 sm:p-5 shadow-[0_24px_64px_rgba(0,0,0,0.7)] backdrop-blur-xl mb-6 text-right"
          variants={ITEM_VARIANTS}
        >
          <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-3.5">
            <p className="text-xs font-bold text-[#DFCA9F] flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5" />
              <span>لماذا يُشترط جهاز كمبيوتر؟</span>
            </p>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-[#9E988F] border border-white/8">
              PC Exclusive
            </span>
          </div>

          <ul className="space-y-3" role="list">
            {FEATURES.map(({ icon: Icon, title, desc, badge }) => (
              <li
                key={title}
                className="flex items-start gap-3 p-2 rounded-xl bg-white/2 hover:bg-white/4 transition-colors"
              >
                <div className="shrink-0 w-9 h-9 rounded-xl bg-linear-to-br from-[#DFCA9F]/15 to-white/5 border border-[#DFCA9F]/25 flex items-center justify-center text-[#DFCA9F] shadow-sm">
                  <Icon className="w-4.5 h-4.5 stroke-[1.6]" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#F5F1E8]">
                      {title}
                    </span>
                    <span className="text-[9px] text-[#A69F93] font-mono">
                      {badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8E877C] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Action Instruction Button / Pill */}
        <motion.div
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-linear-to-r from-[#DFCA9F]/15 via-[#DFCA9F]/10 to-[#CCA868]/15 border border-[#DFCA9F]/35 shadow-[0_8px_20px_rgba(223,202,159,0.1)]"
          variants={ITEM_VARIANTS}
        >
          <div className="w-6 h-6 rounded-lg bg-[#DFCA9F] text-[#141311] flex items-center justify-center shadow-xs">
            <Monitor className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold text-[#F8F4EC]">
            يُرجى نسخ الرابط وفتحه من متصفح جهاز الكمبيوتر أو اللابتوب
          </span>
        </motion.div>
      </motion.main>
    </div>
  );
};
