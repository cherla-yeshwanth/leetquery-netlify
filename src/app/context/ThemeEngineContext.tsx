import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  active: boolean;
  testUsers?: string[]; // Email addresses for A/B testing
  
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    cta: string;
    bgBase: string;
    bgCard: string;
    bgElevated: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    streak: string;
    xp: string;
  };
  
  // Branding
  branding: {
    logo: string;
    logoText: string;
    tagline: string;
    favicon?: string;
  };
  
  // Background (optional)
  background?: {
    type: "solid" | "gradient" | "image" | "pattern";
    value: string; // CSS value or image URL
    overlay?: string; // Optional overlay color
    opacity?: number;
  };
  
  // Typography (optional)
  typography?: {
    fontFamily: string;
    fontSize: {
      small: string;
      base: string;
      large: string;
      xlarge: string;
    };
  };
  
  // Spacing & Borders (optional)
  design?: {
    borderRadius: string;
    cardShadow: string;
    buttonStyle: "rounded" | "sharp" | "pill";
  };
  
  // Special Effects
  effects?: {
    particles?: boolean;
    animations?: "subtle" | "moderate" | "enhanced";
    backgroundPattern?: string; // URL or pattern name
  };
}

interface ThemeEngineContextType {
  currentTheme: ThemeConfig;
  allThemes: ThemeConfig[];
  updateTheme: (themeId: string, updates: Partial<ThemeConfig>) => void;
  activateTheme: (themeId: string, testUsers?: string[]) => void;
  createTheme: (theme: ThemeConfig) => void;
  deleteTheme: (themeId: string) => void;
  getUserTheme: (userEmail: string) => ThemeConfig;
  isAdmin: boolean;
}

// Default Theme
const defaultTheme: ThemeConfig = {
  id: "default",
  name: "Default Dark",
  description: "Original LeetQuery dark theme",
  active: true,
  colors: {
    primary: "#00D4AA",
    secondary: "#6C5CE7",
    accent: "#FFB088",
    cta: "#FFB088",
    bgBase: "#0A0E1A",
    bgCard: "#121829",
    bgElevated: "#1A2037",
    textPrimary: "#E5E9F0",
    textSecondary: "#9BA5BC",
    textMuted: "#6B7899",
    border: "#2A3147",
    success: "#00D4AA",
    warning: "#FFB800",
    error: "#FF4757",
    streak: "#FF6B6B",
    xp: "#FFD93D",
  },
  branding: {
    logo: "🎯",
    logoText: "LeetQuery",
    tagline: "Master SQL, One Query at a Time",
  },
  background: {
    type: "solid",
    value: "#0A0E1A",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      small: "14px",
      base: "16px",
      large: "20px",
      xlarge: "32px",
    },
  },
  design: {
    borderRadius: "16px",
    cardShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    buttonStyle: "rounded",
  },
};

// Diwali Theme
const diwaliTheme: ThemeConfig = {
  id: "diwali",
  name: "Diwali Festival",
  description: "Celebrate Diwali with warm colors and festive vibes",
  active: false,
  colors: {
    primary: "#FF6B35",
    secondary: "#F7931E",
    accent: "#FFD93D",
    cta: "#FF6B35",
    bgBase: "#1A0F0A",
    bgCard: "#2D1810",
    bgElevated: "#3D2418",
    textPrimary: "#FFF4E6",
    textSecondary: "#FFD7B5",
    textMuted: "#C19A6B",
    border: "#5D3A1A",
    success: "#FFD93D",
    warning: "#F7931E",
    error: "#FF4757",
    streak: "#FF6B35",
    xp: "#FFD93D",
  },
  branding: {
    logo: "🪔",
    logoText: "LeetQuery",
    tagline: "Light Up Your SQL Skills This Diwali! ✨",
  },
  background: {
    type: "gradient",
    value: "linear-gradient(135deg, #1A0F0A 0%, #2D1810 50%, #1A0F0A 100%)",
    overlay: "rgba(255, 107, 53, 0.05)",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      small: "14px",
      base: "16px",
      large: "20px",
      xlarge: "32px",
    },
  },
  design: {
    borderRadius: "20px",
    cardShadow: "0 8px 16px rgba(255, 107, 53, 0.2)",
    buttonStyle: "rounded",
  },
  effects: {
    particles: true,
    animations: "enhanced",
    backgroundPattern: "diyas",
  },
};

