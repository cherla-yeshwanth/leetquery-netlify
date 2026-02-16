import { Link } from "react-router";
import { ChevronLeft, TrendingUp, TrendingDown, Users, BookOpen, Code, Clock } from "lucide-react";

const overviewStats = [
  { label: "Total Users", value: "1,247", change: "+12%", trend: "up" },
  { label: "Active Users", value: "842", change: "+8%", trend: "up" },
  { label: "Avg Session Time", value: "24 min", change: "+15%", trend: "up" },
  { label: "Completion Rate", value: "67%", change: "-3%", trend: "down" },
];

const topProblems = [
  { title: "SELECT Basics", attempts: 1240, successRate: 92 },
  { title: "JOIN Operations", attempts: 980, successRate: 78 },
  { title: "GROUP BY Analysis", attempts: 850, successRate: 71 },
  { title: "Window Functions", attempts: 620, successRate: 58 },
  { title: "Complex Subqueries", attempts: 410, successRate: 45 },
];

const topScenarios = [
  { name: "Student Management", completions: 523, avgTime: "3.2 hrs" },
  { name: "E-Commerce", completions: 412, avgTime: "4.1 hrs" },
  { name: "Movie Database", completions: 389, avgTime: "2.8 hrs" },
  { name: "Employee & HR", completions: 345, avgTime: "5.3 hrs" },
  { name: "Social Network", completions: 198, avgTime: "6.7 hrs" },
];

export function Analytics() {
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
                Analytics Dashboard
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Last updated: 5 minutes ago
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => {
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {stat.label}
                  </span>
                  <div
                    className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
                    style={{
                      backgroundColor: stat.trend === "up" 
                        ? "rgba(0, 212, 170, 0.1)" 
                        : "rgba(255, 71, 87, 0.1)",
                      color: stat.trend === "up" ? "var(--color-easy)" : "var(--color-hard)",
                    }}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Problems */}
        <div className="mb-8">
          <h2 className="text-2xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Most Attempted Problems
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            {topProblems.map((problem, index) => (
              <div
                key={index}
                className="p-5 flex items-center justify-between border-b last:border-b-0"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "var(--bg-elevated)" }}
                  >
                    <Code className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      {problem.title}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {problem.attempts.toLocaleString()} attempts
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                      {problem.successRate}%
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Success Rate
                    </p>
                  </div>
                  <div className="w-24">
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--bg-elevated)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${problem.successRate}%`,
                          backgroundColor: 
                            problem.successRate >= 70 
                              ? "var(--color-easy)" 
                              : problem.successRate >= 50 
                              ? "var(--color-medium)" 
                              : "var(--color-hard)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Scenarios */}
        <div>
          <h2 className="text-2xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Scenario Performance
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            {topScenarios.map((scenario, index) => (
              <div
                key={index}
                className="p-5 flex items-center justify-between border-b last:border-b-0"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "var(--bg-elevated)" }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: "var(--color-secondary)" }} />
                  </div>
                  <div>
                    <h3 className="mb-1" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      {scenario.name}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {scenario.completions} completions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  <span style={{ color: "var(--text-primary)" }}>{scenario.avgTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
