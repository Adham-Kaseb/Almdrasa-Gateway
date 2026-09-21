import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Image as ImageIcon,
  RotateCcw,
  Palette,
  Sliders,
  SunMedium,
  Layers,
} from "lucide-react";
import { useOS } from "../../../context/OSContext";
import { soundFx } from "../../../utils/audio";

export interface StaticWallpaperOption {
  id: string;
  name: string;
  category: string;
  url: string;
  aspect: string;
}

export const STATIC_WALLPAPERS: StaticWallpaperOption[] = [
  {
    id: "silk_luxury",
    name: "سيلك أوبسيديان وذهب كوزميك",
    category: "تصميم فاخر مُوَلَّد",
    url: "/wallpapers/silk_luxury.jpg",
    aspect: "16:9 • 4K UHD",
  },
  {
    id: "obsidian_geometry",
    name: "معمارية أوبسيديان وشعاع الضوء",
    category: "هندسة معمارية",
    url: "/wallpapers/obsidian_geometry.jpg",
    aspect: "16:9 • 4K UHD",
  },
  {
    id: "indigo_nebula",
    name: "سديم النيلي والبنفسجي العميق",
    category: "سديم سحابي",
    url: "/wallpapers/indigo_nebula.jpg",
    aspect: "16:9 • 4K UHD",
  },
  {
    id: "minimal_dark",
    name: "الظلام المونوكرومي الهادئ",
    category: "بسيط وأنيق",
    url: "/wallpapers/minimal_dark.jpg",
    aspect: "16:9 • FHD",
  },
  {
    id: "golden_minimal",
    name: "أفق المدرسة الرقمي المذهب",
    category: "أكاديمي تنفيذي",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=85",
    aspect: "16:9 • Ultra HD",
  },
  {
    id: "cyber_noir",
    name: "أثير الفضاء السيبراني الداكن",
    category: "تجريد رقمي",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=85",
    aspect: "16:9 • Ultra HD",
  },
];

export interface GradientPreset {
  id: string;
  name: string;
  colors: string[];
  description: string;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: "noir_silk",
    name: "حرير النوار الكلاسيكي",
    colors: ["#000000", "#1a1a1a", "#2e2e2e", "#ffffff"],
    description: "المظهر الافتراضي الفاخر للبوابة بالأبيض والأسود",
  },
  {
    id: "royal_indigo",
    name: "النيلي الملكي والبنفسج",
    colors: ["#090A1A", "#1E1B4B", "#4338CA", "#818CF8"],
    description: "تدرجات عميقة مفعمة بالفخامة والهدوء الليلي",
  },
  {
    id: "emerald_matrix",
    name: "الزمرد السيبراني",
    colors: ["#021B14", "#064E3B", "#059669", "#34D399"],
    description: "طابع تقني مستوحى من الحماية والأنظمة المتقدمة",
  },
  {
    id: "sunset_amber",
    name: "العنبر الذهبي والغروب",
    colors: ["#1C0B02", "#7C2D12", "#D97706", "#FDE68A"],
    description: "دفء الأناقة الذهبية وتدرجات الغروب الساحرة",
  },
  {
    id: "deep_azure",
    name: "المحيط الأزرق العميق",
    colors: ["#031424", "#0C4A6E", "#0284C7", "#38BDF8"],
    description: "تدرج مائي نقي يعزز التركيز والإنتاجية العالية",
  },
  {
    id: "cyber_crimson",
    name: "أثير النيون القرمزي",
    colors: ["#1A0713", "#831843", "#DB2777", "#F472B6"],
    description: "طاقة عصرية وتناغم بصري جذاب ومبتكر",
  },
];

