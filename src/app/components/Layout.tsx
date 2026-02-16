import { Outlet, NavLink } from "react-router";
import { Home, BookOpen, Code, Trophy, User, Gamepad2, Terminal, BookOpenCheck } from "lucide-react";
import { useThemeEngine } from "../context/ThemeEngineContext";

export function Layout() {
  const { currentTheme } = useThemeEngine();
  
  const navItems = [
    { to: "/app", icon: Home, label: "Home" },
    { to: "/app/guide", icon: BookOpenCheck, label: "Guide" },
    { to: "/app/learn", icon: BookOpen, label: "Learn" },
    { to: "/app/practice", icon: Terminal, label: "Practice" },
    { to: "/app/problems", icon: Code, label: "Problems" },
    { to: "/app/leaderboard", icon: Trophy, label: "Leaderboard" },
    { to: "/app/profile", icon: User, label: "Profile" },
  ];

  // Mobile navigation shows most important items
  const mobileNavItems = [
    { to: "/app", icon: Home, label: "Home" },
    { to: "/app/guide", icon: BookOpenCheck, label: "Guide" },
    { to: "/app/learn", icon: BookOpen, label: "Learn" },
    { to: "/app/practice", icon: Terminal, label: "Practice" },
    { to: "/app/problems", icon: Code, label: "Problems" },
    { to: "/app/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50" style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <NavLink to="/app" className="flex items-center gap-2 text-2xl" style={{ color: "var(--color-primary)", fontWeight: 800 }}>
            <span>{currentTheme.branding.logo}</span>
            <span>{currentTheme.branding.logoText}</span>
          </NavLink>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/app"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? "text-[var(--color-primary)] bg-[var(--bg-elevated)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50" style={{ backgroundColor: "var(--bg-card)", borderTop: "1px solid var(--color-border)" }}>
        <div className="flex justify-around items-center px-2 py-2">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/app"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[60px] ${
                  isActive
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--text-secondary)]"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}