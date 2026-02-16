import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, User, Shield, Bell, Moon, HelpCircle, Info, LogOut, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export function Settings() {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      signOut();
      navigate("/login");
    }
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      signOut();
      navigate("/login");
    }
  };

  const userInitial = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl md:text-4xl" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
          Settings
        </h1>
      </div>

      {/* Account Section */}
      <div className="mb-8">
        <h2 className="text-lg mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          Account
        </h2>

        {/* Profile Card */}
        <div
          className="p-5 rounded-2xl mb-3"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                color: "var(--bg-base)",
                fontWeight: 700,
              }}
            >
              {userInitial}
            </div>
            <div className="flex-1">
              <p className="mb-1" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {user?.name}
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Account Options */}
        <button
          className="w-full p-5 rounded-2xl flex items-center gap-4 mb-3 transition-all active:scale-[0.98]"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <User className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1 text-left">
            <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>Edit Profile</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Update your personal information
            </p>
          </div>
          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
        </button>

        <button
          className="w-full p-5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <Shield className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1 text-left">
            <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>Change Password</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Update your password
            </p>
          </div>
          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
        </button>
      </div>

      {/* Preferences Section */}
      <div className="mb-8">
        <h2 className="text-lg mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          Preferences
        </h2>

        <div
          className="p-5 rounded-2xl flex items-center gap-4 mb-3"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <Bell className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1">
            <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>Notifications</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Enable push notifications
            </p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-14 h-8 rounded-full transition-all flex items-center ${
              notificationsEnabled ? "justify-end" : "justify-start"
            } px-1`}
            style={{
              backgroundColor: notificationsEnabled ? "var(--color-primary)" : "var(--bg-elevated)",
            }}
          >
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: "var(--bg-base)" }}
            />
          </button>
        </div>

        <div
          className="p-5 rounded-2xl flex items-center gap-4"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <Moon className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1">
            <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>Dark Mode</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Toggle dark theme
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-14 h-8 rounded-full transition-all flex items-center ${
              isDarkMode ? "justify-end" : "justify-start"
            } px-1`}
            style={{
              backgroundColor: isDarkMode ? "var(--color-primary)" : "var(--bg-elevated)",
            }}
          >
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: "var(--bg-base)" }}
            />
          </button>
        </div>
      </div>

      {/* Support Section */}
      <div className="mb-8">
        <h2 className="text-lg mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          Support
        </h2>

        <button
          className="w-full p-5 rounded-2xl flex items-center gap-4 mb-3 transition-all active:scale-[0.98]"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <HelpCircle className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1 text-left">
            <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>Help & FAQ</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Get help and find answers
            </p>
          </div>
          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
        </button>

        <button
          className="w-full p-5 rounded-2xl flex items-center gap-4 mb-3 transition-all active:scale-[0.98]"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <Info className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1 text-left">
            <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>About LeetQuery</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Version 2.0.0
            </p>
          </div>
          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
        </button>

        <button
          onClick={handleLogout}
          className="w-full p-5 rounded-2xl flex items-center gap-4 mb-3 transition-all active:scale-[0.98]"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <LogOut className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1 text-left">
            <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>Log Out</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Sign out of your account
            </p>
          </div>
          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full p-5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            <Trash2 className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          </div>
          <div className="flex-1 text-left">
            <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>Delete Account</p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Permanently delete your account
            </p>
          </div>
          <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
        </button>
      </div>
    </div>
  );
}