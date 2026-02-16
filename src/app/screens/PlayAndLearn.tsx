import { Link } from "react-router";
import { Lock, Award, Zap, Trophy, ChevronRight, Star } from "lucide-react";

const quests = [
  { 
    title: "SQL Basics Quest", 
    description: "Master the fundamentals of SELECT, WHERE, and ORDER BY",
    progress: 100,
    xp: 500,
    icon: "🎯",
    status: "completed",
    reward: "SQL Novice Badge",
    challenges: 8,
    completedChallenges: 8
  },
  { 
    title: "Aggregation Master", 
    description: "Learn COUNT, SUM, AVG, MIN, MAX functions",
    progress: 65,
    xp: 750,
    icon: "🧮",
    status: "active",
    reward: "Data Analyst Badge",
    challenges: 12,
    completedChallenges: 8
  },
  { 
    title: "JOIN Warrior", 
    description: "Conquer INNER, LEFT, RIGHT, and FULL JOINs",
    progress: 0,
    xp: 1000,
    icon: "⚔️",
    status: "locked",
    reward: "Master Joiner Badge",
    challenges: 15,
    completedChallenges: 0
  },
  { 
    title: "Subquery Specialist", 
    description: "Master nested queries and correlated subqueries",
    progress: 0,
    xp: 1200,
    icon: "🔮",
    status: "locked",
    reward: "Query Wizard Badge",
    challenges: 10,
    completedChallenges: 0
  },
  { 
    title: "Advanced Filtering", 
    description: "Learn HAVING, CASE statements, and complex conditions",
    progress: 0,
    xp: 900,
    icon: "🎛️",
    status: "locked",
    reward: "Filter Expert Badge",
    challenges: 12,
    completedChallenges: 0
  },
  { 
    title: "Database Optimization", 
    description: "Understand indexes, query optimization, and performance",
    progress: 0,
    xp: 1500,
    icon: "⚡",
    status: "locked",
    reward: "Performance Pro Badge",
    challenges: 8,
    completedChallenges: 0
  },
];

const achievements = [
  { icon: "🏆", name: "First Query", description: "Complete your first SQL query", unlocked: true },
  { icon: "🔥", name: "Week Streak", description: "Maintain a 7-day streak", unlocked: true },
  { icon: "💯", name: "Perfect Score", description: "Get 100% on any challenge", unlocked: true },
  { icon: "🌟", name: "Rising Star", description: "Reach Level 5", unlocked: true },
  { icon: "⭐", name: "SQL Champion", description: "Complete 50 challenges", unlocked: false },
  { icon: "💎", name: "Elite Coder", description: "Reach Level 10", unlocked: false },
];

export function PlayAndLearn() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
          🎮 Play & Learn
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Complete quests, earn XP, and unlock achievements on your SQL learning journey
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Star className="w-6 h-6 mb-3" style={{ color: "var(--color-xp)" }} />
          <div className="text-3xl mb-1" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            2,340
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Total XP
          </div>
        </div>
        
        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Trophy className="w-6 h-6 mb-3" style={{ color: "var(--color-primary)" }} />
          <div className="text-3xl mb-1" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            1/6
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Quests Done
          </div>
        </div>

        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Award className="w-6 h-6 mb-3" style={{ color: "var(--color-cta)" }} />
          <div className="text-3xl mb-1" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            4/6
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Achievements
          </div>
        </div>

        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <Zap className="w-6 h-6 mb-3" style={{ color: "var(--color-streak)" }} />
          <div className="text-3xl mb-1" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            23
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Day Streak
          </div>
        </div>
      </div>

      {/* Learning Quests */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          Learning Quests
        </h2>
        
        <div className="space-y-4">
          {quests.map((quest, index) => {
            const isLocked = quest.status === "locked";
            const isCompleted = quest.status === "completed";
            
            return (
              <Link
                key={index}
                to={isLocked ? "#" : `/app/learn/quest/${index}`}
                className={`block p-6 rounded-2xl relative overflow-hidden transition-all ${
                  !isLocked ? "hover:scale-[1.01] active:scale-[0.99]" : "cursor-not-allowed"
                }`}
                style={{
                  backgroundColor: isLocked ? "var(--bg-elevated)" : "var(--bg-card)",
                  border: isCompleted 
                    ? "2px solid var(--color-primary)" 
                    : isLocked
                    ? "1px solid var(--bg-elevated)"
                    : "1px solid var(--color-border)",
                  opacity: isLocked ? 0.6 : 1,
                }}
                onClick={(e) => isLocked && e.preventDefault()}
              >
                {/* Background Icon */}
                <div 
                  className="absolute -right-4 -top-4 text-9xl opacity-5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {quest.icon}
                </div>

                <div className="relative flex items-start gap-4">
                  {/* Quest Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{
                      backgroundColor: isLocked 
                        ? "var(--bg-base)" 
                        : isCompleted
                        ? "rgba(0, 212, 170, 0.2)"
                        : "rgba(108, 92, 231, 0.2)",
                      border: isCompleted ? "2px solid var(--color-primary)" : "none",
                    }}
                  >
                    {isLocked ? <Lock className="w-8 h-8" style={{ color: "var(--text-muted)" }} /> : quest.icon}
                  </div>

                  {/* Quest Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg mb-1" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                          {quest.title}
                        </h3>
                        <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                          {quest.description}
                        </p>
                      </div>
                      
                      {isCompleted && (
                        <div 
                          className="flex items-center gap-2 px-3 py-1 rounded-full ml-4"
                          style={{
                            backgroundColor: "rgba(0, 212, 170, 0.2)",
                            color: "var(--color-primary)",
                          }}
                        >
                          <Trophy className="w-4 h-4" />
                          <span className="text-sm font-semibold">Completed</span>
                        </div>
                      )}

                      {!isLocked && !isCompleted && (
                        <ChevronRight className="w-6 h-6 ml-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                      )}
                    </div>

                    {/* Progress Bar */}
                    {!isLocked && (
                      <div className="mb-3">
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${quest.progress}%`,
                              background: isCompleted 
                                ? "var(--color-primary)"
                                : "linear-gradient(90deg, var(--color-secondary), var(--color-primary))",
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            {quest.completedChallenges}/{quest.challenges} challenges • {quest.progress}% complete
                          </span>
                          <div className="flex items-center gap-1">
                            <Zap className="w-4 h-4" style={{ color: "var(--color-xp)" }} />
                            <span className="text-sm font-semibold" style={{ color: "var(--color-xp)" }}>
                              +{quest.xp} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reward Badge */}
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" style={{ color: isLocked ? "var(--text-muted)" : "var(--color-cta)" }} />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: isLocked ? "var(--text-muted)" : "var(--text-secondary)" }}
                      >
                        Reward: {quest.reward}
                      </span>
                    </div>
                    
                    {isLocked && (
                      <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                        🔒 Complete previous quest to unlock
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-2xl mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          Achievements
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl text-center transition-all hover:scale-105"
              style={{
                backgroundColor: achievement.unlocked ? "var(--bg-card)" : "var(--bg-elevated)",
                border: achievement.unlocked ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                opacity: achievement.unlocked ? 1 : 0.5,
              }}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h4 className="text-sm mb-1" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {achievement.name}
              </h4>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
