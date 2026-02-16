import { useState } from "react";
import { Play, RotateCcw, Download, Copy, Check, Database } from "lucide-react";
import { executeSQL, getAvailableTables, type SQLResult } from "../utils/sqlExecutor";

export function Practice() {
  const [query, setQuery] = useState("-- Write your SQL query here\nSELECT * FROM users;");
  const [results, setResults] = useState<SQLResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTables, setShowTables] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    // Simulate query execution delay
    setTimeout(() => {
      const result = executeSQL(query);
      setResults(result);
      setIsExecuting(false);
    }, 300);
  };

  const handleReset = () => {
    setQuery("-- Write your SQL query here\nSELECT * FROM users;");
    setResults(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowTables = () => {
    setShowTables(!showTables);
  };

  const handleExport = () => {
    if (!results) return;
    // Create CSV content
    const csv = [
      results.columns.join(","),
      ...results.rows.map((row: any[]) => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query_results.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
            SQL Practice
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Free-form SQL environment - practice your queries without constraints
          </p>
        </div>

        {/* Editor Section */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* SQL Editor */}
          <div
            className="flex-1 rounded-2xl flex flex-col overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF5F56" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFBD2E" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#27C93F" }} />
                <span className="ml-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  query.sql
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Reset</span>
                </button>
                
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    color: "white",
                    fontWeight: 600,
                  }}
                >
                  <Play className="w-4 h-4" />
                  <span>{isExecuting ? "Executing..." : "Execute"}</span>
                </button>
              </div>
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-6 py-4 resize-none outline-none font-mono text-sm"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
              placeholder="Write your SQL query here..."
              spellCheck={false}
            />
          </div>

          {/* Results Section */}
          <div
            className="flex-1 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
              <div className="flex items-center gap-4">
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  Results
                </span>
                {results && (
                  <>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {results.rowCount} rows
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      •
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      {results.executionTime}
                    </span>
                  </>
                )}
              </div>

              {results && (
                <button
                  onClick={handleExport}
                  className="px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export CSV</span>
                </button>
              )}
            </div>

            <div className="overflow-auto p-6" style={{ maxHeight: "calc(50vh - 100px)" }}>
              {!results ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="text-6xl mb-4">💻</div>
                  <p className="text-lg mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    Ready to execute
                  </p>
                  <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                    Write your SQL query and click Execute to see results
                  </p>
                  
                  {/* Available Tables */}
                  <button
                    onClick={handleShowTables}
                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 mt-4"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Database className="w-4 h-4" />
                    <span className="text-sm">{showTables ? 'Hide' : 'Show'} Available Tables</span>
                  </button>
                  
                  {showTables && (
                    <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "var(--bg-elevated)" }}>
                      <p className="text-sm mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                        Available Tables:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableTables().map(table => (
                          <span
                            key={table}
                            className="px-3 py-1 rounded-lg text-sm font-mono"
                            style={{
                              backgroundColor: "var(--bg-card)",
                              color: "var(--color-primary)",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            {table}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : results.success ? (
                results.rows && results.rows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                          {results.columns!.map((col: string, index: number) => (
                            <th
                              key={index}
                              className="px-4 py-3 text-left text-sm font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.rows.map((row: any[], rowIndex: number) => (
                          <tr
                            key={rowIndex}
                            className="transition-colors"
                            style={{
                              borderBottom: "1px solid var(--color-border)",
                            }}
                          >
                            {row.map((cell: any, cellIndex: number) => (
                              <td
                                key={cellIndex}
                                className="px-4 py-3 text-sm font-mono"
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
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-lg mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      Query executed successfully
                    </p>
                    <p style={{ color: "var(--text-secondary)" }}>
                      {results.message || "0 rows affected"}
                    </p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="text-6xl mb-4">❌</div>
                  <p className="text-lg mb-2" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                    Error executing query
                  </p>
                  <p 
                    className="font-mono text-sm px-4 py-2 rounded-lg"
                    style={{ 
                      color: "#FF5F56",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    {results.error}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}