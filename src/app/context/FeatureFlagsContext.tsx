import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface FeatureFlags {
  showDailyChallenge: boolean;
  showActivityHeatmap: boolean;
  showLeaderboard: boolean;
  showAchievements: boolean;
  showStreakCounter: boolean;
  enableDarkModeToggle: boolean;
  showGuideSection: boolean;
  showPracticeMode: boolean;
  enableSQLHints: boolean;
  showXPSystem: boolean;
  enableSocialSharing: boolean;
  showModuleLocking: boolean;
  enableNotifications: boolean;
  showRecommendedProblems: boolean;
  enableAdvancedEditor: boolean;
}

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  updateFlag: (key: keyof FeatureFlags, value: boolean) => void;
  resetFlags: () => void;
  isAdmin: boolean;
}

const defaultFlags: FeatureFlags = {
  showDailyChallenge: true,
  showActivityHeatmap: true,
  showLeaderboard: true,
  showAchievements: true,
  showStreakCounter: true,
  enableDarkModeToggle: true,
  showGuideSection: true,
  showPracticeMode: true,
  enableSQLHints: true,
  showXPSystem: true,
  enableSocialSharing: false,
  showModuleLocking: true,
  enableNotifications: true,
  showRecommendedProblems: true,
  enableAdvancedEditor: false,
};

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    // Load flags from localStorage
    const savedFlags = localStorage.getItem("featureFlags");
    if (savedFlags) {
      try {
        return { ...defaultFlags, ...JSON.parse(savedFlags) };
      } catch {
        return defaultFlags;
      }
    }
    return defaultFlags;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("userRole") === "admin";
  });

  useEffect(() => {
    // Save flags to localStorage whenever they change
    localStorage.setItem("featureFlags", JSON.stringify(flags));
  }, [flags]);

  const updateFlag = (key: keyof FeatureFlags, value: boolean) => {
    setFlags((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFlags = () => {
    setFlags(defaultFlags);
    localStorage.setItem("featureFlags", JSON.stringify(defaultFlags));
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, updateFlag, resetFlags, isAdmin }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagsProvider");
  }
  return context;
}
