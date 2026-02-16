import { Link } from "react-router";
import { Check, Lock, ChevronRight } from "lucide-react";

const modules = [
  { emoji: "📋", title: "SELECT Basics", completed: 8, total: 8, status: "completed" },
  { emoji: "🔍", title: "WHERE Clause", completed: 10, total: 10, status: "completed" },
  { emoji: "📊", title: "ORDER BY", completed: 6, total: 6, status: "completed" },
  { emoji: "🧮", title: "Aggregations", completed: 5, total: 8, status: "active" },
  { emoji: "📦", title: "GROUP BY", completed: 3, total: 7, status: "unlocked" },
  { emoji: "🔗", title: "JOINs", completed: 0, total: 12, status: "unlocked" },
  { emoji: "🎯", title: "Subqueries", completed: 0, total: 10, status: "locked" },
  { emoji: "🪟", title: "Window Functions", completed: 0, total: 15, status: "locked" },
  { emoji: "🏗️", title: "CTEs", completed: 0, total: 8, status: "locked" },
  { emoji: "⚡", title: "Advanced", completed: 0, total: 20, status: "locked" },
];

export function LearningPath() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
          Learning Path
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Master SQL step by step
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-6 relative">
        {/* Connecting Line */}
        <div
          className="absolute left-8 top-12 bottom-12 w-0.5 hidden md:block"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {modules.map((module, index) => {
          const progress = (module.completed / module.total) * 100;
          const isCompleted = module.status === "completed";
          const isActive = module.status === "active";
          const isLocked = module.status === "locked";

          return (
            <div key={index} className="relative">
              <div
                className={`p-6 rounded-2xl transition-all ${
                  isLocked ? "opacity-50" : "hover:scale-[1.02] active:scale-[0.98]"
                }`}
                style={{
                  backgroundColor: isCompleted
                    ? "rgba(0, 212, 170, 0.1)"
                    : "var(--bg-card)",
                  border: isActive
                    ? "2px solid var(--color-primary)"
                    : "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Emoji Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{
                      backgroundColor: isCompleted
                        ? "var(--color-primary)"
                        : "var(--bg-elevated)",
                    }}
                  >
                    {module.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      {module.title}
                    </h3>

                    {isLocked ? (
                      <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Complete previous modules to unlock</span>
                      </div>
                    ) : (
                      <>
                        <div className="h-2 rounded-full mb-2" style={{ backgroundColor: "var(--bg-elevated)" }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: isCompleted ? "var(--color-primary)" : "var(--color-primary)",
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            {module.completed}/{module.total} completed
                          </span>
                          {!isCompleted && (
                            <Link
                              to="/app/problems"
                              className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all"
                              style={{ color: "var(--color-primary)" }}
                            >
                              {isActive ? "Continue" : "Start"}
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Status Icon */}
                  {isCompleted && (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      <Check className="w-6 h-6" style={{ color: "var(--bg-base)" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
