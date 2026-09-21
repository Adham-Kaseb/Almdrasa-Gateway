import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  AppSettings,
  AppSettingsSchema,
  DEFAULT_APP_SETTINGS,
  DesktopFolderFile,
  DesktopItem,
  ExecutiveProfile,
  LocationNode,
  TelemetryLog,
  WindowId,
  WindowState,
} from "../types/os";
import {
  INITIAL_DESKTOP_ITEMS,
  INITIAL_LOCATION_NODES,
  INITIAL_PROFILE,
  INITIAL_WINDOWS,
} from "../data/osData";
import { soundFx } from "../utils/audio";

interface OSContextType {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  closeActiveWindow: () => void;
  minimizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  toggleMaximizeWindow: (id: WindowId) => void;
  bringToFront: (id: WindowId) => void;
  updatePosition: (id: WindowId, pos: { x: number; y: number }) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  residentModalOpen: boolean;
  setResidentModalOpen: (open: boolean) => void;
  isMuted: boolean;
  toggleMute: () => void;
  companionMessage: string;
  setCompanionMessage: (msg: string) => void;
  telemetryLogs: TelemetryLog[];
  locationNodes: LocationNode[];
  activeTipIndex: number;
  setActiveTipIndex: (index: number | ((prev: number) => number)) => void;
  profile: ExecutiveProfile;
  selectedDesktopIcon: string | null;
  setSelectedDesktopIcon: (id: string | null) => void;
  desktopItems: DesktopItem[];
  addDesktopFolder: (
    title?: string,
    autoOpen?: boolean,
    bgClass?: string,
  ) => DesktopItem;
  addDesktopShortcut: (shortcut: {
    title: string;
    targetWindowId?: WindowId;
    url?: string;
    bgClass?: string;
    icon?: string;
  }) => void;
  removeDesktopItem: (id: string) => void;
  renameDesktopItem: (id: string, newTitle: string) => void;
  resetDesktopItems: () => void;
  activeFolderId: string | null;
  setActiveFolderId: (id: string | null) => void;
  addFileToFolder: (
    folderId: string,
    fileName: string,
    content?: string,
  ) => void;
  appSettings: AppSettings;
  updateAppSettings: (
    updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings),
  ) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const OSContext = createContext<OSContextType | null>(null);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(
    INITIAL_WINDOWS as Record<WindowId, WindowState>,
  );
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>(null);
  const [, setMaxZIndex] = useState<number>(30);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [residentModalOpen, setResidentModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [companionMessage, setCompanionMessage] = useState<string>(
    "مرحباً بك! تحدث معي للتعرف على بوابة Almdrasa Gateway",
  );
  const [activeTipIndex, setActiveTipIndex] = useState<number>(0);
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<string | null>(
    null,
  );
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(
    INITIAL_DESKTOP_ITEMS,
  );
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [profile] = useState<ExecutiveProfile>(INITIAL_PROFILE);
  const [locationNodes] = useState<LocationNode[]>(INITIAL_LOCATION_NODES);

  // App Settings state with localStorage persistence
  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_APP_SETTINGS;
    try {
      const raw = localStorage.getItem("almdrasa_gateway_app_settings");
      if (!raw) return DEFAULT_APP_SETTINGS;
      const parsed = JSON.parse(raw);
      const res = AppSettingsSchema.safeParse(parsed);
      if (res.success) {
        // Ensure autoHide is active and always active as requested
        const activeDockSettings: AppSettings = {
          ...res.data,
          dock: {
            ...res.data.dock,
            autoHide: true,
          },
        };
        try {
          localStorage.setItem("almdrasa_gateway_app_settings", JSON.stringify(activeDockSettings));
        } catch {
          // ignore
        }
        return activeDockSettings;
      }
      return DEFAULT_APP_SETTINGS;
    } catch {
      return DEFAULT_APP_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const updateAppSettings = useCallback(
    (updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
      setAppSettings((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        try {
          localStorage.setItem("almdrasa_gateway_app_settings", JSON.stringify(next));
        } catch {
          // Graceful fallback for storage restrictions
        }
        return next;
      });
    },
    [],
  );

  // Live telemetry stream simulator matching the screenshot
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([
    { id: "1", timeStr: "13:38:01", event: "التبويب مخفي", type: "security" },
    { id: "2", timeStr: "13:38:10", event: "خمول المستخدم", type: "security" },
    { id: "3", timeStr: "13:43:02", event: "التبويب نشط", type: "security" },
    { id: "4", timeStr: "13:43:03", event: "مؤشر + 726, 14", type: "cursor" },
    { id: "5", timeStr: "13:43:04", event: "مؤشر + 1194, 366", type: "cursor" },
  ]);

  const bringToFront = useCallback((id: WindowId) => {
    setMaxZIndex((prev) => {
      // Keep window z-index strictly above desktop widgets (z-10) with progressive layering
      const nextZ = prev >= 100 ? 30 : prev + 1;
      setWindows((prevWindows) => {
        const target = prevWindows[id];
        if (!target) return prevWindows;
        return {
          ...prevWindows,
          [id]: {
            ...target,
            zIndex: nextZ,
            isMinimized: false,
          },
        };
      });
      setActiveWindowId(id);
      return nextZ;
    });
  }, []);

  const openWindow = useCallback(
    (id: WindowId) => {
      soundFx.playWindow();
      if (id === "settings") {
        setIsSettingsOpen(true);
      }
      setWindows((prev) => {
        const target = prev[id];
        if (!target) return prev;
        return {
          ...prev,
          [id]: {
            ...target,
            isOpen: true,
            isMinimized: false,
          },
        };
      });
      bringToFront(id);
    },
    [bringToFront],
  );

  const closeWindow = useCallback((id: WindowId) => {
    soundFx.playClick(280, 0.04);
    if (id === "settings") {
      setIsSettingsOpen(false);
    }
    setWindows((prev) => {
      const target = prev[id];
      if (!target) return prev;
      const updated = {
        ...prev,
        [id]: {
          ...target,
          isOpen: false,
        },
      };

      // If the closed window was active, promote the top remaining open window
      const remainingOpen = Object.values(updated).filter(
        (w) => w.isOpen && !w.isMinimized,
      );
      if (remainingOpen.length > 0) {
        remainingOpen.sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(remainingOpen[0].id);
      } else {
        setActiveWindowId(null);
      }

      return updated;
    });
  }, []);

  const closeActiveWindow = useCallback(() => {
    if (residentModalOpen) {
      setResidentModalOpen(false);
      return;
    }

    setWindows((prev) => {
      let targetId: WindowId | null = null;
      if (
        activeWindowId &&
        prev[activeWindowId]?.isOpen &&
        !prev[activeWindowId]?.isMinimized
      ) {
        targetId = activeWindowId;
      } else {
        const openWindows = Object.values(prev).filter(
          (w) => w.isOpen && !w.isMinimized,
        );
        if (openWindows.length > 0) {
          openWindows.sort((a, b) => b.zIndex - a.zIndex);
          targetId = openWindows[0].id;
        }
      }

      if (!targetId) return prev;

      soundFx.playClick(280, 0.04);

      const updated = {
        ...prev,
        [targetId]: {
          ...prev[targetId],
          isOpen: false,
        },
      };

      const remainingOpen = Object.values(updated).filter(
        (w) => w.isOpen && !w.isMinimized,
      );
      if (remainingOpen.length > 0) {
        remainingOpen.sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(remainingOpen[0].id);
      } else {
        setActiveWindowId(null);
      }

      return updated;
    });
  }, [activeWindowId, residentModalOpen]);

  const minimizeWindow = useCallback(
    (id: WindowId) => {
      soundFx.playClick(360, 0.03);
      setWindows((prev) => {
        const target = prev[id];
        if (!target) return prev;
        return {
          ...prev,
          [id]: {
            ...target,
            isMinimized: true,
          },
        };
      });
      if (activeWindowId === id) {
        setActiveWindowId(null);
      }
    },
    [activeWindowId],
  );

  const restoreWindow = useCallback(
    (id: WindowId) => {
      soundFx.playDock();
      setWindows((prev) => {
        const target = prev[id];
        if (!target) return prev;
        return {
          ...prev,
          [id]: {
            ...target,
            isOpen: true,
            isMinimized: false,
          },
        };
      });
      bringToFront(id);
    },
    [bringToFront],
  );

  const toggleMaximizeWindow = useCallback(
    (id: WindowId) => {
      soundFx.playClick(400, 0.04);
      setWindows((prev) => {
        const target = prev[id];
        if (!target) return prev;
        return {
          ...prev,
          [id]: {
            ...target,
            isMaximized: !target.isMaximized,
          },
        };
      });
      bringToFront(id);
    },
    [bringToFront],
  );

  const updatePosition = useCallback(
    (id: WindowId, pos: { x: number; y: number }) => {
      setWindows((prev) => {
        const target = prev[id];
        if (!target) return prev;
        return {
          ...prev,
          [id]: {
            ...target,
            position: pos,
          },
        };
      });
    },
    [],
  );

  const toggleMute = useCallback(() => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  }, []);

  const addDesktopFolder = useCallback(
    (title?: string, autoOpen: boolean = false, bgClass?: string) => {
      soundFx.playPop();
      const folderCount =
        desktopItems.filter((i) => i.type === "folder").length + 1;
      const folderTitle = title?.trim() || `مجلد جديد ${folderCount}`;
      const newFolder: DesktopItem = {
        id: `folder-${Date.now()}`,
        title: folderTitle,
        type: "folder",
        bgClass: bgClass || "bg-[#C5A370] text-[#191816] border-[#D9BA8B]/50",
        icon: "Folder",
        files: [
          {
            id: `f-${Date.now()}`,
            name: "ملاحظات_المشروع.md",
            size: "1.4 KB",
            date: "اليوم",
            content: "مستند أولي داخل المجلد الجديد.",
          },
        ],
      };
      setDesktopItems((prev) => [...prev, newFolder]);
      setSelectedDesktopIcon(newFolder.id);
      if (autoOpen) {
        setActiveFolderId(newFolder.id);
      }
      setCompanionMessage(
        `تمت إضافة المجلد "${folderTitle}" إلى سطح المكتب بنجاح!`,
      );
      return newFolder;
    },
    [desktopItems],
  );

  const addDesktopShortcut = useCallback(
    (shortcut: {
      title: string;
      targetWindowId?: WindowId;
      url?: string;
      bgClass?: string;
      icon?: string;
    }) => {
      soundFx.playPop();
      const newShortcut: DesktopItem = {
        id: `shortcut-${Date.now()}`,
        title: shortcut.title,
        type: "shortcut",
        targetWindowId: shortcut.targetWindowId,
        url: shortcut.url,
        bgClass:
          shortcut.bgClass || "bg-[#292724] text-[#F8F4EC] border-white/12",
        icon: shortcut.icon || "Sparkles",
      };
      setDesktopItems((prev) => [...prev, newShortcut]);
      setSelectedDesktopIcon(newShortcut.id);
    },
    [],
  );

  const removeDesktopItem = useCallback((id: string) => {
    soundFx.playClick(260, 0.03);
    setDesktopItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedDesktopIcon((prev) => (prev === id ? null : prev));
    setActiveFolderId((prev) => (prev === id ? null : prev));
  }, []);

  const renameDesktopItem = useCallback((id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setDesktopItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: newTitle.trim() } : item,
      ),
    );
  }, []);

  const resetDesktopItems = useCallback(() => {
    soundFx.playPop();
    setDesktopItems(INITIAL_DESKTOP_ITEMS);
    setSelectedDesktopIcon("dt-home");
    setActiveFolderId(null);
  }, []);

  const addFileToFolder = useCallback(
    (folderId: string, fileName: string, content?: string) => {
      soundFx.playClick();
      const newFile: DesktopFolderFile = {
        id: `file-${Date.now()}`,
        name: fileName.trim() || "ملف_جديد.txt",
        size: "0.9 KB",
        date: "الآن",
        content: content || "",
      };
      setDesktopItems((prev) =>
        prev.map((item) => {
          if (item.id === folderId && item.type === "folder") {
            return {
              ...item,
              files: [...(item.files || []), newFile],
            };
          }
          return item;
        }),
      );
    },
    [],
  );

  // Real-time browser lifecycle & telemetry logging
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const getTimeStr = () => {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    };

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setTelemetryLogs((prev) => [
          ...prev.slice(-8),
          {
            id: Math.random().toString(36).substring(2, 9),
            timeStr: getTimeStr(),
            event: "خمول المستخدم",
            type: "security",
          },
        ]);
      }, 5000);
    };

    const handleVisibility = () => {
      const state = document.visibilityState;
      setTelemetryLogs((prev) => [
        ...prev.slice(-8),
        {
          id: Math.random().toString(36).substring(2, 9),
          timeStr: getTimeStr(),
          event: state === "hidden" ? "التبويب مخفي" : "التبويب نشط",
          type: "security",
        },
      ]);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      resetIdleTimer();

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
        soundFx.playPop();
        return;
      }

      setTelemetryLogs((prev) => [
        ...prev.slice(-8),
        {
          id: Math.random().toString(36).substring(2, 9),
          timeStr: getTimeStr(),
          event: `ضغط مفتاح [${e.key.length === 1 ? e.key.toUpperCase() : e.key}]`,
          type: "key",
        },
      ]);
    };

    let lastCursorTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      resetIdleTimer();
      const now = Date.now();
      if (now - lastCursorTime > 5000) {
        lastCursorTime = now;
        setTelemetryLogs((prev) => [
          ...prev.slice(-8),
          {
            id: Math.random().toString(36).substring(2, 9),
            timeStr: getTimeStr(),
            event: `مؤشر + ${e.clientX}, ${e.clientY}`,
            type: "cursor",
          },
        ]);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseMove);
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Global shortcut: Escape key closes the active / top open window or modal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false);
          return;
        }
        closeActiveWindow();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [closeActiveWindow, commandPaletteOpen]);

  return (
    <OSContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        closeActiveWindow,
        minimizeWindow,
        restoreWindow,
        toggleMaximizeWindow,
        bringToFront,
        updatePosition,
        commandPaletteOpen,
        setCommandPaletteOpen,
        residentModalOpen,
        setResidentModalOpen,
        isMuted,
        toggleMute,
        companionMessage,
        setCompanionMessage,
        telemetryLogs,
        locationNodes,
        activeTipIndex,
        setActiveTipIndex,
        profile,
        selectedDesktopIcon,
        setSelectedDesktopIcon,
        desktopItems,
        addDesktopFolder,
        addDesktopShortcut,
        removeDesktopItem,
        renameDesktopItem,
        resetDesktopItems,
        activeFolderId,
        setActiveFolderId,
        addFileToFolder,
        appSettings,
        updateAppSettings,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = (): OSContextType => {
  const ctx = useContext(OSContext);
  if (!ctx) {
    throw new Error("useOS must be used within an OSProvider");
  }
  return ctx;
};
