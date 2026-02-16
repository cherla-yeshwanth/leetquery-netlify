import { Link, Navigate } from "react-router";
import { Settings, Flame, Target, Trophy, Award, Check, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center" style={{ color: "var(--text-secondary)" }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  const stats = [
    { icon: Flame, label: "Day Streak", value: user.currentStreak?.toString() || "0", color: "var(--color-streak)" },
    { icon: Target, label: "Solved", value: user.completedTopics?.length?.toString() || "0", color: "var(--color-easy)" },
    { icon: Trophy, label: "Total XP", value: user.totalXP?.toString() || "0", color: "var(--color-secondary)" },
    { icon: Award, label: "Badges", value: user.achievements?.length?.toString() || "0", color: "var(--color-xp)" },
  ];

  // Generate achievements dynamically based on user progress
  const generateAchievements = () => {
    const userAchievements = user.achievements || [];
    const completedCount = user.completedTopics?.length || 0;
    const streak = user.currentStreak || 0;

    return [
      {
        emoji: "🎉",
        title: "First Query",
        unlocked: userAchievements.includes("first_query") || completedCount >= 1,
      },
      {
        emoji: "📚",
        title: "Quick Learner",
        unlocked: userAchievements.includes("quick_learner") || completedCount >= 5,
      },
      {
        emoji: "🔥",
        title: "Streak Master",
        unlocked: userAchievements.includes("streak_master") || streak >= 7,
      },
      {
        emoji: "⚡",
        title: "Speed Demon",
        unlocked: userAchievements.includes("speed_demon") || completedCount >= 10,
      },
      {
        emoji: "🔗",
        title: "JOIN Expert",
        unlocked: userAchievements.includes("join_expert") || 
          (user.completedTopics?.filter((t: any) => t.topicId.toLowerCase().includes("join")).length || 0) >= 5,
      },
      {
        emoji: "💯",
        title: "Century Club",
        unlocked: userAchievements.includes("century_club") || completedCount >= 100,
      },
      {
        emoji: "🦉",
        title: "Night Owl",
        unlocked: userAchievements.includes("night_owl"),
      },
      {
        emoji: "✨",
        title: "Perfectionist",
        unlocked: userAchievements.includes("perfectionist"),
      },
    ];
  };

  const achievements = generateAchievements();

  // Calculate category progress from user's completed topics
  const calculateCategoryProgress = () => {
    if (!user.completedTopics || user.completedTopics.length === 0) {
      return [
        { emoji: "📋", label: "SELECT", completed: 0, total: 24, progress: 0 },
        { emoji: "🔍", label: "WHERE", completed: 0, total: 24, progress: 0 },
        { emoji: "📊", label: "ORDER BY", completed: 0, total: 24, progress: 0 },
        { emoji: "🧮", label: "Aggregations", completed: 0, total: 24, progress: 0 },
        { emoji: "📦", label: "GROUP BY", completed: 0, total: 24, progress: 0 },
        { emoji: "🔗", label: "JOINs", completed: 0, total: 24, progress: 0 },
      ];
    }

    // Map topic keywords to categories
    const selectTopics = user.completedTopics.filter((topic: any) =>
      topic.topicId.toLowerCase().includes("select") ||
      topic.topicId.toLowerCase().includes("basic")
    );

    const whereTopics = user.completedTopics.filter((topic: any) =>
      topic.topicId.toLowerCase().includes("where") ||
      topic.topicId.toLowerCase().includes("filter")
    );

    const orderByTopics = user.completedTopics.filter((topic: any) =>
      topic.topicId.toLowerCase().includes("order") ||
      topic.topicId.toLowerCase().includes("sort")
    );

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

    const totalPerCategory = 24; // 8 scenarios × 3 difficulty levels

    return [
      {
        emoji: "📋",
        label: "SELECT",
        completed: selectTopics.length,
        total: totalPerCategory,
        progress: Math.round((selectTopics.length / totalPerCategory) * 100),
      },
      {
        emoji: "🔍",
        label: "WHERE",
        completed: whereTopics.length,
        total: totalPerCategory,
        progress: Math.round((whereTopics.length / totalPerCategory) * 100),
      },
      {
        emoji: "📊",
        label: "ORDER BY",
        completed: orderByTopics.length,
        total: totalPerCategory,
        progress: Math.round((orderByTopics.length / totalPerCategory) * 100),
      },
      {
        emoji: "🧮",
        label: "Aggregations",
        completed: aggregationTopics.length,
        total: totalPerCategory,
        progress: Math.round((aggregationTopics.length / totalPerCategory) * 100),
      },
      {
        emoji: "📦",
        label: "GROUP BY",
        completed: groupByTopics.length,
        total: totalPerCategory,
        progress: Math.round((groupByTopics.length / totalPerCategory) * 100),
      },
      {
        emoji: "🔗",
        label: "JOINs",
        completed: joinTopics.length,
        total: totalPerCategory,
        progress: Math.round((joinTopics.length / totalPerCategory) * 100),
      },
    ];
  };

  const categories = calculateCategoryProgress();

  const userInitial = user.name?.[0]?.toUpperCase() || "?";
  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const currentLevelXP = user.totalXP % 500;
  const xpProgress = (currentLevelXP / 500) * 100;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Profile Header */}
      <div
        className="p-8 rounded-2xl mb-8 relative"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <Link
          to="/app/settings"
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <Settings className="w-6 h-6" />
        </Link>

        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              color: "var(--bg-base)",
              fontWeight: 700,
            }}
          >
            {userInitial}
          </div>

          <h1 className="text-2xl mb-1" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            {user.name}
          </h1>
          <p className="mb-1" style={{ color: "var(--text-secondary)" }}>
            {user.email}
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Joined {joinedDate}
          </p>

          {/* XP Progress */}
          <div className="w-full max-w-md mt-6">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Level {user.level}</span>
              <span style={{ color: "var(--text-secondary)" }}>{currentLevelXP} / 500 XP</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${xpProgress}%`,
                  background: "linear-gradient(90deg, var(--color-xp), var(--color-streak))",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-2xl text-center"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <Icon className="w-6 h-6 mb-3 mx-auto" style={{ color: stat.color }} />
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

      {/* Achievements */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl text-center transition-all ${
                achievement.unlocked ? "" : "opacity-50"
              }`}
              style={{
                backgroundColor: achievement.unlocked
                  ? "rgba(255, 215, 0, 0.1)"
                  : "var(--bg-card)",
                border: `1px solid ${achievement.unlocked ? "var(--color-xp)" : "var(--color-border)"}`,
              }}
            >
              <div className="relative inline-block mb-3">
                <span className="text-4xl">{achievement.emoji}</span>
                {achievement.unlocked ? (
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <Check className="w-4 h-4" style={{ color: "var(--bg-base)" }} />
                  </div>
                ) : (
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--text-muted)" }}
                  >
                    <Lock className="w-3 h-3" style={{ color: "var(--bg-base)" }} />
                  </div>
                )}
              </div>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                {achievement.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Progress */}
      <div>
        <h2 className="text-2xl mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          Category Progress
        </h2>
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-2xl">{category.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      {category.label}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: "var(--bg-elevated)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${category.progress}%`,
                        backgroundColor: category.progress === 100 ? "var(--color-primary)" : "var(--color-secondary)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}