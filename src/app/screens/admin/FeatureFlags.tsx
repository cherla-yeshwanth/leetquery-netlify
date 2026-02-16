import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, Save, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useFeatureFlags } from "../../context/FeatureFlagsContext";

const flagDescriptions: Record<string, { title: string; description: string; category: string }> = {
  showDailyChallenge: {
    title: "Daily Challenge",
    description: "Show daily challenge card on home page",
    category: "Home",
  },
  showActivityHeatmap: {
    title: "Activity Heatmap",
    description: "Display user activity calendar on home page",
    category: "Home",
  },
  showLeaderboard: {
    title: "Leaderboard",
    description: "Enable leaderboard feature and navigation",
    category: "Features",
  },
  showAchievements: {
    title: "Achievements System",
    description: "Display achievements on profile page",
    category: "Gamification",
  },
  showStreakCounter: {
    title: "Streak Counter",
    description: "Show streak counter in stats",
    category: "Gamification",
  },
  enableDarkModeToggle: {
    title: "Dark Mode Toggle",
    description: "Allow users to switch between dark and light themes",
    category: "UI",
  },
  showGuideSection: {
    title: "SQL Guide Section",
    description: "Show comprehensive SQL guide in navigation",
    category: "Learning",
  },
  showPracticeMode: {
    title: "Practice Mode",
    description: "Enable SQL sandbox practice mode",
    category: "Learning",
  },
  enableSQLHints: {
    title: "SQL Hints",
    description: "Show hints button in lesson pages",
    category: "Learning",
  },
  showXPSystem: {
    title: "XP System",
    description: "Display XP points and level progression",
    category: "Gamification",
  },
  enableSocialSharing: {
    title: "Social Sharing",
    description: "Allow users to share achievements (Coming Soon)",
    category: "Features",
  },
  showModuleLocking: {
    title: "Progressive Module Locking",
    description: "Lock modules until previous ones are completed",
    category: "Learning",
  },
  enableNotifications: {
    title: "Notifications",
    description: "Enable push notifications system",
    category: "Features",
  },
  showRecommendedProblems: {
    title: "Recommended Problems",
    description: "Show personalized problem recommendations",
    category: "Home",
  },
  enableAdvancedEditor: {
    title: "Advanced SQL Editor",
    description: "Enable advanced editor features (autocomplete, etc.)",
    category: "Features",
  },
};

export function FeatureFlags() {
  const { flags, updateFlag, resetFlags } = useFeatureFlags();
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const categories = Array.from(new Set(Object.values(flagDescriptions).map((d) => d.category)));

  const handleSave = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all feature flags to defaults?")) {
      resetFlags();
    }
  };

  const getFlagsByCategory = (category: string) => {
    return Object.entries(flagDescriptions)
      .filter(([_, desc]) => desc.category === category)
      .map(([key]) => key);
  };

  const getEnabledCount = () => {
    return Object.values(flags).filter(Boolean).length;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                Feature Flags
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {getEnabledCount()} of {Object.keys(flags).length} features enabled
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:bg-[var(--bg-elevated)]"
              style={{ color: "var(--color-medium)" }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--bg-base)",
              }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSaveSuccess && (
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div
            className="p-4 rounded-2xl flex items-center gap-3"
            style={{
              backgroundColor: "rgba(0, 212, 170, 0.1)",
              border: "1px solid var(--color-primary)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
            <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              Feature flags saved successfully! Changes are live immediately.
            </span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Info Card */}
        <div
          className="p-6 rounded-2xl mb-8"
          style={{
            backgroundColor: "rgba(108, 92, 231, 0.1)",
            border: "1px solid var(--color-secondary)",
          }}
        >
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--color-secondary)" }} />
            <div>
              <h3 className="mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                About Feature Flags
              </h3>
              <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                Feature flags allow you to enable or disable features without deploying new code. Changes take
                effect immediately for all users.
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Toggle any feature below and click "Save Changes" to apply.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Flags by Category */}
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              {category}
            </h2>
            <div className="space-y-3">
              {getFlagsByCategory(category).map((flagKey) => {
                const key = flagKey as keyof typeof flags;
                const info = flagDescriptions[key];
                const isEnabled = flags[key];

                return (
                  <div
                    key={key}
                    className="p-5 rounded-2xl flex items-center justify-between"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 style={{ color: "var(--text-primary)", fontWeight: 600 }}>{info.title}</h3>
                        <span
                          className="px-2 py-0.5 rounded-lg text-xs font-semibold"
                          style={{
                            backgroundColor: isEnabled
                              ? "rgba(0, 212, 170, 0.2)"
                              : "rgba(155, 165, 188, 0.2)",
                            color: isEnabled ? "var(--color-primary)" : "var(--text-muted)",
                          }}
                        >
                          {isEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {info.description}
                      </p>
                    </div>

                    <button
                      onClick={() => updateFlag(key, !isEnabled)}
                      className={`w-14 h-8 rounded-full transition-all flex items-center ${
                        isEnabled ? "justify-end" : "justify-start"
                      } px-1 ml-6 flex-shrink-0`}
                      style={{
                        backgroundColor: isEnabled ? "var(--color-primary)" : "var(--bg-elevated)",
                      }}
                    >
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: "var(--bg-base)" }} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