export const BackgroundSettingsPanel: React.FC = () => {
  const { appSettings, updateAppSettings, setCompanionMessage } = useOS();
  const bg = appSettings.background;

  const handleModeChange = (mode: "static" | "interactive") => {
    soundFx.playPop();
    updateAppSettings({
      background: {
        ...bg,
        mode,
      },
    });
    setCompanionMessage(
      mode === "static"
        ? "تم تفعيل نمط الخلفية الثابتة. يمكنك الآن اختيار أحد التصاميم المولدة عالية الدقة."
        : "تم تفعيل نمط الخلفية التفاعلية الشبكية. يمكنك الآن تعديل مزيج الألوان وتأثيرات التدفق.",
    );
  };

  const handleSelectWallpaper = (url: string, name: string) => {
    soundFx.playClick(520, 0.03);
    updateAppSettings({
      background: {
        ...bg,
        staticImage: url,
      },
    });
    setCompanionMessage(`تم تطبيق خلفية "${name}" بنجاح.`);
  };

  const handleApplyPreset = (preset: GradientPreset) => {
    soundFx.playClick(580, 0.03);
    updateAppSettings({
      background: {
        ...bg,
        interactiveColors: [...preset.colors],
      },
    });
    setCompanionMessage(`تم تطبيق تدرج "${preset.name}".`);
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...bg.interactiveColors];
    updatedColors[index] = newColor;
    updateAppSettings({
      background: {
        ...bg,
        interactiveColors: updatedColors,
      },
    });
  };

  const handleResetInteractive = () => {
    soundFx.playClick(320, 0.03);
    updateAppSettings({
      background: {
        ...bg,
        interactiveColors: ["#000000", "#1a1a1a", "#2e2e2e", "#ffffff"],
        interactiveSpeed: 0.3,
        interactiveDistortion: 0.8,
        interactiveSwirl: 0.15,
      },
    });
    setCompanionMessage("تمت استعادة إعدادات الخلفية التفاعلية الافتراضية.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-[#F3EFE7]">
      {/* Header Info */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-[#F8F4EC] flex items-center gap-2.5">
              <Palette className="w-5.5 h-5.5 text-[#DFCA9F]" />
              <span>خيارات ومظهر الخلفية</span>
            </h2>
            <p className="text-xs text-[#9E988F] mt-3.5 leading-relaxed">
              اختر بين الخلفيات الثابتة المولدة فائقة الدقة أو الخلفية الحركية
              التفاعلية مع تحكم دقيق في الألوان
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center p-1 rounded-2xl bg-[#171614] border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => handleModeChange("interactive")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                bg.mode === "interactive"
                  ? "bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#12110F] shadow-lg shadow-[#DFCA9F]/15 font-bold"
                  : "text-[#9E988F] hover:text-[#F3EFE7]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>خلفية تفاعلية</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("static")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                bg.mode === "static"
                  ? "bg-linear-to-r from-[#DFCA9F] to-[#CCA868] text-[#12110F] shadow-lg shadow-[#DFCA9F]/15 font-bold"
                  : "text-[#9E988F] hover:text-[#F3EFE7]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>خلفية ثابتة</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: STATIC WALLPAPERS */}
      {bg.mode === "static" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#DFCA9F]" />
                <span>معرض الخلفيات المولدة عالية الدقة</span>
              </h3>
              <p className="text-xs text-[#9E988F] mt-2.5 leading-relaxed">
                انقر على أي تصميم لتطبيقه كخلفية رسمية لسطح المكتب فوراً
              </p>
            </div>
          </div>

          {/* Wallpapers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STATIC_WALLPAPERS.map((wallpaper) => {
              const isSelected = bg.staticImage === wallpaper.url;
              return (
                <div
                  key={wallpaper.id}
                  onClick={() =>
                    handleSelectWallpaper(wallpaper.url, wallpaper.name)
                  }
                  className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "border-[#DFCA9F] ring-2 ring-[#DFCA9F]/40 shadow-xl shadow-[#DFCA9F]/10 scale-[1.02]"
                      : "border-white/10 hover:border-white/30 hover:scale-[1.01]"
                  }`}
                >
                  <div className="aspect-video w-full overflow-hidden bg-[#1A1916] relative">
                    <img
                      src={wallpaper.url}
                      alt={wallpaper.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Selected Checkmark Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-[#DFCA9F] text-[#141310] flex items-center justify-center shadow-lg animate-in zoom-in-75 duration-200">
                        <Check className="w-4 h-4 stroke-3" />
                      </div>
                    )}

                    {/* Title & Category at bottom */}
                    <div className="absolute bottom-3 inset-x-3 text-right">
                      <span className="text-[10px] text-[#DFCA9F] font-medium tracking-wide">
                        {wallpaper.category}
                      </span>
                      <h4 className="text-xs font-bold text-white drop-shadow-md truncate">
                        {wallpaper.name}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dim Overlay Slider */}
          <div className="p-4 rounded-2xl bg-[#171614] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SunMedium className="w-4 h-4 text-[#DFCA9F]" />
                <span className="text-xs font-semibold text-[#F8F4EC]">
                  تعتيم طبقة الخلفية (Darkening Overlay)
                </span>
              </div>
              <span className="text-xs font-mono text-[#DFCA9F]">
                {bg.overlayDim}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              value={bg.overlayDim}
              onChange={(e) =>
                updateAppSettings({
                  background: {
                    ...bg,
                    overlayDim: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-[#DFCA9F] cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
            <p className="text-[11px] text-[#9E988F] mt-2 leading-relaxed">
              يساعد التعتيم الإضافي على زيادة وضوح نصوص الأيقونات والنوافذ على
              سطح المكتب.
            </p>
          </div>
        </motion.div>
      )}

      {/* SECTION 2: INTERACTIVE BACKGROUND WITH COLOR MODIFIERS */}
      {bg.mode === "interactive" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Section: Gradient Combination Color Modifiers */}
          <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#DFCA9F]" />
                  <span>
                    معدِّلات الألوان التفاعلية (Gradient Color Modifiers)
                  </span>
                </h3>
                <p className="text-xs text-[#9E988F] mt-2.5 leading-relaxed">
                  انقر على أي معدل لون لتغيير درجات وتناغم ألوان الخلفية الحية
                  فوراً
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetInteractive}
                className="flex items-center gap-1.5 text-xs text-[#9E988F] hover:text-[#DFCA9F] px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الافتراضي</span>
              </button>
            </div>

            {/* 4 Interactive Color Swatch Modifiers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {bg.interactiveColors.map((color, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#1F1E1B] border border-white/10 hover:border-[#DFCA9F]/50 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#9E988F] font-medium">
                      الطبقة {idx + 1}
                    </span>
                    <span className="font-mono text-[11px] text-[#DFCA9F] uppercase">
                      {color}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Native color picker input masked as luxury circle button */}
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-inner shrink-0 cursor-pointer">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        className="absolute -inset-2 w-14 h-14 cursor-pointer opacity-0"
                      />
                      <div
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>

                    {/* Hex text input */}
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorChange(idx, e.target.value)}
                      className="w-full px-2.5 py-1 text-xs font-mono bg-[#141311] border border-white/10 rounded-lg text-white text-center focus:outline-none focus:ring-1 focus:ring-[#DFCA9F]"
                      maxLength={7}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preset Palettes */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#DFCA9F]" />
                  <span>مجموعات التدرجات الجاهزة (Combination Presets)</span>
                </h3>
                <p className="text-xs text-[#9E988F] mt-2 leading-relaxed">
                  اختر قالباً متناسقاً بلمسة واحدة
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GRADIENT_PRESETS.map((preset) => {
                const isActive =
                  JSON.stringify(preset.colors) ===
                  JSON.stringify(bg.interactiveColors);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col gap-2 ${
                      isActive
                        ? "border-[#DFCA9F] bg-[#DFCA9F]/10 ring-1 ring-[#DFCA9F]"
                        : "border-white/10 bg-[#171614] hover:border-white/25 hover:bg-[#1C1B18]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-[#F8F4EC]">
                        {preset.name}
                      </span>
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-[#DFCA9F]" />
                      )}
                    </div>

                    {/* Gradient color preview bar */}
                    <div
                      className="h-4 w-full rounded-md shadow-inner border border-white/10"
                      style={{
                        background: `linear-gradient(to right, ${preset.colors.join(", ")})`,
                      }}
                    />

                    <p className="text-[11px] text-[#9E988F] line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shader Dynamics Modifiers (Speed, Distortion, Swirl) */}
          <div className="p-5 rounded-2xl bg-[#171614] border border-white/10 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[#F8F4EC] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#DFCA9F]" />
                <span>ديناميكية وتدفق الحركة (Motion Dynamics)</span>
              </h3>
              <p className="text-xs text-[#9E988F] mt-2 leading-relaxed">
                تحكم في سرعة تدفق وانحناء السوائل الشبكية للخلفية الحية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Speed Slider */}
              <div className="space-y-2 p-3 rounded-xl bg-[#1F1E1B] border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9E988F]">سرعة التدفق (Speed)</span>
                  <span className="font-mono text-[#DFCA9F]">
                    {bg.interactiveSpeed.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={1.0}
                  step={0.05}
                  value={bg.interactiveSpeed}
                  onChange={(e) =>
                    updateAppSettings({
                      background: {
                        ...bg,
                        interactiveSpeed: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-[#DFCA9F] cursor-pointer h-1 bg-white/10 rounded-lg"
                />
              </div>

              {/* Distortion Slider */}
              <div className="space-y-2 p-3 rounded-xl bg-[#1F1E1B] border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9E988F]">
                    الانحناء والتموج (Distortion)
                  </span>
                  <span className="font-mono text-[#DFCA9F]">
                    {bg.interactiveDistortion.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={1.8}
                  step={0.1}
                  value={bg.interactiveDistortion}
                  onChange={(e) =>
                    updateAppSettings({
                      background: {
                        ...bg,
                        interactiveDistortion: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-[#DFCA9F] cursor-pointer h-1 bg-white/10 rounded-lg"
                />
              </div>

              {/* Swirl Slider */}
              <div className="space-y-2 p-3 rounded-xl bg-[#1F1E1B] border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#9E988F]">دوران الدوامة (Swirl)</span>
                  <span className="font-mono text-[#DFCA9F]">
                    {bg.interactiveSwirl.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.5}
                  step={0.05}
                  value={bg.interactiveSwirl}
                  onChange={(e) =>
                    updateAppSettings({
                      background: {
                        ...bg,
                        interactiveSwirl: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-[#DFCA9F] cursor-pointer h-1 bg-white/10 rounded-lg"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
