import { Link } from "react-router";
import { Flame, Star, Target, Trophy, ChevronRight, Clock } from "lucide-react";
import { useFeatureFlags } from "../context/FeatureFlagsContext";
import { useAuth } from "../context/AuthContext";

const problems = [
  { title: "Top Customers by Revenue", category: "Aggregations", difficulty: "Easy" },
  { title: "Employee Department Stats", category: "GROUP BY", difficulty: "Medium" },
  { title: "Multi-table Join Query", category: "JOINs", difficulty: "Hard" },
];

export function Home() {
  const { flags } = useFeatureFlags();
  const { user } = useAuth();
  
  // Generate stats from real user data
  const stats = [
    { icon: Flame, label: "Day Streak", value: user?.currentStreak?.toString() || "0", color: "var(--color-streak)" },
    { icon: Star, label: "Level", value: user?.level?.toString() || "1", color: "var(--color-xp)" },
    { icon: Target, label: "Solved", value: user?.completedTopics?.length?.toString() || "0", color: "var(--color-easy)" },
    { icon: Trophy, label: "Total XP", value: user?.totalXP?.toString() || "0", color: "var(--color-secondary)" },
  ];

  // Calculate module progress from user's completed topics
  const calculateModuleProgress = () => {
    if (!user || !user.completedTopics || user.completedTopics.length === 0) {
      return [
        { emoji: "🧮", title: "Aggregations", progress: 0, completed: 0, total: 24 },
        { emoji: "📦", title: "GROUP BY", progress: 0, completed: 0, total: 24 },
        { emoji: "🔗", title: "JOINs", progress: 0, completed: 0, total: 24 },
      ];
    }

    // Map topic keywords to module categories
    const aggregationTopics = user.completedTopics.filter((topic: any) =>
      topic.topicId.toLowerCase().includes("aggregate") ||
      topic.topicId.toLowerCase().includes("count") ||
      topic.topicId.toLowerCase().includes("avg") ||
      topic.topicId.toLowerCase().includes("sum") ||
      topic.topicId.toLowerCase().includes("min") ||
      topic.topicId.toLowerCase().includes("max")
    );

    const groupByTopics = user.completedTopics.filter((topic: any) =>
      topic.topicId.toLowerCase().includes("group") ||
      topic.topicId.toLowerCase().includes("having")
    );

    const joinTopics = user.completedTopics.filter((topic: any) =>
      topic.topicId.toLowerCase().includes("join") ||
      topic.topicId.toLowerCase().includes("inner") ||
      topic.topicId.toLowerCase().includes("outer") ||
      topic.topicId.toLowerCase().includes("left") ||
      topic.topicId.toLowerCase().includes("right")
    );

    // Each module has 8 scenarios × 3 difficulty levels = 24 total possible completions
    const totalPerModule = 24;

    return [
      {
        emoji: "🧮",
        title: "Aggregations",
        completed: aggregationTopics.length,
        total: totalPerModule,
        progress: Math.round((aggregationTopics.length / totalPerModule) * 100),
      },
      {
        emoji: "📦",
        title: "GROUP BY",
        completed: groupByTopics.length,
        total: totalPerModule,
        progress: Math.round((groupByTopics.length / totalPerModule) * 100),
      },
      {
        emoji: "🔗",
        title: "JOINs",
        completed: joinTopics.length,
        total: totalPerModule,
        progress: Math.round((joinTopics.length / totalPerModule) * 100),
      },
    ];
  };

  const modules = calculateModuleProgress();

  // Generate calendar-style activity data with months
  const generateActivityData = () => {
    if (!user || !user.completedTopics || user.completedTopics.length === 0) {
      // If no data, show empty calendar
      const months = ["Oct", "Nov", "Dec", "Jan", "Feb"];
      const data: { month: string; weeks: number[][] }[] = [];
      
      months.forEach((month) => {
        const weeks: number[][] = [];
        const weeksInMonth = 4;
        
        for (let week = 0; week < weeksInMonth; week++) {
          const days: number[] = Array(7).fill(0);
          weeks.push(days);
        }
        
        data.push({ month, weeks });
      });
      
      return data;
    }

    // Build activity map from completed topics
    const activityMap: { [key: string]: number } = {};
    user.completedTopics.forEach((topic: any) => {
      const date = new Date(topic.completedAt).toISOString().split("T")[0];
      activityMap[date] = (activityMap[date] || 0) + 1;
    });

    // Generate last 5 months of data
    const months = ["Oct", "Nov", "Dec", "Jan", "Feb"];
    const data: { month: string; weeks: number[][] }[] = [];
    const today = new Date();
    
    months.forEach((month, monthIndex) => {
      const weeks: number[][] = [];
      const weeksInMonth = 4;
      
      for (let week = 0; week < weeksInMonth; week++) {
        const days: number[] = [];
        for (let day = 0; day < 7; day++) {
          // Calculate the actual date for this cell
          const daysAgo = (4 - monthIndex) * 28 + (weeksInMonth - 1 - week) * 7 + (6 - day);
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - daysAgo);
          const dateStr = checkDate.toISOString().split("T")[0];
          
          const count = activityMap[dateStr] || 0;
          // Convert count to intensity (0-3)
          const intensity = Math.min(3, count);
          days.push(intensity);
        }
        weeks.push(days);
      }
      
      data.push({ month, weeks });
    });
    
    return data;
  };

  const activityData = generateActivityData();
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-2" style={{ fontWeight: 800 }}>
          <span style={{ color: "var(--text-primary)" }}>Hey, </span>
          <span
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {user?.name}
          </span>{" "}
          <span>👋</span>
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Ready to level up your SQL skills?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
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
              <Icon className="w-6 h-6 mb-3" style={{ color: stat.color }} />
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

      {/* XP Progress */}
      {flags.showXPSystem && user && (
        <div
          className="p-6 rounded-2xl mb-8"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Level {user.level}</span>
            <span style={{ color: "var(--text-secondary)" }}>
              {user.totalXP % 500} / 500 XP
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${((user.totalXP % 500) / 500) * 100}%`,
                background: "linear-gradient(90deg, var(--color-xp), var(--color-streak))",
              }}
            />
          </div>
        </div>
      )}

      {/* Daily Challenge */}
      {flags.showDailyChallenge && (
        <div
          className="p-6 rounded-2xl mb-8"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "2px solid transparent",
            backgroundImage: "linear-gradient(var(--bg-card), var(--bg-card)), linear-gradient(135deg, var(--color-secondary), var(--color-primary))",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Daily Challenge</span>
            </div>
            <div
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: "rgba(0, 212, 170, 0.2)",
                color: "var(--color-primary)",
              }}
            >
              +15 Bonus XP
            </div>
          </div>
          <h3 className="text-xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            Customer Orders Summary
          </h3>
          <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
            Write a query to find the total number of orders and revenue for each customer
          </p>
          <div className="flex items-center gap-3">
            <div
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: "rgba(255, 184, 0, 0.2)",
                color: "var(--color-medium)",
              }}
            >
              Medium
            </div>
            <Link
              to="/app/problems/daily"
              className="flex items-center gap-2 font-semibold hover:gap-3 transition-all"
              style={{ color: "var(--color-primary)" }}
            >
              Solve Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Continue Learning */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Continue Learning
          </h2>
          <Link
            to="/app/learn"
            className="flex items-center gap-1 hover:gap-2 transition-all"
            style={{ color: "var(--color-primary)" }}
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modules.map((module, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="text-3xl mb-3">{module.emoji}</div>
              <h3 className="text-lg mb-3" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {module.title}
              </h3>
              <div className="h-2 rounded-full mb-2" style={{ backgroundColor: "var(--bg-elevated)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${module.progress}%`,
                    backgroundColor: "var(--color-primary)",
                  }}
                />
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {module.completed}/{module.total} completed
              </p>
            </div>
          ))}</div>
      </div>

      {/* Activity Heatmap with Month Labels */}
      {flags.showActivityHeatmap && (
        <div
          className="p-6 rounded-2xl mb-8"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
              Activity
            </h3>
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--bg-elevated)" }} />
                <span>None</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(0, 212, 170, 0.3)" }} />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(0, 212, 170, 0.6)" }} />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "var(--color-primary)" }} />
                <span>High</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-flex gap-6">
              {activityData.map((monthData, monthIndex) => (
                <div key={monthIndex}>
                  <div className="text-xs mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>
                    {monthData.month}
                  </div>
                  <div className="flex gap-1">
                    {monthData.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((intensity, dayIndex) => (
                          <div
                            key={dayIndex}
                            className="w-3 h-3 rounded-sm"
                            style={{
                              backgroundColor:
                                intensity === 3
                                  ? "var(--color-primary)"
                                  : intensity === 2
                                  ? "rgba(0, 212, 170, 0.6)"
                                  : intensity === 1
                                  ? "rgba(0, 212, 170, 0.3)"
                                  : "var(--bg-elevated)",
                            }}
                            title={`Day ${dayIndex + 1}, Week ${weekIndex + 1}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Problems */}
      {flags.showRecommendedProblems && (
        <div>
          <h2 className="text-2xl mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            Recommended Problems
          </h2>
          <div className="space-y-3">
            {problems.map((problem, index) => (
              <Link
                key={index}
                to={`/app/problems/${index}`}
                className="p-5 rounded-2xl flex items-center justify-between group transition-all active:scale-[0.98]"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex-1">
                  <h4 className="mb-1" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    {problem.title}
                  </h4>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {problem.category}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor:
                        problem.difficulty === "Easy"
                          ? "rgba(0, 212, 170, 0.2)"
                          : problem.difficulty === "Medium"
                          ? "rgba(255, 184, 0, 0.2)"
                          : "rgba(255, 71, 87, 0.2)",
                      color:
                        problem.difficulty === "Easy"
                          ? "var(--color-easy)"
                          : problem.difficulty === "Medium"
                          ? "var(--color-medium)"
                          : "var(--color-hard)",
                    }}
                  >
                    {problem.difficulty}
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: "var(--text-muted)" }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}