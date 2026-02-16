import { Trophy, Medal, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { getLeaderboard } from "../services/api";

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data.leaderboard);
      } catch (err: any) {
        setError(err.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "var(--color-xp)";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return "var(--text-muted)";
  };

  const topThree = leaderboard.slice(0, 3).map((user, idx) => ({
    rank: idx + 1,
    username: user.name,
    level: user.level,
    streak: user.currentStreak,
    xp: user.totalXP,
    avatar: user.name[0]?.toUpperCase() || "?",
  }));

  const restOfLeaderboard = leaderboard.slice(3).map((user, idx) => ({
    rank: idx + 4,
    username: user.name,
    level: user.level,
    streak: user.currentStreak,
    xp: user.totalXP,
    avatar: user.name[0]?.toUpperCase() || "?",
  }));

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center" style={{ color: "var(--text-secondary)" }}>
          Loading leaderboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div
          className="p-4 rounded-xl text-center"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "var(--color-hard)",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  // Check if we have enough users for the podium
  if (leaderboard.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
            Leaderboard
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Top SQL learners this month
          </p>
        </div>
        <div className="text-center" style={{ color: "var(--text-secondary)" }}>
          No users on the leaderboard yet. Be the first!
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
          Leaderboard
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Top SQL learners this month
        </p>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <div className="mb-12">
          <div className="flex items-end justify-center gap-4 mb-8">
            {/* 2nd Place (Left) */}
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-3"
                style={{
                  backgroundColor: "#C0C0C0",
                  color: "var(--bg-base)",
                  fontWeight: 700,
                }}
              >
                {topThree[1].avatar}
              </div>
              <p className="text-sm mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {topThree[1].username}
              </p>
              <div
                className="w-full py-8 rounded-t-2xl flex flex-col items-center justify-center"
                style={{
                  backgroundColor: "rgba(192, 192, 192, 0.1)",
                  border: "1px solid #C0C0C0",
                }}
              >
                <span className="text-3xl mb-2">🥈</span>
                <p className="text-xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  {topThree[1].xp} XP
                </p>
              </div>
            </div>

            {/* 1st Place (Middle) */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative mb-3">
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl md:text-4xl"
                  style={{
                    background: "radial-gradient(circle, var(--color-xp), #DAA520)",
                    color: "var(--bg-base)",
                    fontWeight: 700,
                    boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
                  }}
                >
                  {topThree[0].avatar}
                </div>
                <div className="absolute -top-2 -right-2 text-3xl">👑</div>
              </div>
              <p className="text-sm mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {topThree[0].username}
              </p>
              <div
                className="w-full py-12 rounded-t-2xl flex flex-col items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05))",
                  border: "2px solid var(--color-xp)",
                  boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
                }}
              >
                <span className="text-4xl mb-2">🥇</span>
                <p className="text-2xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  {topThree[0].xp} XP
                </p>
              </div>
            </div>

            {/* 3rd Place (Right) */}
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-3 relative"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                  color: "var(--bg-base)",
                  fontWeight: 700,
                  border: "2px solid var(--color-primary)",
                }}
              >
                {topThree[2].avatar}
              </div>
              <p className="text-sm mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {topThree[2].username}
              </p>
              <div
                className="w-full py-6 rounded-t-2xl flex flex-col items-center justify-center"
                style={{
                  backgroundColor: "rgba(205, 127, 50, 0.1)",
                  border: "1px solid #CD7F32",
                }}
              >
                <span className="text-3xl mb-2">🥉</span>
                <p className="text-xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  {topThree[2].xp} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div>
        <h2 className="text-xl mb-4" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          {topThree.length < 3 ? "Leaderboard" : "Full Rankings"}
        </h2>
        <div className="space-y-2">
          {/* Show all users if less than 3, otherwise show 4th+ */}
          {(topThree.length < 3 ? leaderboard.map((user, idx) => ({
            rank: idx + 1,
            username: user.name,
            level: user.level,
            streak: user.currentStreak,
            xp: user.totalXP,
            avatar: user.name[0]?.toUpperCase() || "?",
          })) : restOfLeaderboard).map((user) => (
            <div
              key={user.rank}
              className="p-4 rounded-2xl flex items-center gap-4"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Rank */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                }}
              >
                {user.rank}
              </div>

              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                {user.avatar}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  {user.username}
                </p>
                <div className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span>Level {user.level}</span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-4 h-4" style={{ color: "var(--color-streak)" }} />
                    {user.streak}
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="text-right flex-shrink-0">
                <p className="text-xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                  {user.xp}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}