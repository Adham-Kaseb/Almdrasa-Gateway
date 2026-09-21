import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, X, Check, Sparkles } from "lucide-react";
import {
  CODE_LANGUAGES,
  CodeLanguageOption,
  generateVsCodeSnippetHtml,
} from "../../../utils/codeSnippetGenerator";
import { soundFx } from "../../../utils/audio";

interface InsertCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertCodeHtml: (html: string) => void;
  direction?: "rtl" | "ltr";
}

export const InsertCodeModal: React.FC<InsertCodeModalProps> = ({
  isOpen,
  onClose,
  onInsertCodeHtml,
  direction = "rtl",
}) => {
  const isLtr = direction === "ltr";
  const [selectedLang, setSelectedLang] = useState<CodeLanguageOption>(
    CODE_LANGUAGES[0],
  );

  if (!isOpen) return null;

  const handleConfirm = () => {
    soundFx.playPop();
    const snippetHtml = generateVsCodeSnippetHtml(
      selectedLang.sampleCode,
      selectedLang,
      isLtr,
    );
    onInsertCodeHtml(snippetHtml);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-2xl bg-[#171614] border border-white/12 shadow-[0_24px_64px_rgba(0,0,0,0.7)] text-[#F3EFE7] overflow-hidden"
          dir={isLtr ? "ltr" : "rtl"}
        >
          {/* Header */}
          <div className="p-4.5 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#DFCA9F]/15 border border-[#DFCA9F]/30 flex items-center justify-center text-[#DFCA9F]">
                <Code className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F8F4EC]">
                  {isLtr
                    ? "Choose Programming Language"
                    : "اختر لغة الكود البرمجي"}
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body: Language selector grid */}
          <div className="p-4 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CODE_LANGUAGES.map((lang) => {
                const isSelected = selectedLang.id === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => {
                      soundFx.playClick(500, 0.02);
                      setSelectedLang(lang);
                    }}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-[#DFCA9F] bg-[#DFCA9F]/12 shadow-xs"
                        : "border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#F8F4EC]">
                          {lang.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-[#DFCA9F] font-mono font-semibold">
                          {lang.extension}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#A69F93] truncate mt-0.5">
                        {isLtr ? lang.description : lang.descriptionAr}
                      </p>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#DFCA9F] text-[#171614] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/20 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Preview Box with VSCode Style */}
            <div className="mt-3 rounded-xl border border-white/10 bg-[#1E1E1E] p-3 text-start">
              <div className="flex items-center justify-between text-[11px] text-[#A69F93] mb-1.5 border-b border-white/10 pb-1 font-mono">
                <span className="flex items-center gap-1.5 text-[#DFCA9F]">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isLtr
                    ? "Preview Snippet Theme"
                    : "معاينة مظهر الكود في VSCode"}
                </span>
                <span>{selectedLang.name}</span>
              </div>
              <pre className="text-[11px] font-mono text-[#CCCCCC] overflow-x-auto p-1 leading-relaxed max-h-24 whitespace-pre">
                {selectedLang.sampleCode.split("\n").slice(0, 5).join("\n")}
                {"\n..."}
              </pre>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-3.5 border-t border-white/10 flex items-center justify-end gap-2 bg-white/2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-[#C8C2B7] hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isLtr ? "Cancel" : "إلغاء"}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#141310] text-xs font-bold hover:brightness-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-[#DFCA9F]/15 flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{isLtr ? "Insert Code" : "إدراج قالب الكود"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
