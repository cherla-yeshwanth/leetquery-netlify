import { useParams, Link } from "react-router";
import { ChevronLeft, Trophy, Flame, Zap } from "lucide-react";
import { useState } from "react";

const lessonData: Record<string, any> = {
  "student-0": {
    moduleTitle: "CREATE Tables (Students, Courses, Enrollments)",
    scenarioTitle: "Student Management System",
    lessons: [
      {
        level: 1,
        difficulty: "Easy",
        title: "Create Students Table",
        description: "Learn to create a basic students table with essential columns",
        expectedQuery: "CREATE TABLE students (student_id INT PRIMARY KEY, name VARCHAR(100), major VARCHAR(50));",
        hint: "Use CREATE TABLE with column definitions including data types",
      },
      {
        level: 2,
        difficulty: "Medium",
        title: "Create Courses Table with Constraints",
        description: "Create a courses table with NOT NULL and UNIQUE constraints",
        expectedQuery: "CREATE TABLE courses (course_id INT PRIMARY KEY, course_name VARCHAR(100) NOT NULL UNIQUE, credits INT);",
        hint: "Add NOT NULL and UNIQUE constraints to columns",
      },
      {
        level: 3,
        difficulty: "Hard",
        title: "Create Enrollments Table with Foreign Keys",
        description: "Create an enrollments table that references both students and courses",
        expectedQuery: "CREATE TABLE enrollments (enrollment_id INT PRIMARY KEY, student_id INT, course_id INT, grade VARCHAR(2), FOREIGN KEY (student_id) REFERENCES students(student_id), FOREIGN KEY (course_id) REFERENCES courses(course_id));",
        hint: "Use FOREIGN KEY to reference other tables",
      },
    ],
  },
  // Add more lessons for other modules as needed
};

export function ModuleLesson() {
  const { scenarioId, moduleIndex } = useParams();
  const lessonKey = `${scenarioId}-${moduleIndex}`;
  const lesson = lessonData[lessonKey];

  const [currentLesson, setCurrentLesson] = useState(0);
  const [sqlQuery, setSqlQuery] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-center">
        <h1 className="text-2xl mb-4" style={{ color: "var(--text-primary)" }}>
          Lesson content coming soon!
        </h1>
        <p style={{ color: "var(--text-secondary)" }} className="mb-4">
          This module is being prepared. Check back soon!
        </p>
        <Link
          to={`/app/learn/${scenarioId}`}
          className="inline-block px-6 py-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
            color: "white",
          }}
        >
          Back to Learning Path
        </Link>
      </div>
    );
  }

  const currentLessonData = lesson.lessons[currentLesson];

  const handleSubmit = () => {
    // Simple check - in real app this would be more sophisticated
    const normalizedQuery = sqlQuery.trim().toLowerCase().replace(/\s+/g, " ");
    const normalizedExpected = currentLessonData.expectedQuery.toLowerCase().replace(/\s+/g, " ");
    
    if (normalizedQuery.includes("create table")) {
      setResult("correct");
      setTimeout(() => {
        if (currentLesson < lesson.lessons.length - 1) {
          setCurrentLesson(currentLesson + 1);
          setSqlQuery("");
          setResult(null);
          setShowHint(false);
        }
      }, 2000);
    } else {
      setResult("incorrect");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          to={`/app/learn/${scenarioId}`}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl transition-all hover:scale-105"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
            color: "var(--text-secondary)",
          }}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to {lesson.scenarioTitle}</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
              {lesson.moduleTitle}
            </h1>
            <span
              className="px-3 py-1 text-sm rounded-lg font-medium"
              style={{
                backgroundColor:
                  currentLessonData.difficulty === "Easy"
                    ? "rgba(0, 212, 170, 0.15)"
                    : currentLessonData.difficulty === "Medium"
                    ? "rgba(108, 92, 231, 0.15)"
                    : "rgba(255, 176, 136, 0.15)",
                color:
                  currentLessonData.difficulty === "Easy"
                    ? "var(--color-primary)"
                    : currentLessonData.difficulty === "Medium"
                    ? "var(--color-secondary)"
                    : "var(--color-accent)",
              }}
            >
              {currentLessonData.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-4" style={{ color: "var(--text-secondary)" }}>
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              Lesson {currentLesson + 1} of {lesson.lessons.length}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
              5 day streak
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              +10 XP
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2 mb-2">
            {lesson.lessons.map((_: any, idx: number) => (
              <div
                key={idx}
                className="h-2 flex-1 rounded-full transition-all"
                style={{
                  backgroundColor:
                    idx < currentLesson
                      ? "var(--color-primary)"
                      : idx === currentLesson
                      ? "var(--color-accent)"
                      : "var(--bg-elevated)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Lesson Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Instructions */}
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h2 className="text-2xl mb-3" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              {currentLessonData.title}
            </h2>
            <p className="mb-6" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {currentLessonData.description}
            </p>

            {/* Hint */}
            {showHint ? (
              <div
                className="p-4 rounded-xl mb-4"
                style={{
                  backgroundColor: "rgba(0, 212, 170, 0.1)",
                  border: "1px solid var(--color-primary)",
                }}
              >
                <p className="text-sm" style={{ color: "var(--color-primary)" }}>
                  💡 {currentLessonData.hint}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="px-4 py-2 rounded-xl text-sm mb-4 transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }}
              >
                💡 Show Hint
              </button>
            )}

            {/* Result Feedback */}
            {result === "correct" && (
              <div
                className="p-4 rounded-xl animate-pulse"
                style={{
                  backgroundColor: "rgba(0, 212, 170, 0.2)",
                  border: "2px solid var(--color-primary)",
                }}
              >
                <p className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                  ✅ Correct! Great job!
                </p>
              </div>
            )}

            {result === "incorrect" && (
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: "rgba(255, 118, 117, 0.2)",
                  border: "2px solid #FF7675",
                }}
              >
                <p className="text-lg font-bold" style={{ color: "#FF7675" }}>
                  ❌ Not quite right. Try again!
                </p>
              </div>
            )}
          </div>

          {/* SQL Editor */}
          <div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  SQL Editor
                </span>
              </div>

              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Write your SQL query here..."
                className="w-full p-4 font-mono text-sm resize-none outline-none"
                style={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                  minHeight: "300px",
                }}
              />

              <div
                className="px-4 py-3 flex items-center justify-end gap-3"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <button
                  onClick={() => setSqlQuery("")}
                  className="px-4 py-2 rounded-xl text-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    color: "white",
                  }}
                >
                  Run Query
                </button>
              </div>
            </div>

            {/* Schema Reference */}
            <div
              className="mt-4 p-4 rounded-2xl"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 className="text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                📚 Schema Reference
              </h3>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Create a table with appropriate columns and data types for this scenario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
