import { Link } from "react-router";
import { GraduationCap, Briefcase, Film, ShoppingCart, Heart, Plane, Book, Database } from "lucide-react";

const scenarios = [
  {
    id: "student",
    icon: GraduationCap,
    title: "Student Management",
    description: "Learn SQL with a university database: students, courses, enrollments, grades",
    color: "#00D4AA",
    gradient: "linear-gradient(135deg, #00D4AA, #00B894)",
    topics: 15,
    difficulty: "Beginner",
  },
  {
    id: "employee",
    icon: Briefcase,
    title: "Employee & HR",
    description: "Master queries with employee data: departments, salaries, performance, hierarchy",
    color: "#6C5CE7",
    gradient: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
    topics: 15,
    difficulty: "Intermediate",
  },
  {
    id: "movie",
    icon: Film,
    title: "Movie Database",
    description: "Explore film data: movies, actors, directors, ratings, box office",
    color: "#FFB088",
    gradient: "linear-gradient(135deg, #FFB088, #FDCB6E)",
    topics: 15,
    difficulty: "Beginner",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-Commerce",
    description: "Build queries for online stores: products, orders, customers, inventory",
    color: "#00D4AA",
    gradient: "linear-gradient(135deg, #00D4AA, #55EFC4)",
    topics: 15,
    difficulty: "Intermediate",
  },
  {
    id: "hospital",
    icon: Heart,
    title: "Hospital & Healthcare",
    description: "Work with medical data: patients, doctors, appointments, treatments",
    color: "#FF7675",
    gradient: "linear-gradient(135deg, #FF7675, #FD79A8)",
    topics: 15,
    difficulty: "Advanced",
  },
  {
    id: "airline",
    icon: Plane,
    title: "Airline System",
    description: "Manage flight data: bookings, routes, passengers, airports, schedules",
    color: "#74B9FF",
    gradient: "linear-gradient(135deg, #74B9FF, #A29BFE)",
    topics: 15,
    difficulty: "Advanced",
  },
  {
    id: "library",
    icon: Book,
    title: "Library System",
    description: "Handle library data: books, members, borrowing, authors, publishers",
    color: "#FDCB6E",
    gradient: "linear-gradient(135deg, #FDCB6E, #FFB088)",
    topics: 15,
    difficulty: "Beginner",
  },
  {
    id: "social",
    icon: Database,
    title: "Social Network",
    description: "Query social data: users, posts, likes, comments, friendships, feeds",
    color: "#6C5CE7",
    gradient: "linear-gradient(135deg, #6C5CE7, #00D4AA)",
    topics: 15,
    difficulty: "Advanced",
  },
];

export function Learn() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
          Choose Your Learning Scenario
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Select a real-world scenario to practice SQL in context
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          
          return (
            <Link
              key={scenario.id}
              to={`/app/learn/${scenario.id}`}
              className="group block"
            >
              <div
                className="h-full p-6 rounded-2xl transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: scenario.gradient }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3
                  className="text-xl mb-2"
                  style={{ color: "var(--text-primary)", fontWeight: 700 }}
                >
                  {scenario.title}
                </h3>
                <p
                  className="text-sm mb-4 line-clamp-2"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                >
                  {scenario.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {scenario.topics} Topics
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          scenario.difficulty === "Beginner"
                            ? "var(--color-primary)"
                            : scenario.difficulty === "Intermediate"
                            ? "var(--color-secondary)"
                            : "var(--color-accent)",
                      }}
                    >
                      {scenario.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Info Section */}
      <div
        className="mt-12 p-6 rounded-2xl"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h2 className="text-xl mb-3" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
          💡 Why Learn with Scenarios?
        </h2>
        <ul className="space-y-2" style={{ color: "var(--text-secondary)" }}>
          <li className="flex items-start gap-2">
            <span style={{ color: "var(--color-primary)" }}>✓</span>
            <span>Learn SQL in real-world contexts you'll encounter in jobs</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "var(--color-primary)" }}>✓</span>
            <span>Practice with realistic data structures and relationships</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "var(--color-primary)" }}>✓</span>
            <span>Build domain-specific knowledge while mastering SQL</span>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: "var(--color-primary)" }}>✓</span>
            <span>Progress from beginner to advanced at your own pace</span>
          </li>
        </ul>
      </div>
    </div>
  );
}