// Christmas Theme
const christmasTheme: ThemeConfig = {
  id: "christmas",
  name: "Christmas Joy",
  description: "Festive red and green theme for the holidays",
  active: false,
  colors: {
    primary: "#C41E3A",
    secondary: "#0F8B4F",
    accent: "#FFD700",
    cta: "#C41E3A",
    bgBase: "#0A1612",
    bgCard: "#1A2520",
    bgElevated: "#243830",
    textPrimary: "#FFFFFF",
    textSecondary: "#D4E8DC",
    textMuted: "#8FB5A0",
    border: "#2D4B3E",
    success: "#0F8B4F",
    warning: "#FFD700",
    error: "#C41E3A",
    streak: "#C41E3A",
    xp: "#FFD700",
  },
  branding: {
    logo: "🎄",
    logoText: "LeetQuery",
    tagline: "Code Your Way to a Merry Christmas! 🎅",
  },
  background: {
    type: "gradient",
    value: "linear-gradient(135deg, #0A1612 0%, #1A2520 50%, #0A1612 100%)",
    overlay: "rgba(196, 30, 58, 0.05)",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      small: "14px",
      base: "16px",
      large: "20px",
      xlarge: "32px",
    },
  },
  design: {
    borderRadius: "16px",
    cardShadow: "0 8px 16px rgba(196, 30, 58, 0.2)",
    buttonStyle: "rounded",
  },
  effects: {
    particles: true,
    animations: "enhanced",
    backgroundPattern: "snowflakes",
  },
};

// New Year Theme
const newYearTheme: ThemeConfig = {
  id: "newyear",
  name: "New Year 2026",
  description: "Sparkle into the new year with golden accents",
  active: false,
  colors: {
    primary: "#FFD700",
    secondary: "#9D4EDD",
    accent: "#FF006E",
    cta: "#FFD700",
    bgBase: "#0D0221",
    bgCard: "#1A0B3D",
    bgElevated: "#2B1555",
    textPrimary: "#FFFFFF",
    textSecondary: "#E0AAFF",
    textMuted: "#C77DFF",
    border: "#5A189A",
    success: "#FFD700",
    warning: "#FF006E",
    error: "#C41E3A",
    streak: "#FF006E",
    xp: "#FFD700",
  },
  branding: {
    logo: "🎊",
    logoText: "LeetQuery",
    tagline: "Query Into 2026! 🎆",
  },
  background: {
    type: "gradient",
    value: "linear-gradient(135deg, #0D0221 0%, #1A0B3D 50%, #0D0221 100%)",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      small: "14px",
      base: "16px",
      large: "20px",
      xlarge: "32px",
    },
  },
  design: {
    borderRadius: "24px",
    cardShadow: "0 8px 16px rgba(255, 215, 0, 0.2)",
    buttonStyle: "rounded",
  },
  effects: {
    particles: true,
    animations: "enhanced",
    backgroundPattern: "fireworks",
  },
};

const defaultThemes: ThemeConfig[] = [defaultTheme, diwaliTheme, christmasTheme, newYearTheme];

const ThemeEngineContext = createContext<ThemeEngineContextType | undefined>(undefined);

