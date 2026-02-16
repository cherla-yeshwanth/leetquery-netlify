import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronLeft,
  Palette,
  Save,
  Eye,
  Users,
  Globe,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useThemeEngine, ThemeConfig } from "../../context/ThemeEngineContext";

export function ThemeManager() {
  const { currentTheme, allThemes, activateTheme, updateTheme, createTheme, deleteTheme } =
    useThemeEngine();
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(currentTheme);
  const [editMode, setEditMode] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"themes" | "editor" | "json">("themes");
  const [jsonError, setJsonError] = useState("");
  const [jsonValue, setJsonValue] = useState("");
  const [newThemeName, setNewThemeName] = useState("");
  const [originalThemeId, setOriginalThemeId] = useState("");

  // Update jsonValue when selectedTheme changes
  useEffect(() => {
    setJsonValue(JSON.stringify(selectedTheme, null, 2));
    setNewThemeName(selectedTheme.name);
    setOriginalThemeId(selectedTheme.id);
  }, [selectedTheme]);

  const handleActivateGlobally = (themeId: string) => {
    if (confirm("Activate this theme for ALL users?")) {
      activateTheme(themeId);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleTestWithUser = (themeId: string) => {
    if (testEmail) {
      activateTheme(themeId, [testEmail]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setTestEmail("");
    }
  };

  const handleExportTheme = (theme: ThemeConfig) => {
    const json = JSON.stringify(theme, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${theme.id}-theme.json`;
    a.click();
  };

  const handleImportTheme = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const theme = JSON.parse(e.target?.result as string);
            createTheme({ ...theme, id: `custom-${Date.now()}`, active: false });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          } catch (error) {
            alert("Invalid theme JSON file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleColorChange = (colorKey: keyof ThemeConfig["colors"], value: string) => {
    const updatedTheme = {
      ...selectedTheme,
      colors: {
        ...selectedTheme.colors,
        [colorKey]: value,
      },
    };
    setSelectedTheme(updatedTheme);
    if (editMode) {
      updateTheme(selectedTheme.id, updatedTheme);
    }
  };

  const handleBrandingChange = (key: keyof ThemeConfig["branding"], value: string) => {
    const updatedTheme = {
      ...selectedTheme,
      branding: {
        ...selectedTheme.branding,
        [key]: value,
      },
    };
    setSelectedTheme(updatedTheme);
    if (editMode) {
      updateTheme(selectedTheme.id, updatedTheme);
    }
  };

  const handleSaveJsonChanges = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      
      // Check if the theme ID from JSON exists in allThemes
      const themeExists = allThemes.find((t) => t.id === parsed.id);
      const nameChanged = newThemeName !== allThemes.find((t) => t.id === originalThemeId)?.name;
      
      // Create new theme if name changed OR if the theme ID doesn't exist
      if (nameChanged || !themeExists) {
        const newTheme = {
          ...parsed,
          id: `custom-${Date.now()}`,
          name: newThemeName,
          active: false,
        };
        createTheme(newTheme);
        setSelectedTheme(newTheme);
      } else {
        // Update existing theme
        updateTheme(parsed.id, { ...parsed, name: newThemeName });
        setSelectedTheme({ ...parsed, name: newThemeName });
      }
      
      setJsonError("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      // Switch back to All Themes tab to show the updated theme
      setTimeout(() => setActiveTab("themes"), 500);
    } catch (error) {
      setJsonError("Invalid JSON - cannot save");
    }
  };

  const handleResetJson = () => {
    const original = allThemes.find((t) => t.id === originalThemeId);
    if (original) {
      setSelectedTheme(original);
      setJsonValue(JSON.stringify(original, null, 2));
      setJsonError("");
    }
  };

  const handleCreateNewTheme = () => {
    const blankTheme: ThemeConfig = {
      id: `custom-${Date.now()}`,
      name: "New Custom Theme",
      description: "A new custom theme",
      active: false,
      branding: {
        logo: "🎨",
        logoText: "LeetQuery",
        tagline: "Master SQL Like a Pro! 🚀",
      },
      colors: {
        primary: "#00D4AA",
        secondary: "#6C5CE7",
        accent: "#A29BFE",
        cta: "#FFB088",
        bgBase: "#0A0E27",
        bgCard: "#131729",
        bgElevated: "#1A1F3A",
        textPrimary: "#FFFFFF",
        textSecondary: "#A0AEC0",
        textMuted: "#718096",
        border: "#2D3748",
        success: "#00D4AA",
        warning: "#F59E0B",
        error: "#EF4444",
        hard: "#EF4444",
        medium: "#F59E0B",
        easy: "#00D4AA",
      },
    };
    setSelectedTheme(blankTheme);
    setJsonValue(JSON.stringify(blankTheme, null, 2));
    setNewThemeName(blankTheme.name);
    setOriginalThemeId(""); // Empty ID means new theme
    setActiveTab("json");
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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
                Theme Manager
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Control app appearance with JSON-based themes
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleImportTheme}
              className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:bg-[var(--bg-elevated)]"
              style={{ color: "var(--text-primary)", border: "1px solid var(--color-border)" }}
            >
              <Upload className="w-4 h-4" />
              Import JSON
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div
            className="p-4 rounded-2xl flex items-center gap-3"
            style={{
              backgroundColor: "rgba(0, 212, 170, 0.1)",
              border: "1px solid var(--color-primary)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
            <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              Theme changes applied successfully!
            </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: "themes", label: "All Themes", icon: Palette },
            { id: "editor", label: "Theme Editor", icon: Edit },
            { id: "json", label: "JSON Config", icon: Copy },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className="px-6 py-3 rounded-2xl flex items-center gap-2 transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? "var(--color-primary)" : "var(--bg-card)",
                  color: activeTab === tab.id ? "var(--bg-base)" : "var(--text-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* All Themes Tab */}
        {activeTab === "themes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create New Theme Card */}
            <button
              onClick={handleCreateNewTheme}
              className="p-6 rounded-2xl transition-all hover:scale-105 active:scale-95 border-2 border-dashed min-h-[400px] flex flex-col items-center justify-center gap-4"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--color-border)",
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(0, 212, 170, 0.1)",
                }}
              >
                <Plus className="w-10 h-10" style={{ color: "var(--color-primary)" }} />
              </div>
              <div>
                <h3 className="text-xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  Create New Theme
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Start with a blank template and customize
                </p>
              </div>
            </button>

            {/* Existing Themes */}
            {allThemes.map((theme) => {
              const isActive = theme.active;
              const isTestActive = theme.testUsers && theme.testUsers.length > 0;

              return (
                <div
                  key={theme.id}
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: isActive
                      ? "2px solid var(--color-primary)"
                      : "1px solid var(--color-border)",
                  }}
                >
                  {/* Theme Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{theme.branding.logo}</span>
                        <div>
                          <h3 style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                            {theme.name}
                          </h3>
                          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            {theme.description}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                          style={{
                            backgroundColor: "rgba(0, 212, 170, 0.2)",
                            color: "var(--color-primary)",
                          }}
                        >
                          <Globe className="w-3 h-3" />
                          Active Globally
                        </span>
                      )}
                      {isTestActive && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                          style={{
                            backgroundColor: "rgba(108, 92, 231, 0.2)",
                            color: "var(--color-secondary)",
                          }}
                        >
                          <Users className="w-3 h-3" />
                          Testing ({theme.testUsers?.length})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="flex gap-2 mb-4">
                    {[
                      theme.colors.primary,
                      theme.colors.secondary,
                      theme.colors.accent,
                      theme.colors.cta,
                      theme.colors.bgCard,
                    ].map((color, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-lg"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Test with User */}
                  <div className="mb-4">
                    <label className="text-sm mb-2 block" style={{ color: "var(--text-secondary)" }}>
                      Test with specific user:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl outline-none"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          border: "1px solid var(--color-border)",
                          color: "var(--text-primary)",
                        }}
                      />
                      <button
                        onClick={() => handleTestWithUser(theme.id)}
                        className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                        style={{
                          backgroundColor: "var(--color-secondary)",
                          color: "white",
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        Test
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleActivateGlobally(theme.id)}
                      disabled={isActive}
                      className="flex-1 px-4 py-2 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50"
                      style={{
                        backgroundColor: isActive ? "var(--bg-elevated)" : "var(--color-primary)",
                        color: isActive ? "var(--text-muted)" : "var(--bg-base)",
                      }}
                    >
                      <Globe className="w-4 h-4 inline mr-2" />
                      {isActive ? "Active" : "Activate"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTheme(theme);
                        setActiveTab("editor");
                      }}
                      className="px-4 py-2 rounded-xl transition-all hover:bg-[var(--bg-elevated)]"
                      style={{ color: "var(--text-primary)", border: "1px solid var(--color-border)" }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExportTheme(theme)}
                      className="px-4 py-2 rounded-xl transition-all hover:bg-[var(--bg-elevated)]"
                      style={{ color: "var(--text-primary)", border: "1px solid var(--color-border)" }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {theme.id !== "default" && (
                      <button
                        onClick={() => {
                          if (confirm("Delete this theme?")) deleteTheme(theme.id);
                        }}
                        className="px-4 py-2 rounded-xl transition-all hover:bg-[var(--bg-elevated)]"
                        style={{ color: "var(--color-hard)", border: "1px solid var(--color-border)" }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Theme Editor Tab */}
        {activeTab === "editor" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Editor */}
            <div>
              <h2 className="text-2xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                Editing: {selectedTheme.name}
              </h2>

              {/* Branding */}
              <div
                className="p-6 rounded-2xl mb-6"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h3 className="text-lg mb-4" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  Branding
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: "var(--text-secondary)" }}>
                      Logo Emoji
                    </label>
                    <input
                      type="text"
                      value={selectedTheme.branding.logo}
                      onChange={(e) => handleBrandingChange("logo", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl outline-none text-2xl text-center"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        border: "1px solid var(--color-border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: "var(--text-secondary)" }}>
                      App Name
                    </label>
                    <input
                      type="text"
                      value={selectedTheme.branding.logoText}
                      onChange={(e) => handleBrandingChange("logoText", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        border: "1px solid var(--color-border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-2 block" style={{ color: "var(--text-secondary)" }}>
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={selectedTheme.branding.tagline}
                      onChange={(e) => handleBrandingChange("tagline", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl outline-none"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        border: "1px solid var(--color-border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h3 className="text-lg mb-4" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  Colors
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedTheme.colors).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm mb-2 block capitalize" style={{ color: "var(--text-secondary)" }}>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) =>
                            handleColorChange(key as keyof ThemeConfig["colors"], e.target.value)
                          }
                          className="w-12 h-12 rounded-xl cursor-pointer"
                          style={{ border: "1px solid var(--color-border)" }}
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleColorChange(key as keyof ThemeConfig["colors"], e.target.value)
                          }
                          className="flex-1 px-3 py-2 rounded-xl outline-none text-sm font-mono"
                          style={{
                            backgroundColor: "var(--bg-elevated)",
                            border: "1px solid var(--color-border)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div>
              <h2 className="text-2xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                Live Preview
              </h2>
              <div
                className="p-8 rounded-2xl"
                style={{
                  backgroundColor: selectedTheme.colors.bgBase,
                  border: "2px solid var(--color-border)",
                }}
              >
                <div className="text-center mb-8">
                  <div className="text-5xl mb-3">{selectedTheme.branding.logo}</div>
                  <h1
                    className="text-4xl mb-2"
                    style={{ color: selectedTheme.colors.primary, fontWeight: 800 }}
                  >
                    {selectedTheme.branding.logoText}
                  </h1>
                  <p className="text-lg italic" style={{ color: selectedTheme.colors.textSecondary }}>
                    {selectedTheme.branding.tagline}
                  </p>
                </div>

                <div
                  className="p-6 rounded-2xl mb-4"
                  style={{
                    backgroundColor: selectedTheme.colors.bgCard,
                    border: `1px solid ${selectedTheme.colors.border}`,
                  }}
                >
                  <h3 className="mb-4" style={{ color: selectedTheme.colors.textPrimary, fontWeight: 600 }}>
                    Sample Card
                  </h3>
                  <p className="mb-4" style={{ color: selectedTheme.colors.textSecondary }}>
                    This is how cards will look with your theme.
                  </p>
                  <button
                    className="w-full px-4 py-3 rounded-xl font-semibold"
                    style={{
                      backgroundColor: selectedTheme.colors.primary,
                      color: selectedTheme.colors.bgBase,
                    }}
                  >
                    Primary Button
                  </button>
                </div>

                <div className="flex gap-2">
                  {[
                    selectedTheme.colors.primary,
                    selectedTheme.colors.secondary,
                    selectedTheme.colors.accent,
                    selectedTheme.colors.success,
                    selectedTheme.colors.warning,
                    selectedTheme.colors.error,
                  ].map((color, idx) => (
                    <div key={idx} className="flex-1 h-12 rounded-xl" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JSON Config Tab */}
        {activeTab === "json" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                JSON Configuration
              </h2>
              <div
                className="p-4 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Theme Name Input */}
                <div className="mb-4">
                  <label className="text-sm mb-2 block" style={{ color: "var(--text-secondary)" }}>
                    Theme Name
                    <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      (Change name to create a new theme)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    placeholder="e.g., Valentine's Day Theme"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      border: "1px solid var(--color-border)",
                      color: "var(--text-primary)",
                    }}
                  />
                  {newThemeName !== selectedTheme.name && (
                    <p className="text-xs mt-1" style={{ color: "var(--color-primary)" }}>
                      ✨ Will create a new theme called "{newThemeName}"
                    </p>
                  )}
                </div>

                {/* JSON Editor */}
                <textarea
                  value={jsonValue}
                  onChange={(e) => {
                    setJsonValue(e.target.value);
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setSelectedTheme(parsed);
                      setJsonError("");
                    } catch {
                      setJsonError("Invalid JSON");
                    }
                  }}
                  className="w-full h-[500px] p-4 rounded-xl outline-none font-mono text-sm"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--color-border)",
                    color: "var(--text-primary)",
                  }}
                />
                {jsonError && (
                  <div
                    className="p-2 mt-2 rounded-xl"
                    style={{
                      backgroundColor: "rgba(255, 0, 0, 0.1)",
                      border: "1px solid var(--color-hard)",
                      color: "var(--color-hard)",
                    }}
                  >
                    {jsonError}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSaveJsonChanges}
                    className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--bg-base)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleResetJson}
                    className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      color: "var(--bg-base)",
                    }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset to Original
                  </button>
                  <button
                    onClick={handleCreateNewTheme}
                    className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      color: "var(--bg-base)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Create New Theme
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                How to Use JSON
              </h2>
              <div
                className="p-6 rounded-2xl mb-4"
                style={{
                  backgroundColor: "rgba(108, 92, 231, 0.1)",
                  border: "1px solid var(--color-secondary)",
                }}
              >
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--color-secondary)" }} />
                  <div>
                    <h3 className="mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      JSON Theme Configuration
                    </h3>
                    <ol className="text-sm space-y-2" style={{ color: "var(--text-secondary)" }}>
                      <li>1. Edit the JSON on the left</li>
                      <li>2. Changes apply in real-time</li>
                      <li>3. Export to save as file</li>
                      <li>4. Import to load from file</li>
                      <li>5. Test with specific user email</li>
                      <li>6. Activate globally when ready</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h3 className="mb-4" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  Example: Diwali Theme
                </h3>
                <pre
                  className="text-xs overflow-x-auto p-4 rounded-xl"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {`{
  "id": "diwali",
  "name": "Diwali Festival",
  "branding": {
    "logo": "🪔",
    "logoText": "LeetQuery",
    "tagline": "Light Up Your SQL! ✨"
  },
  "colors": {
    "primary": "#FF6B35",
    "secondary": "#F7931E",
    "bgBase": "#1A0F0A"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}