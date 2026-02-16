import { useState } from "react";
import { Link } from "react-router";
import { Search, Check, ChevronRight } from "lucide-react";

const problems = [
  { id: 1, title: "Select All Customers", category: "SELECT", difficulty: "Easy", xp: 10, solved: true },
  { id: 2, title: "Filter Active Users", category: "WHERE", difficulty: "Easy", xp: 10, solved: true },
  { id: 3, title: "Sort Products by Price", category: "ORDER BY", difficulty: "Easy", xp: 10, solved: true },
  { id: 4, title: "Count Total Orders", category: "Aggregations", difficulty: "Easy", xp: 15, solved: true },
  { id: 5, title: "Average Order Value", category: "Aggregations", difficulty: "Medium", xp: 20, solved: false },
  { id: 6, title: "Group Sales by Region", category: "GROUP BY", difficulty: "Medium", xp: 20, solved: false },
  { id: 7, title: "Customer Orders Join", category: "JOINs", difficulty: "Medium", xp: 25, solved: false },
  { id: 8, title: "Top 5 Products", category: "Aggregations", difficulty: "Medium", xp: 20, solved: false },
  { id: 9, title: "Employee Department Hierarchy", category: "JOINs", difficulty: "Hard", xp: 30, solved: false },
  { id: 10, title: "Complex Subquery Analysis", category: "Subqueries", difficulty: "Hard", xp: 35, solved: false },
];

const categories = ["All", "SELECT", "WHERE", "ORDER BY", "Aggregations", "GROUP BY", "JOINs", "Subqueries"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

export function Problems() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || problem.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-6" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
          Problems
        </h1>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-2xl outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div>
          <p className="mb-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            Difficulty
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className="px-4 py-2 rounded-xl whitespace-nowrap transition-all active:scale-95"
                style={{
                  backgroundColor: selectedDifficulty === difficulty ? "var(--color-primary)" : "var(--bg-card)",
                  border: selectedDifficulty === difficulty ? "none" : "1px solid var(--color-border)",
                  color: selectedDifficulty === difficulty ? "var(--bg-base)" : "var(--text-primary)",
                  fontWeight: selectedDifficulty === difficulty ? 600 : 400,
                }}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            Category
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-2 rounded-xl whitespace-nowrap transition-all active:scale-95"
                style={{
                  backgroundColor: selectedCategory === category ? "var(--color-primary)" : "var(--bg-card)",
                  border: selectedCategory === category ? "none" : "1px solid var(--color-border)",
                  color: selectedCategory === category ? "var(--bg-base)" : "var(--text-primary)",
                  fontWeight: selectedCategory === category ? 600 : 400,
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.map((problem) => (
          <Link
            key={problem.id}
            to={`/app/problems/${problem.id}`}
            className="p-5 rounded-2xl flex items-center gap-4 group transition-all active:scale-[0.98]"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Solved Indicator */}
            <div className="w-8 h-8 flex-shrink-0">
              {problem.solved && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <Check className="w-5 h-5" style={{ color: "var(--bg-base)" }} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="mb-1 truncate" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {problem.title}
              </h3>
              <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span>{problem.category}</span>
              </div>
            </div>

            {/* Difficulty & XP */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className="px-3 py-1 rounded-full text-sm whitespace-nowrap"
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
              <div
                className="px-3 py-1 rounded-full text-sm whitespace-nowrap"
                style={{
                  backgroundColor: "rgba(255, 215, 0, 0.2)",
                  color: "var(--color-xp)",
                }}
              >
                +{problem.xp} XP
              </div>
              <ChevronRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                style={{ color: "var(--text-muted)" }}
              />
            </div>
          </Link>
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
            No problems found
          </p>
        </div>
      )}
    </div>
  );
}
