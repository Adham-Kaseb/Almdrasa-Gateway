import { DockTheme } from '../types/os';

export interface DockThemePreset {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
  iconColor: string;
  borderColor: string;
  borderHoverColor: string;
  bgGradient: string;
  indicatorColor: string;
  previewBg: string;
}

export const DOCK_THEME_PRESETS: DockThemePreset[] = [
  {
    id: 'luxury_gold',
    name: 'الذهب الملكي (الافتراضي)',
    nameEn: 'Luxury Champagne Gold',
    desc: 'تدرج الأوبسيديان الداكن مع بريق الذهب الشامبين الفاخر',
    iconColor: '#DFCA9F',
    borderColor: 'rgba(223, 202, 159, 0.4)',
    borderHoverColor: '#DFCA9F',
    bgGradient: 'bg-linear-to-br from-[#272522] via-[#1C1B18] to-[#12110F]',
    indicatorColor: '#DFCA9F',
    previewBg: '#1C1B18',
  },
  {
    id: 'cosmic_violet',
    name: 'البنفسجي الكوني',
    nameEn: 'Cosmic Violet',
    desc: 'تدرجات نيبولا فلكية مفعمة بالإبداع والعمق',
    iconColor: '#C084FC',
    borderColor: 'rgba(192, 132, 252, 0.4)',
    borderHoverColor: '#C084FC',
    bgGradient: 'bg-linear-to-br from-[#2D1B44] via-[#201332] to-[#140B20]',
    indicatorColor: '#C084FC',
    previewBg: '#201332',
  },
  {
    id: 'signal_blue',
    name: 'الأزرق السيبراني',
    nameEn: 'Signal Cyber Blue',
    desc: 'أزرق تقني عصري مشرق مع لمسات مستقبلية',
    iconColor: '#38BDF8',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderHoverColor: '#38BDF8',
    bgGradient: 'bg-linear-to-br from-[#142B44] via-[#0E1F32] to-[#081320]',
    indicatorColor: '#38BDF8',
    previewBg: '#0E1F32',
  },
  {
    id: 'emerald_forest',
    name: 'الزمردي الإمبراطوري',
    nameEn: 'Imperial Emerald',
    desc: 'طبيعة هادئة ولمسات زمردية ملكية مريحة للعين',
    iconColor: '#34D399',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderHoverColor: '#34D399',
    bgGradient: 'bg-linear-to-br from-[#153428] via-[#0E261D] to-[#081711]',
    indicatorColor: '#34D399',
    previewBg: '#0E261D',
  },
  {
    id: 'ruby_crimson',
    name: 'الياقوت القرمزي',
    nameEn: 'Ruby Crimson',
    desc: 'أناقة الياقوت الأحمر مع إشراقة حيوية ملفتة',
    iconColor: '#FB7185',
    borderColor: 'rgba(251, 113, 133, 0.4)',
    borderHoverColor: '#FB7185',
    bgGradient: 'bg-linear-to-br from-[#3D1820] via-[#2D1017] to-[#1B080D]',
    indicatorColor: '#FB7185',
    previewBg: '#2D1017',
  },
  {
    id: 'sunset_amber',
    name: 'الكهرماني الدافئ',
    nameEn: 'Sunset Amber',
    desc: 'توهج غروب الشمس ولمعان العسل الذهبي الدافئ',
    iconColor: '#FBBF24',
    borderColor: 'rgba(251, 191, 36, 0.4)',
    borderHoverColor: '#FBBF24',
    bgGradient: 'bg-linear-to-br from-[#3B2614] via-[#2A1B0E] to-[#1A0F07]',
    indicatorColor: '#FBBF24',
    previewBg: '#2A1B0E',
  },
  {
    id: 'monochrome',
    name: 'الأحادي المينيمال',
    nameEn: 'Monochrome Minimal',
    desc: 'أبيض وعاجي ناصع بأعلى درجات الهدوء والتركيز',
    iconColor: '#F3EFE7',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderHoverColor: '#FFFFFF',
    bgGradient: 'bg-linear-to-br from-[#2B2926] via-[#1E1D1A] to-[#131210]',
    indicatorColor: '#FFFFFF',
    previewBg: '#1E1D1A',
  },
];

export interface ResolvedDockTheme {
  bgClass: string;
  customBg?: string;
  iconColor: string;
  borderColor: string;
  borderHoverColor: string;
  indicatorColor: string;
  isCustom: boolean;
}

export function resolveDockThemeStyle(theme?: DockTheme): ResolvedDockTheme {
  const activePresetId = theme?.preset || 'luxury_gold';
  const found = DOCK_THEME_PRESETS.find((p) => p.id === activePresetId);

  if (activePresetId === 'custom' && theme) {
    return {
      bgClass: '',
      customBg: theme.customBgColor || '#1C1B18',
      iconColor: theme.customIconColor || '#DFCA9F',
      borderColor: theme.customBorderColor || '#DFCA9F',
      borderHoverColor: theme.customBorderColor || '#DFCA9F',
      indicatorColor: theme.customIconColor || '#DFCA9F',
      isCustom: true,
    };
  }

  const preset = found || DOCK_THEME_PRESETS[0];
  return {
    bgClass: preset.bgGradient,
    customBg: undefined,
    iconColor: preset.iconColor,
    borderColor: preset.borderColor,
    borderHoverColor: preset.borderHoverColor,
    indicatorColor: preset.indicatorColor,
    isCustom: false,
  };
}
