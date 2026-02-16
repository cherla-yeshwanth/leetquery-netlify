import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { Users, Activity, Award, TrendingUp, LogOut } from "lucide-react";
import * as api from "../../services/api";

interface Stats {
  totalUsers: number;
  activeToday: number;
  totalProblemsSolved: number;
  avgCompletion: string;
}

const quickActions = [
  { 
    to: "/admin/themes", 
    icon: Award, 
    title: "Theme Manager", 
    description: "Customize app appearance with JSON themes",
    color: "var(--color-accent)"
  },
  { 
    to: "/admin/feature-flags", 
    icon: Award, 
    title: "Feature Flags", 
    description: "Control app features dynamically",
    color: "var(--color-primary)"
  },
  { 
    to: "/admin/users", 
    icon: Users, 
    title: "User Management", 
    description: "View and manage users",
    color: "var(--color-secondary)"
  },
  { 
    to: "/admin/analytics", 
    icon: Award, 
    title: "Analytics", 
    description: "View detailed analytics",
    color: "var(--color-xp)"
  },
];

const recentActivity = [
  { user: "John Doe", action: "Completed Module 5", time: "2 mins ago", type: "success" },
  { user: "Jane Smith", action: "Solved 3 Hard Problems", time: "5 mins ago", type: "success" },
  { user: "Admin", action: "Updated Feature Flag", time: "10 mins ago", type: "info" },
  { user: "Mike Johnson", action: "Failed Login Attempt", time: "15 mins ago", type: "error" },
  { user: "Sarah Wilson", action: "Started Learning Path", time: "20 mins ago", type: "success" },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem("userEmail") || "Admin";
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      // Check if user is authenticated
      if (!api.isAuthenticated()) {
        setError("Please sign in to access the admin dashboard");
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const data = await api.getAdminStats();
        setStats(data);
      } catch (error: any) {
        console.error("Failed to fetch admin stats:", error);
        setError(error.message || "Failed to load stats");
        
        // If unauthorized, sign out
        if (error.message?.includes("Unauthorized") || error.message?.includes("401") || error.message?.includes("Forbidden")) {
          api.signOut();
          setError("Your session has expired. Please sign in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    api.signOut();
    navigate("/login");
  };

  const statsData = [
    { icon: Users, label: "Total Users", value: loading ? "..." : stats?.totalUsers.toString() || "0", change: "+12%", color: "var(--color-primary)" },
    { icon: Activity, label: "Active Today", value: loading ? "..." : stats?.activeToday.toString() || "0", change: "+8%", color: "var(--color-secondary)" },
    { icon: Award, label: "Problems Solved", value: loading ? "..." : stats?.totalProblemsSolved.toString() || "0", change: "+23%", color: "var(--color-easy)" },
    { icon: TrendingUp, label: "Avg Completion", value: loading ? "..." : stats?.avgCompletion || "0%", change: "+5%", color: "var(--color-xp)" },
  ];

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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                }}
              >
                <Award className="w-6 h-6" style={{ color: "white" }} />
              </div>
              <div>
                <h1 className="text-xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  Admin Dashboard
                </h1>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Welcome back, {adminEmail}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--color-border)",
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div
            className="p-4 rounded-xl flex items-center gap-3"
            style={{
              backgroundColor: "rgba(255, 71, 87, 0.1)",
              border: "1px solid var(--color-hard)",
            }}
          >
            <Award className="w-5 h-5" style={{ color: "var(--color-hard)" }} />
            <div>
              <p className="font-semibold" style={{ color: "var(--color-hard)" }}>
                Failed to load admin stats
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "var(--bg-elevated)" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div
                    className="px-2 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: "rgba(0, 212, 170, 0.1)",
                      color: "var(--color-easy)",
                    }}
                  >
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl mb-1" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.to}
                  className="p-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <h3 className="text-lg mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    {action.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Recent Activity
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="p-5 flex items-center justify-between"
                style={{
                  borderBottom: index < recentActivity.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                      color: "var(--bg-base)",
                    }}
                  >
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      {activity.user}
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {activity.action}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {activity.time}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        activity.type === "success"
                          ? "var(--color-easy)"
                          : activity.type === "error"
                          ? "var(--color-hard)"
                          : "var(--color-secondary)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}