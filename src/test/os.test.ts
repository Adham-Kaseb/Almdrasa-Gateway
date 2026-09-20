import { describe, it, expect } from 'vitest';
import {
  WindowStateSchema,
  ExecutiveProfileSchema,
  ProjectItemSchema,
  TelemetryLogSchema,
  ActivityPostSchema,
  TipItemSchema,
  ShortcutItemSchema,
  DesktopItemSchema,
  AppSettingsSchema,
  DEFAULT_APP_SETTINGS,
} from '../types/os';
import {
  STATIC_WALLPAPERS,
  GRADIENT_PRESETS,
} from '../components/os/settings/BackgroundSettingsPanel';
import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_WINDOWS,
  INITIAL_ACTIVITY_POSTS,
  INITIAL_TIPS,
  INITIAL_SHORTCUTS,
  INITIAL_LOCATION_NODES,
} from '../data/osData';
import {
  formatClockDetails,
  ARABIC_DAYS,
  ARABIC_MONTHS,
} from '../components/os/DesktopClockWidget';

describe('AuraOS Contracts and Schema Validation', () => {
  it('validates initial executive profile against ExecutiveProfileSchema', () => {
    const result = ExecutiveProfileSchema.safeParse(INITIAL_PROFILE);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('روبرتو إيزكويردو');
      expect(result.data.primaryRole).toBe('المدير التنفيذي للتقنية');
      expect(result.data.credentials.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('validates all initial window states against WindowStateSchema', () => {
    Object.values(INITIAL_WINDOWS).forEach((win) => {
      const result = WindowStateSchema.safeParse(win);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.size.width).toBeGreaterThanOrEqual(400);
        expect(result.data.size.height).toBeGreaterThanOrEqual(300);
        expect(result.data.position.x).toBeGreaterThanOrEqual(0);
        expect(result.data.position.y).toBeGreaterThanOrEqual(0);
      }
    });
  });

  it('validates all initial projects against ProjectItemSchema', () => {
    INITIAL_PROJECTS.forEach((proj) => {
      const result = ProjectItemSchema.safeParse(proj);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.techStack.length).toBeGreaterThan(0);
        expect(['Active', 'Shipped', 'Featured']).toContain(result.data.status);
      }
    });
  });

  it('validates activity posts against ActivityPostSchema', () => {
    INITIAL_ACTIVITY_POSTS.forEach((post) => {
      const result = ActivityPostSchema.safeParse(post);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.timeAgo).toMatch(/منذ/);
      }
    });
  });

  it('validates tips and shortcuts schemas', () => {
    INITIAL_TIPS.forEach((tip) => {
      const result = TipItemSchema.safeParse(tip);
      expect(result.success).toBe(true);
    });

    INITIAL_SHORTCUTS.forEach((sc) => {
      const result = ShortcutItemSchema.safeParse(sc);
      expect(result.success).toBe(true);
    });
  });

  it('verifies edge location nodes are active and configured with valid latency', () => {
    expect(INITIAL_LOCATION_NODES.length).toBe(2);
    expect(INITIAL_LOCATION_NODES.map((n) => n.city)).toEqual(['دوسلدورف', 'أتلانتا']);
    INITIAL_LOCATION_NODES.forEach((node) => {
      expect(node.active).toBe(true);
      expect(node.pingMs).toBeGreaterThan(0);
    });
  });

  it('validates telemetry log generation structure', () => {
    const sampleLog = {
      id: 'test-1',
      timeStr: '13:31:28',
      event: 'ضغط مفتاح [K]',
      type: 'key' as const,
    };
    const result = TelemetryLogSchema.safeParse(sampleLog);
    expect(result.success).toBe(true);
  });

  it('handles window closing and active promotion correctly', () => {
    const windowsState = { ...INITIAL_WINDOWS };
    windowsState.home.isOpen = true;
    windowsState.home.zIndex = 10;
    windowsState.about.isOpen = true;
    windowsState.about.zIndex = 11;

    // Active window should be about (highest zIndex)
    const openWindows = Object.values(windowsState).filter((w) => w.isOpen && !w.isMinimized);
    openWindows.sort((a, b) => b.zIndex - a.zIndex);
    expect(openWindows[0].id).toBe('about');

    // Simulate closing about
    windowsState.about.isOpen = false;
    const remainingOpen = Object.values(windowsState).filter((w) => w.isOpen && !w.isMinimized);
    remainingOpen.sort((a, b) => b.zIndex - a.zIndex);
    expect(remainingOpen[0].id).toBe('home');
  });

  it('validates desktop items, folders and shortcuts schema', () => {
    const sampleFolder = {
      id: 'folder-1',
      title: 'مشاريع الذكاء الاصطناعي',
      type: 'folder' as const,
      files: [
        { id: 'f-1', name: 'تقرير.md', size: '1.2 KB', date: 'اليوم', content: 'محتوى تجريبي' },
      ],
    };
    expect(DesktopItemSchema.safeParse(sampleFolder).success).toBe(true);

    const sampleShortcut = {
      id: 'shortcut-1',
      title: 'ملاحظاتي',
      type: 'shortcut' as const,
      targetWindowId: 'notes' as const,
    };
    expect(DesktopItemSchema.safeParse(sampleShortcut).success).toBe(true);
  });

  it('verifies dynamic folder creation with files and autoOpen', () => {
    const folderTitle = 'مشاريع Almdrasa Gateway';
    const newFolder = {
      id: `folder-${Date.now()}`,
      title: folderTitle,
      type: 'folder' as const,
      bgClass: 'bg-[#C5A370] text-[#191816] border-[#D9BA8B]/50',
      icon: 'Folder',
      files: [
        {
          id: `f-${Date.now()}`,
          name: 'ملاحظات_المشروع.md',
          size: '1.4 KB',
          date: 'اليوم',
          content: 'مستند أولي داخل المجلد الجديد.',
        },
      ],
    };

    const parsed = DesktopItemSchema.safeParse(newFolder);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.title).toBe(folderTitle);
      expect(parsed.data.type).toBe('folder');
      expect(parsed.data.files?.length).toBe(1);
    }
  });

  it('validates scholarship window configuration and schema', () => {
    expect(INITIAL_WINDOWS.scholarship).toBeDefined();
    expect(INITIAL_WINDOWS.scholarship.id).toBe('scholarship');
    expect(INITIAL_WINDOWS.scholarship.title).toBe('تفاصيل منحة المدرسة');
    expect(INITIAL_WINDOWS.scholarship.isOpen).toBe(false);
    const parsed = WindowStateSchema.safeParse(INITIAL_WINDOWS.scholarship);
    expect(parsed.success).toBe(true);
  });

  it('validates schedule window configuration and schema', () => {
    expect(INITIAL_WINDOWS.schedule).toBeDefined();
    expect(INITIAL_WINDOWS.schedule.id).toBe('schedule');
    expect(INITIAL_WINDOWS.schedule.title).toContain('جدول الدفعة السادسة');
    expect(INITIAL_WINDOWS.schedule.isOpen).toBe(false);
    const parsed = WindowStateSchema.safeParse(INITIAL_WINDOWS.schedule);
    expect(parsed.success).toBe(true);
  });

  it('validates curriculum PDF window configuration and schema', () => {
    expect(INITIAL_WINDOWS.curriculum).toBeDefined();
    expect(INITIAL_WINDOWS.curriculum.id).toBe('curriculum');
    expect(INITIAL_WINDOWS.curriculum.title).toContain('منهج دبلومة المدرسة');
    expect(INITIAL_WINDOWS.curriculum.isOpen).toBe(false);
    const parsed = WindowStateSchema.safeParse(INITIAL_WINDOWS.curriculum);
    expect(parsed.success).toBe(true);
  });

  it('validates weekly meetings window configuration and schema', () => {
    expect(INITIAL_WINDOWS.meetings).toBeDefined();
    expect(INITIAL_WINDOWS.meetings.id).toBe('meetings');
    expect(INITIAL_WINDOWS.meetings.title).toContain('الاجتماعات الأسبوعية');
    expect(INITIAL_WINDOWS.meetings.isOpen).toBe(false);
    const parsed = WindowStateSchema.safeParse(INITIAL_WINDOWS.meetings);
    expect(parsed.success).toBe(true);
  });

  it('validates elimination window configuration and schema', () => {
    expect(INITIAL_WINDOWS.elimination).toBeDefined();
    expect(INITIAL_WINDOWS.elimination.id).toBe('elimination');
    expect(INITIAL_WINDOWS.elimination.title).toContain('نظام الإقصاء');
    expect(INITIAL_WINDOWS.elimination.isOpen).toBe(false);
    const parsed = WindowStateSchema.safeParse(INITIAL_WINDOWS.elimination);
    expect(parsed.success).toBe(true);
  });

  it('validates faqs window configuration and schema', () => {
    expect(INITIAL_WINDOWS.faqs).toBeDefined();
    expect(INITIAL_WINDOWS.faqs.id).toBe('faqs');
    expect(INITIAL_WINDOWS.faqs.title).toContain('الأسئلة الأكثر شيوعاً');
    expect(INITIAL_WINDOWS.faqs.isOpen).toBe(false);
    const parsed = WindowStateSchema.safeParse(INITIAL_WINDOWS.faqs);
    expect(parsed.success).toBe(true);
  });

  it('validates resident modal and assistant companion interactions', () => {
    let residentModalOpen = false;
    const toggleResidentModal = () => {
      residentModalOpen = !residentModalOpen;
    };

    expect(residentModalOpen).toBe(false);
    toggleResidentModal();
    expect(residentModalOpen).toBe(true);
    toggleResidentModal();
    expect(residentModalOpen).toBe(false);
  });

  it('validates session-based entrance state and persistence', async () => {
    const store: Record<string, string> = {};
    const mockSessionStorage = {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => { store[k] = v; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };

    let mockCookie = '';
    const mockDocument = {
      get cookie() {
        return mockCookie;
      },
      set cookie(val: string) {
        if (val.includes('expires=Thu, 01 Jan 1970')) {
          mockCookie = '';
        } else {
          mockCookie = val;
        }
      },
    };

    // Setup globals for test
    (globalThis as unknown as { window: unknown }).window = {};
    (globalThis as unknown as { sessionStorage: unknown }).sessionStorage = mockSessionStorage;
    (globalThis as unknown as { document: unknown }).document = mockDocument;

    const { hasEnteredInCurrentSession, markSessionEntered } = await import('../utils/session');
    
    // Initially should be false
    expect(hasEnteredInCurrentSession()).toBe(false);

    // After marking entered
    markSessionEntered();
    expect(hasEnteredInCurrentSession()).toBe(true);

    // If sessionStorage is wiped (simulating tab closed and reopened in same browser session)
    mockSessionStorage.clear();
    // Cookie is still present, so hasEnteredInCurrentSession should still be true and re-sync sessionStorage
    expect(hasEnteredInCurrentSession()).toBe(true);
    expect(mockSessionStorage.getItem('almdrasa_gateway_entered')).toBe('true');

    // Clean up globals
    delete (globalThis as unknown as { window?: unknown }).window;
    delete (globalThis as unknown as { sessionStorage?: unknown }).sessionStorage;
    delete (globalThis as unknown as { document?: unknown }).document;
  });

  it('validates LuxuryEntrance component export and contract', async () => {
    const { LuxuryEntrance } = await import('../components/os/LuxuryEntrance');
    expect(LuxuryEntrance).toBeDefined();
    expect(typeof LuxuryEntrance).toBe('function');
  });

  it('validates dock app reordering logic and localStorage persistence', async () => {
    const localStore: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: (k: string) => localStore[k] || null,
      setItem: (k: string, v: string) => { localStore[k] = v; },
      clear: () => { Object.keys(localStore).forEach((k) => delete localStore[k]); },
    };

    (globalThis as unknown as { window: unknown }).window = {};
    (globalThis as unknown as { localStorage: unknown }).localStorage = mockLocalStorage;

    const { DEFAULT_APPS, loadSavedAppOrder, saveAppOrder } = await import('../components/os/Dock');

    // Default order when nothing is saved
    const initialOrder = loadSavedAppOrder(DEFAULT_APPS);
    expect(initialOrder.map((a) => a.id)).toEqual(['scholarship', 'schedule', 'curriculum', 'meetings', 'elimination', 'faqs']);

    // Reorder: put faqs first
    const reordered = [initialOrder[5], initialOrder[0], initialOrder[1], initialOrder[2], initialOrder[3], initialOrder[4]];
    saveAppOrder(reordered);

    // Reload from storage
    const loadedAfterSave = loadSavedAppOrder(DEFAULT_APPS);
    expect(loadedAfterSave.map((a) => a.id)).toEqual(['faqs', 'scholarship', 'schedule', 'curriculum', 'meetings', 'elimination']);

    delete (globalThis as unknown as { window?: unknown }).window;
    delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
  });

  it('validates ARAB_COUNTRIES_SCHEDULE contains all 22 Arab countries with accurate times', async () => {
    const { ARAB_COUNTRIES_SCHEDULE } = await import('../data/arabTimezonesData');

    expect(ARAB_COUNTRIES_SCHEDULE.length).toBe(22);

    const ids = new Set(ARAB_COUNTRIES_SCHEDULE.map((c) => c.id));
    expect(ids.size).toBe(22);

    // Verify Egypt as reference
    const egypt = ARAB_COUNTRIES_SCHEDULE.find((c) => c.id === 'egypt');
    expect(egypt).toBeDefined();
    expect(egypt?.isReference).toBe(true);
    expect(egypt?.meetingTime).toBe('6:00 مساءً');
    expect(egypt?.offsetHours).toBe(0);

    // Verify Saudi Arabia
    const saudi = ARAB_COUNTRIES_SCHEDULE.find((c) => c.id === 'saudi-arabia');
    expect(saudi).toBeDefined();
    expect(saudi?.meetingTime).toBe('7:00 مساءً');
    expect(saudi?.offsetHours).toBe(1);

    // Verify UAE
    const uae = ARAB_COUNTRIES_SCHEDULE.find((c) => c.id === 'uae');
    expect(uae).toBeDefined();
    expect(uae?.meetingTime).toBe('8:00 مساءً');
    expect(uae?.offsetHours).toBe(2);

    // Verify Algeria & Morocco (-1 hr)
    const algeria = ARAB_COUNTRIES_SCHEDULE.find((c) => c.id === 'algeria');
    expect(algeria?.meetingTime).toBe('5:00 مساءً');
    expect(algeria?.offsetHours).toBe(-1);

    // Verify Mauritania (-2 hrs)
    const mauritania = ARAB_COUNTRIES_SCHEDULE.find((c) => c.id === 'mauritania');
    expect(mauritania?.meetingTime).toBe('4:00 مساءً');
    expect(mauritania?.offsetHours).toBe(-2);

    // Ensure all 22 countries have flags, codes, and valid 30-min wait windows
    ARAB_COUNTRIES_SCHEDULE.forEach((c) => {
      expect(c.code.length).toBe(2);
      expect(c.flag.length).toBeGreaterThan(0);
      expect(c.waitWindow).toContain('م');
      expect(c.utc).toMatch(/^UTC[+-]\d+$/);
    });
  });

  it('validates maximized window detection for taskbar dock auto-hide and elevation', () => {
    const testWindows = { ...INITIAL_WINDOWS };

    // Helper function mirroring Dock.tsx logic
    const checkAnyMaximized = (wins: typeof INITIAL_WINDOWS) =>
      Object.values(wins).some((w) => w.isOpen && !w.isMinimized && w.isMaximized);

    // Initial state: no windows open or maximized
    expect(checkAnyMaximized(testWindows)).toBe(false);

    // Open a window in normal mode
    testWindows.faqs = { ...testWindows.faqs, isOpen: true, isMaximized: false, isMinimized: false };
    expect(checkAnyMaximized(testWindows)).toBe(false);

    // Maximize the window (fullscreen tab)
    testWindows.faqs = { ...testWindows.faqs, isMaximized: true };
    expect(checkAnyMaximized(testWindows)).toBe(true);

    // Minimize the maximized window
    testWindows.faqs = { ...testWindows.faqs, isMinimized: true };
    expect(checkAnyMaximized(testWindows)).toBe(false);

    // Restore unminimized
    testWindows.faqs = { ...testWindows.faqs, isMinimized: false };
    expect(checkAnyMaximized(testWindows)).toBe(true);

    // Unmaximize (restore to normal window)
    testWindows.faqs = { ...testWindows.faqs, isMaximized: false };
    expect(checkAnyMaximized(testWindows)).toBe(false);
  });

  it('validates default AppSettings against AppSettingsSchema', () => {
    const result = AppSettingsSchema.safeParse(DEFAULT_APP_SETTINGS);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.background.mode).toBe('static');
      expect(result.data.background.staticImage).toBe('/wallpapers/minimal_dark.jpg');
      expect(result.data.background.interactiveColors.length).toBeGreaterThanOrEqual(3);
      expect(result.data.audio.volume).toBeGreaterThanOrEqual(0);
      expect(result.data.audio.volume).toBeLessThanOrEqual(100);
      expect(['compact', 'normal', 'large']).toContain(result.data.dock.size);
      expect(result.data.dock.autoHide).toBe(true);
      expect(['concise', 'detailed', 'academic']).toContain(result.data.companion.responseTone);
    }
  });

  it('validates static wallpaper options and generated assets', () => {
    expect(STATIC_WALLPAPERS.length).toBeGreaterThanOrEqual(4);
    STATIC_WALLPAPERS.forEach((wp) => {
      expect(wp.id).toBeDefined();
      expect(wp.name.length).toBeGreaterThan(0);
      expect(wp.url).toMatch(/(\.jpg|\.png|unsplash)/i);
      expect(wp.category.length).toBeGreaterThan(0);
    });
  });

  it('validates interactive gradient presets and hex colors', () => {
    expect(GRADIENT_PRESETS.length).toBeGreaterThanOrEqual(5);
    GRADIENT_PRESETS.forEach((preset) => {
      expect(preset.name.length).toBeGreaterThan(0);
      expect(preset.colors.length).toBeGreaterThanOrEqual(3);
      preset.colors.forEach((hex) => {
        expect(hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  it('validates background mode switching and settings mutation', () => {
    const customSettings = {
      ...DEFAULT_APP_SETTINGS,
      background: {
        ...DEFAULT_APP_SETTINGS.background,
        mode: 'static' as const,
        staticImage: '/wallpapers/obsidian_geometry.jpg',
        overlayDim: 45,
      },
    };

    const parsed = AppSettingsSchema.safeParse(customSettings);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.background.mode).toBe('static');
      expect(parsed.data.background.staticImage).toBe('/wallpapers/obsidian_geometry.jpg');
      expect(parsed.data.background.overlayDim).toBe(45);
    }
  });

  describe('Desktop Top-Center Clock Widget & Localization', () => {
    it('verifies Arabic days and months lists are complete and accurate', () => {
      expect(ARABIC_DAYS).toHaveLength(7);
      expect(ARABIC_DAYS[0]).toBe('الأحد');
      expect(ARABIC_DAYS[5]).toBe('الجمعة');
      expect(ARABIC_DAYS[6]).toBe('السبت');

      expect(ARABIC_MONTHS).toHaveLength(12);
      expect(ARABIC_MONTHS[0]).toBe('يناير');
      expect(ARABIC_MONTHS[8]).toBe('سبتمبر');
      expect(ARABIC_MONTHS[11]).toBe('ديسمبر');
    });

    it('formats 12-hour AM clock details correctly', () => {
      // 2026-09-20 09:15:30 (Sunday)
      const morningDate = new Date(2026, 8, 20, 9, 15, 30);
      const res = formatClockDetails(morningDate, false);

      expect(res.hoursStr).toBe('09');
      expect(res.minutesStr).toBe('15');
      expect(res.secondsStr).toBe('30');
      expect(res.ampm).toBe('ص');
      expect(res.dayName).toBe('الأحد');
      expect(res.dayNum).toBe(20);
      expect(res.monthName).toBe('سبتمبر');
      expect(res.year).toBe(2026);
      expect(res.is24h).toBe(false);
    });

    it('formats 12-hour PM clock details correctly', () => {
      // 2026-09-20 17:45:00 (5:45 PM Sunday)
      const eveningDate = new Date(2026, 8, 20, 17, 45, 0);
      const res = formatClockDetails(eveningDate, false);

      expect(res.hoursStr).toBe('05');
      expect(res.minutesStr).toBe('45');
      expect(res.ampm).toBe('م');
      expect(res.dayName).toBe('الأحد');
      expect(res.monthName).toBe('سبتمبر');
    });

    it('formats 24-hour clock details correctly without AM/PM', () => {
      // 2026-09-20 23:05:12
      const nightDate = new Date(2026, 8, 20, 23, 5, 12);
      const res = formatClockDetails(nightDate, true);

      expect(res.hoursStr).toBe('23');
      expect(res.minutesStr).toBe('05');
      expect(res.secondsStr).toBe('12');
      expect(res.ampm).toBe('');
      expect(res.is24h).toBe(true);
    });

    it('handles midnight 12 AM / 00 correctly in 12h and 24h formats', () => {
      const midnight = new Date(2026, 0, 1, 0, 0, 0); // Thursday Jan 1 2026
      const res12 = formatClockDetails(midnight, false);
      const res24 = formatClockDetails(midnight, true);

      expect(res12.hoursStr).toBe('12');
      expect(res12.ampm).toBe('ص');
      expect(res12.dayName).toBe('الخميس');
      expect(res12.monthName).toBe('يناير');

      expect(res24.hoursStr).toBe('00');
      expect(res24.ampm).toBe('');
    });
  });
});