export function ThemeEngineProvider({ children }: { children: ReactNode }) {
  const [allThemes, setAllThemes] = useState<ThemeConfig[]>(() => {
    const savedThemes = localStorage.getItem("themeConfigs");
    if (savedThemes) {
      try {
        return JSON.parse(savedThemes);
      } catch {
        return defaultThemes;
      }
    }
    return defaultThemes;
  });

  const [isAdmin] = useState(() => localStorage.getItem("userRole") === "admin");
  const userEmail = localStorage.getItem("userEmail") || "";

  // Get the active theme for current user
  const getUserTheme = (email: string): ThemeConfig => {
    // Check if user is in any theme's test users
    const testTheme = allThemes.find(
      (theme) => theme.testUsers && theme.testUsers.includes(email)
    );
    if (testTheme) return testTheme;

    // Otherwise return the globally active theme
    return allThemes.find((theme) => theme.active) || defaultTheme;
  };

  const currentTheme = getUserTheme(userEmail);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const theme = currentTheme;

    // Apply colors
    root.style.setProperty("--color-primary", theme.colors.primary);
    root.style.setProperty("--color-secondary", theme.colors.secondary);
    root.style.setProperty("--color-accent", theme.colors.accent);
    root.style.setProperty("--color-cta", theme.colors.cta);
    root.style.setProperty("--bg-base", theme.colors.bgBase);
    root.style.setProperty("--bg-card", theme.colors.bgCard);
    root.style.setProperty("--bg-elevated", theme.colors.bgElevated);
    root.style.setProperty("--text-primary", theme.colors.textPrimary);
    root.style.setProperty("--text-secondary", theme.colors.textSecondary);
    root.style.setProperty("--text-muted", theme.colors.textMuted);
    root.style.setProperty("--color-border", theme.colors.border);
    root.style.setProperty("--color-easy", theme.colors.success);
    root.style.setProperty("--color-medium", theme.colors.warning);
    root.style.setProperty("--color-hard", theme.colors.error);
    root.style.setProperty("--color-streak", theme.colors.streak);
    root.style.setProperty("--color-xp", theme.colors.xp);

    // Apply background (with fallback)
    if (theme.background) {
      if (theme.background.type === "solid") {
        root.style.setProperty("background", theme.background.value);
      } else if (theme.background.type === "gradient") {
        root.style.setProperty("background", theme.background.value);
      }
    }

    // Apply typography (with fallback)
    if (theme.typography) {
      root.style.setProperty("font-family", theme.typography.fontFamily);
    }

    // Apply border radius (with fallback)
    if (theme.design) {
      root.style.setProperty("--border-radius", theme.design.borderRadius);
    }

    // Save current theme ID
    localStorage.setItem("currentThemeId", theme.id);
  }, [currentTheme]);

  // Save themes whenever they change
  useEffect(() => {
    localStorage.setItem("themeConfigs", JSON.stringify(allThemes));
  }, [allThemes]);

  const updateTheme = (themeId: string, updates: Partial<ThemeConfig>) => {
    setAllThemes((prev) =>
      prev.map((theme) => (theme.id === themeId ? { ...theme, ...updates } : theme))
    );
  };

  const activateTheme = (themeId: string, testUsers?: string[]) => {
    setAllThemes((prev) =>
      prev.map((theme) => {
        if (theme.id === themeId) {
          return {
            ...theme,
            active: testUsers ? false : true,
            testUsers: testUsers || undefined,
          };
        }
        // Deactivate other themes if this is global activation
        return testUsers ? theme : { ...theme, active: false };
      })
    );
  };

  const createTheme = (theme: ThemeConfig) => {
    setAllThemes((prev) => [...prev, theme]);
  };

  const deleteTheme = (themeId: string) => {
    if (themeId === "default") return; // Can't delete default
    setAllThemes((prev) => prev.filter((theme) => theme.id !== themeId));
  };

  return (
    <ThemeEngineContext.Provider
      value={{
        currentTheme,
        allThemes,
        updateTheme,
        activateTheme,
        createTheme,
        deleteTheme,
        getUserTheme,
        isAdmin,
      }}
    >
      {children}
    </ThemeEngineContext.Provider>
  );
}

export function useThemeEngine() {
  const context = useContext(ThemeEngineContext);
  if (!context) {
    throw new Error("useThemeEngine must be used within ThemeEngineProvider");
  }
  return context;
}