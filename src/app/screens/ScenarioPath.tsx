import { useParams, Link } from "react-router";
import { Check, Lock, ChevronLeft, Play } from "lucide-react";

const scenarioData: Record<string, any> = {
  student: {
    title: "Student Management System",
    description: "Master SQL with a university database schema",
    modules: [
      { emoji: "🏗️", title: "CREATE Tables (Students, Courses, Enrollments)", completed: 0, total: 3, status: "unlocked", difficulty: "Easy" },
      { emoji: "📝", title: "INSERT Student & Course Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "📋", title: "SELECT Basic Student Records", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🔍", title: "WHERE - Filter by Major, Year, GPA", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "📊", title: "ORDER BY - Sort Students & Courses", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🧮", title: "Aggregate Functions - Count, Avg GPA", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "📦", title: "GROUP BY - Students per Department", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔗", title: "JOINs - Students with Enrollments", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🎯", title: "Subqueries - Top Students, Prerequisites", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🪟", title: "Window Functions - Rank by GPA", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "✏️", title: "UPDATE - Modify Student Records & Grades", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🗑️", title: "DELETE - Remove Inactive Students", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔧", title: "ALTER - Add/Modify Table Columns", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🧹", title: "TRUNCATE - Clear Enrollment Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "💥", title: "DROP - Remove Tables & Cleanup", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
    ],
  },
  employee: {
    title: "Employee & HR System",
    description: "Work with employee, department, and salary data",
    modules: [
      { emoji: "🏗️", title: "CREATE Tables (Employees, Departments, Salaries)", completed: 0, total: 3, status: "unlocked", difficulty: "Easy" },
      { emoji: "📝", title: "INSERT Employee & Department Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "👥", title: "SELECT Basic Employee Information", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🔍", title: "WHERE - Filter by Department, Role, Salary", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "💰", title: "ORDER BY - Sort by Salary & Hire Date", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "📈", title: "Aggregate Functions - Salary Statistics", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🏢", title: "GROUP BY - Analyze by Department", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔗", title: "JOINs - Employees with Departments", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "👔", title: "Subqueries - Manager Hierarchy Analysis", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🪟", title: "Window Functions - Salary Ranking", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "✏️", title: "UPDATE - Modify Salary & Promotions", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🗑️", title: "DELETE - Remove Terminated Employees", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔧", title: "ALTER - Add Performance Review Columns", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🧹", title: "TRUNCATE - Clear Temporary Tables", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "💥", title: "DROP - Remove Tables & Cleanup", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
    ],
  },
  movie: {
    title: "Movie Database",
    description: "Query movies, actors, directors, and ratings",
    modules: [
      { emoji: "🏗️", title: "CREATE Tables (Movies, Actors, Directors)", completed: 0, total: 3, status: "unlocked", difficulty: "Easy" },
      { emoji: "📝", title: "INSERT Movie & Cast Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🎬", title: "SELECT Basic Movie Information", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🔍", title: "WHERE - Filter by Genre, Year, Rating", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "⭐", title: "ORDER BY - Sort by Rating & Revenue", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🧮", title: "Aggregate Functions - Box Office Stats", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🎭", title: "GROUP BY - Movies by Genre & Studio", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔗", title: "JOINs - Movies with Cast & Crew", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🎯", title: "Subqueries - Top Rated & Award Winners", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🪟", title: "Window Functions - Actor Filmography Rank", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "✏️", title: "UPDATE - Modify Ratings & Reviews", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🗑️", title: "DELETE - Remove Cancelled Productions", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔧", title: "ALTER - Add Streaming Platform Info", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🧹", title: "TRUNCATE - Clear Draft Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "💥", title: "DROP - Remove Tables & Cleanup", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
    ],
  },
  ecommerce: {
    title: "E-Commerce Platform",
    description: "Manage products, orders, customers, and inventory",
    modules: [
      { emoji: "🏗️", title: "CREATE Tables (Products, Orders, Customers)", completed: 0, total: 3, status: "unlocked", difficulty: "Easy" },
      { emoji: "📝", title: "INSERT Product & Customer Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🛍️", title: "SELECT Basic Product Catalog", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🔍", title: "WHERE - Filter by Category, Price, Stock", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "📦", title: "ORDER BY - Sort Products & Orders", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "💵", title: "Aggregate Functions - Sales & Revenue", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "📊", title: "GROUP BY - Sales by Category & Region", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔗", title: "JOINs - Orders with Products & Customers", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "👤", title: "Subqueries - Top Customers & Products", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🪟", title: "Window Functions - Product Sales Ranking", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "✏️", title: "UPDATE - Modify Inventory & Prices", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🗑️", title: "DELETE - Remove Cancelled Orders", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔧", title: "ALTER - Add Discount & Promo Columns", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🧹", title: "TRUNCATE - Clear Shopping Cart Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "💥", title: "DROP - Remove Tables & Cleanup", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
    ],
  },
  hospital: {
    title: "Hospital & Healthcare",
    description: "Work with patients, doctors, appointments, and treatments",
    modules: [
      { emoji: "🏗️", title: "CREATE Tables (Patients, Doctors, Appointments)", completed: 0, total: 3, status: "unlocked", difficulty: "Easy" },
      { emoji: "📝", title: "INSERT Patient & Doctor Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🏥", title: "SELECT Basic Patient Records", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🔍", title: "WHERE - Filter by Diagnosis, Date, Doctor", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "👨‍⚕️", title: "ORDER BY - Sort by Appointment & Priority", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "📊", title: "Aggregate Functions - Patient Statistics", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "💊", title: "GROUP BY - Analyze by Department & Ward", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔗", title: "JOINs - Patients with Treatments", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "📅", title: "Subqueries - Doctor Availability Analysis", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🪟", title: "Window Functions - Patient Wait Time", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "✏️", title: "UPDATE - Modify Treatment Plans", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🗑️", title: "DELETE - Remove Old Records (HIPAA)", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔧", title: "ALTER - Add Insurance Info Columns", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🧹", title: "TRUNCATE - Clear Temporary Logs", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "💥", title: "DROP - Remove Tables & Cleanup", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
    ],
  },
  airline: {
    title: "Airline Reservation System",
    description: "Manage flights, bookings, passengers, and routes",
    modules: [
      { emoji: "🏗️", title: "CREATE Tables (Flights, Bookings, Passengers)", completed: 0, total: 3, status: "unlocked", difficulty: "Easy" },
      { emoji: "📝", title: "INSERT Flight & Booking Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "✈️", title: "SELECT Basic Flight Information", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🔍", title: "WHERE - Filter by Route, Date, Status", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🌍", title: "ORDER BY - Sort by Destination & Time", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🎫", title: "Aggregate Functions - Booking Statistics", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "📊", title: "GROUP BY - Flights by Airline & Class", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔗", title: "JOINs - Bookings with Passengers", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🛫", title: "Subqueries - Connecting Flights Logic", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🪟", title: "Window Functions - Flight Occupancy Rank", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "✏️", title: "UPDATE - Modify Seat Assignments", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🗑️", title: "DELETE - Cancel Bookings & Refunds", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔧", title: "ALTER - Add Loyalty Program Columns", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🧹", title: "TRUNCATE - Clear Old Flight Logs", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "💥", title: "DROP - Remove Tables & Cleanup", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
    ],
  },
  library: {
    title: "Library Management System",
    description: "Handle books, members, borrowing, and publishers",
    modules: [
      { emoji: "🏗️", title: "CREATE Tables (Books, Members, Loans)", completed: 0, total: 3, status: "unlocked", difficulty: "Easy" },
      { emoji: "📝", title: "INSERT Book & Member Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "📚", title: "SELECT Basic Book Catalog", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🔍", title: "WHERE - Filter by Author, Genre, Year", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "📖", title: "ORDER BY - Sort by Popularity & Rating", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "📊", title: "Aggregate Functions - Loan Statistics", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🏷️", title: "GROUP BY - Books by Category & Publisher", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔗", title: "JOINs - Loans with Books & Members", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "📅", title: "Subqueries - Overdue Books Analysis", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🪟", title: "Window Functions - Popular Books Ranking", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "✏️", title: "UPDATE - Modify Loan Due Dates", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🗑️", title: "DELETE - Remove Damaged Books", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔧", title: "ALTER - Add Digital Copy Columns", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🧹", title: "TRUNCATE - Clear Return History", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "💥", title: "DROP - Remove Tables & Cleanup", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
    ],
  },
  social: {
    title: "Social Network Platform",
    description: "Query users, posts, likes, comments, and friendships",
    modules: [
      { emoji: "🏗️", title: "CREATE Tables (Users, Posts, Friendships)", completed: 0, total: 3, status: "unlocked", difficulty: "Easy" },
      { emoji: "📝", title: "INSERT User & Post Data", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "👤", title: "SELECT Basic User Profiles", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "🔍", title: "WHERE - Filter by Location, Age, Interests", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "📱", title: "ORDER BY - Sort Posts by Engagement", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "💬", title: "Aggregate Functions - Engagement Stats", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "📊", title: "GROUP BY - Posts by Topic & Hashtag", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔗", title: "JOINs - Users with Posts & Friends", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "❤️", title: "Subqueries - Viral Content Analysis", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🪟", title: "Window Functions - Trending Posts Rank", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "✏️", title: "UPDATE - Modify User Profiles", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🗑️", title: "DELETE - Remove Spam & Banned Users", completed: 0, total: 3, status: "locked", difficulty: "Medium" },
      { emoji: "🔧", title: "ALTER - Add Privacy Settings Columns", completed: 0, total: 3, status: "locked", difficulty: "Hard" },
      { emoji: "🧹", title: "TRUNCATE - Clear Notification Queue", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
      { emoji: "💥", title: "DROP - Remove Tables & Cleanup", completed: 0, total: 3, status: "locked", difficulty: "Easy" },
    ],
  },
};

export function ScenarioPath() {
  const { scenarioId } = useParams();
  const scenario = scenarioData[scenarioId || ""];

  if (!scenario) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-center">
        <h1 className="text-2xl" style={{ color: "var(--text-primary)" }}>
          Scenario not found
        </h1>
        <Link to="/app/learn" className="text-sm" style={{ color: "var(--color-primary)" }}>
          Back to scenarios
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back Button */}
      <Link
        to="/app/learn"
        className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl transition-all hover:scale-105"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--color-border)",
          color: "var(--text-secondary)",
        }}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Scenarios</span>
      </Link>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl mb-2" style={{ color: "var(--text-primary)", fontWeight: 800 }}>
          {scenario.title}
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {scenario.description}
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-6 relative">
        {/* Connecting Line */}
        <div
          className="absolute left-8 top-12 bottom-12 w-0.5 hidden md:block"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {scenario.modules.map((module: any, index: number) => {
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
                  backgroundColor: "var(--bg-card)",
                  border: `2px solid ${
                    isCompleted
                      ? "var(--color-primary)"
                      : isActive
                      ? "var(--color-accent)"
                      : "var(--color-border)"
                  }`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 relative z-10"
                    style={{
                      backgroundColor: isCompleted
                        ? "var(--color-primary)"
                        : isActive
                        ? "var(--color-accent)"
                        : "var(--bg-elevated)",
                    }}
                  >
                    {isLocked ? (
                      <Lock className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                    ) : isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <span>{module.emoji}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                            {module.title}
                          </h3>
                          <span
                            className="px-2 py-1 text-xs rounded-lg font-medium"
                            style={{
                              backgroundColor:
                                module.difficulty === "Easy"
                                  ? "rgba(0, 212, 170, 0.15)"
                                  : module.difficulty === "Medium"
                                  ? "rgba(108, 92, 231, 0.15)"
                                  : "rgba(255, 176, 136, 0.15)",
                              color:
                                module.difficulty === "Easy"
                                  ? "var(--color-primary)"
                                  : module.difficulty === "Medium"
                                  ? "var(--color-secondary)"
                                  : "var(--color-accent)",
                            }}
                          >
                            {module.difficulty}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          {module.completed} / {module.total} lessons completed
                        </p>
                      </div>

                      {!isLocked && (
                        <Link to={`/app/learn/${scenarioId}/module/${index}`}>
                          <button
                            className="px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            style={{
                              background: isCompleted
                                ? "var(--bg-elevated)"
                                : "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                              color: isCompleted ? "var(--text-secondary)" : "white",
                            }}
                          >
                            <Play className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {isCompleted ? "Review" : isActive ? "Continue" : "Start"}
                            </span>
                          </button>
                        </Link>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--bg-elevated)" }}
                    >
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${progress}%`,
                          background: isCompleted
                            ? "var(--color-primary)"
                            : "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}