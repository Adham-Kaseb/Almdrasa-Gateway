import { z } from 'zod';

export const WindowIdSchema = z.enum([
  'home',
  'about',
  'projects',
  'clients',
  'terminal',
  'notes',
  'ricode',
  'contact',
  'settings',
  'scholarship',
  'schedule',
  'curriculum',
  'meetings',
  'elimination',
  'faqs',
]);



export type WindowId = z.infer<typeof WindowIdSchema>;

export const WindowPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const WindowSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const WindowStateSchema = z.object({
  id: WindowIdSchema,
  title: z.string(),
  icon: z.string(),
  isOpen: z.boolean(),
  isMinimized: z.boolean(),
  isMaximized: z.boolean(),
  zIndex: z.number(),
  position: WindowPositionSchema,
  size: WindowSizeSchema,
});

export type WindowState = z.infer<typeof WindowStateSchema>;

export const ActivityPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  snippet: z.string(),
  timeAgo: z.string(),
  url: z.string().optional(),
  imageUrl: z.string(),
});

export type ActivityPost = z.infer<typeof ActivityPostSchema>;

export const TipItemSchema = z.object({
  id: z.string(),
  tag: z.string(),
  title: z.string(),
  description: z.string(),
  actionText: z.string(),
  actionWindowId: WindowIdSchema,
});

export type TipItem = z.infer<typeof TipItemSchema>;

export const ShortcutItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  targetWindow: WindowIdSchema,
  category: z.string().optional(),
});

export type ShortcutItem = z.infer<typeof ShortcutItemSchema>;

export const TelemetryLogSchema = z.object({
  id: z.string(),
  timeStr: z.string(),
  event: z.string(),
  type: z.enum(['key', 'cursor', 'window', 'security']),
});

export type TelemetryLog = z.infer<typeof TelemetryLogSchema>;

export const LocationNodeSchema = z.object({
  city: z.string(),
  country: z.string(),
  active: z.boolean(),
  pingMs: z.number(),
});

export type LocationNode = z.infer<typeof LocationNodeSchema>;

export const ProjectItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  summary: z.string(),
  techStack: z.array(z.string()),
  metrics: z.string(),
  year: z.string(),
  status: z.enum(['Active', 'Shipped', 'Featured']),
});

export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const ExecutiveProfileSchema = z.object({
  name: z.string(),
  eyebrow: z.string(),
  primaryRole: z.string(),
  secondaryRole: z.string(),
  bioSummary: z.string(),
  credentials: z.array(z.string()),
  avatarUrl: z.string(),
  linkedInUrl: z.string(),
  stats: z.record(z.string(), z.string()).optional(),
});

export type ExecutiveProfile = z.infer<typeof ExecutiveProfileSchema>;

export const DesktopFolderFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.string(),
  date: z.string(),
  content: z.string().optional(),
});

export type DesktopFolderFile = z.infer<typeof DesktopFolderFileSchema>;

export const DesktopItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['folder', 'shortcut']),
  targetWindowId: WindowIdSchema.optional(),
  url: z.string().optional(),
  icon: z.string().optional(),
  bgClass: z.string().optional(),
  files: z.array(DesktopFolderFileSchema).optional(),
});

export type DesktopItem = z.infer<typeof DesktopItemSchema>;

export const BackgroundSettingsSchema = z.object({
  mode: z.enum(['static', 'interactive']),
  staticImage: z.string(),
  overlayDim: z.number().min(0).max(100).default(30),
  interactiveColors: z.array(z.string()).default(['#000000', '#1a1a1a', '#2e2e2e', '#ffffff']),
  interactiveSpeed: z.number().min(0.05).max(1.5).default(0.3),
  interactiveDistortion: z.number().min(0.1).max(2).default(0.8),
  interactiveSwirl: z.number().min(0.05).max(1).default(0.15),
});

export type BackgroundSettings = z.infer<typeof BackgroundSettingsSchema>;

export const AudioSettingsSchema = z.object({
  soundEnabled: z.boolean().default(true),
  typingSoundEnabled: z.boolean().default(true),
  volume: z.number().min(0).max(100).default(80),
  theme: z.enum(['luxury', 'cyber', 'minimal']).default('luxury'),
});

export type AudioSettings = z.infer<typeof AudioSettingsSchema>;

export const DOCK_THEME_PRESET_IDS = [
  'luxury_gold',
  'cosmic_violet',
  'signal_blue',
  'emerald_forest',
  'ruby_crimson',
  'sunset_amber',
  'monochrome',
  'custom',
] as const;

export type DockThemePresetId = (typeof DOCK_THEME_PRESET_IDS)[number];

export const DockThemeSchema = z.object({
  preset: z.enum(DOCK_THEME_PRESET_IDS).default('luxury_gold'),
  customIconColor: z.string().default('#DFCA9F'),
  customBgColor: z.string().default('#1C1B18'),
  customBorderColor: z.string().default('#DFCA9F'),
});

export type DockTheme = z.infer<typeof DockThemeSchema>;

export const DockSettingsSchema = z.object({
  size: z.enum(['compact', 'normal', 'large']).default('normal'),
  autoHide: z.boolean().default(true),
  showIndicators: z.boolean().default(true),
  theme: DockThemeSchema.default({
    preset: 'luxury_gold',
    customIconColor: '#DFCA9F',
    customBgColor: '#1C1B18',
    customBorderColor: '#DFCA9F',
  }),
});

export type DockSettings = z.infer<typeof DockSettingsSchema>;

export const CompanionSettingsSchema = z.object({
  botVisible: z.boolean().default(true),
  tipsFrequency: z.enum(['high', 'medium', 'low']).default('medium'),
  responseTone: z.enum(['concise', 'detailed', 'academic']).default('detailed'),
});

export type CompanionSettings = z.infer<typeof CompanionSettingsSchema>;

export const FocusSettingsSchema = z.object({
  focusModeEnabled: z.boolean().default(false),
  clockFormat24h: z.boolean().default(false),
  showDeadlineCountdown: z.boolean().default(true),
});

export type FocusSettings = z.infer<typeof FocusSettingsSchema>;

export const AppSettingsSchema = z.object({
  background: BackgroundSettingsSchema,
  audio: AudioSettingsSchema,
  dock: DockSettingsSchema,
  companion: CompanionSettingsSchema,
  focus: FocusSettingsSchema,
});

export type AppSettings = z.infer<typeof AppSettingsSchema>;

export const DEFAULT_APP_SETTINGS: AppSettings = {
  background: {
    mode: 'static',
    staticImage: '/wallpapers/minimal_dark.jpg',
    overlayDim: 30,
    interactiveColors: ['#000000', '#1a1a1a', '#2e2e2e', '#ffffff'],
    interactiveSpeed: 0.3,
    interactiveDistortion: 0.8,
    interactiveSwirl: 0.15,
  },
  audio: {
    soundEnabled: true,
    typingSoundEnabled: true,
    volume: 80,
    theme: 'luxury',
  },
  dock: {
    size: 'normal',
    autoHide: true,
    showIndicators: true,
    theme: {
      preset: 'luxury_gold',
      customIconColor: '#DFCA9F',
      customBgColor: '#1C1B18',
      customBorderColor: '#DFCA9F',
    },
  },
  companion: {
    botVisible: true,
    tipsFrequency: 'medium',
    responseTone: 'detailed',
  },
  focus: {
    focusModeEnabled: false,
    clockFormat24h: false,
    showDeadlineCountdown: true,
  },
};

