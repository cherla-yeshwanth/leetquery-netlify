import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, RotateCcw, Play, Lightbulb, Check, X } from "lucide-react";
import { executeSQL, type SQLResult } from "../utils/sqlExecutor";

const mockProblem = {
  title: "Customer Orders Summary",
  difficulty: "Medium",
  description:
    "Write a SQL query to find the total number of orders and total revenue for each customer. Include customers with no orders (show 0 for their counts).",
  schema: `customers
  - customer_id (INT, PRIMARY KEY)
  - name (VARCHAR)
  - email (VARCHAR)

orders
  - order_id (INT, PRIMARY KEY)
  - customer_id (INT, FOREIGN KEY)
  - amount (DECIMAL)
  - order_date (DATE)`,
  hints: [
    "Use a LEFT JOIN to include all customers",
    "Use COUNT() and SUM() aggregate functions",
    "Group by customer information",
  ],
  expectedOutput: `customer_id | name      | order_count | total_revenue
1          | John Doe  | 5           | 450.00
2          | Jane Smith| 3           | 280.00
3          | Bob Jones | 0           | 0.00`,
};

export function Editor() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"description" | "schema">("description");
  const [query, setQuery] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [result, setResult] = useState<SQLResult | null>(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRun = () => {
    const sqlResult = executeSQL(query);
    setResult(sqlResult);
  };

  const handleReset = () => {
    setQuery("");
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between border-b"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/app/problems")}
            className="p-2 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            {mockProblem.title}
          </h1>
          <div
            className="px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: "rgba(255, 184, 0, 0.2)",
              color: "var(--color-medium)",
            }}
          >
            {mockProblem.difficulty}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="px-4 py-2 rounded-xl font-mono"
            style={{ backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)" }}
          >
            {formatTime(timer)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Problem */}
        <div className="lg:w-1/2 p-6 overflow-y-auto" style={{ backgroundColor: "var(--bg-base)" }}>
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("description")}
              className="px-4 py-2 rounded-xl transition-all"
              style={{
                backgroundColor: activeTab === "description" ? "var(--color-primary)" : "var(--bg-card)",
                border: activeTab === "description" ? "none" : "1px solid var(--color-border)",
                color: activeTab === "description" ? "var(--bg-base)" : "var(--text-primary)",
                fontWeight: activeTab === "description" ? 600 : 400,
              }}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("schema")}
              className="px-4 py-2 rounded-xl transition-all"
              style={{
                backgroundColor: activeTab === "schema" ? "var(--color-primary)" : "var(--bg-card)",
                border: activeTab === "schema" ? "none" : "1px solid var(--color-border)",
                color: activeTab === "schema" ? "var(--bg-base)" : "var(--text-primary)",
                fontWeight: activeTab === "schema" ? 600 : 400,
              }}
            >
              Schema
            </button>
          </div>

          {/* Content */}
          {activeTab === "description" ? (
            <div>
              <p className="mb-6 leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {mockProblem.description}
              </p>

              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl mb-4 transition-all active:scale-95"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-primary)",
                }}
              >
                <Lightbulb className="w-5 h-5" />
                {showHints ? "Hide Hints" : "Show Hints"}
              </button>

              {showHints && (
                <div
                  className="p-4 rounded-2xl space-y-2"
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--color-border)" }}
                >
                  {mockProblem.hints.map((hint, index) => (
                    <div key={index} className="flex gap-2">
                      <span style={{ color: "var(--color-primary)" }}>•</span>
                      <span style={{ color: "var(--text-secondary)" }}>{hint}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <pre
              className="p-4 rounded-2xl font-mono text-sm overflow-x-auto"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--color-border)",
                color: "var(--text-primary)",
              }}
            >
              {mockProblem.schema}
            </pre>
          )}
        </div>

        {/* Right Panel - Editor */}
        <div
          className="lg:w-1/2 p-6 flex flex-col border-t lg:border-t-0 lg:border-l"
          style={{ backgroundColor: "var(--bg-base)", borderColor: "var(--color-border)" }}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "var(--text-primary)", fontWeight: 600 }}>SQL Editor</h3>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--text-secondary)",
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleRun}
                className="px-6 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--bg-base)",
                  fontWeight: 600,
                }}
              >
                <Play className="w-4 h-4" />
                Run
              </button>
            </div>
          </div>

          {/* Editor */}
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Write your SQL query here..."
            className="flex-1 p-4 rounded-2xl font-mono text-sm resize-none outline-none mb-4"
            style={{
              backgroundColor: "#0D0D1A",
              border: "1px solid var(--color-border)",
              color: "var(--text-primary)",
              minHeight: "300px",
            }}
          />

          {/* Results */}
          {result && (
            <div
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: result.success
                  ? "rgba(0, 212, 170, 0.1)"
                  : "rgba(255, 71, 87, 0.1)",
                border: `1px solid ${result.success ? "var(--color-easy)" : "var(--color-hard)"}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <Check className="w-5 h-5" style={{ color: "var(--color-easy)" }} />
                ) : (
                  <X className="w-5 h-5" style={{ color: "var(--color-hard)" }} />
                )}
                <span
                  style={{
                    color: result.success ? "var(--color-easy)" : "var(--color-hard)",
                    fontWeight: 600,
                  }}
                >
                  {result.success ? "✅ Success" : "❌ Error"}
                </span>
                {result.success && result.executionTime && (
                  <>
                    <span style={{ color: "var(--text-muted)" }}>•</span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {result.executionTime}
                    </span>
                    {result.rowCount !== undefined && (
                      <>
                        <span style={{ color: "var(--text-muted)" }}>•</span>
                        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          {result.rowCount} rows
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
              
              {result.success ? (
                result.rows && result.rows.length > 0 ? (
                  <div className="overflow-x-auto mt-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                          {result.columns!.map((col, index) => (
                            <th
                              key={index}
                              className="px-3 py-2 text-left font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            style={{ borderBottom: "1px solid var(--color-border)" }}
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-3 py-2 font-mono"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                    {result.message}
                  </p>
                )
              ) : (
                <p className="text-sm font-mono mt-2" style={{ color: "var(--color-hard)" }}>
                  {result.error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}