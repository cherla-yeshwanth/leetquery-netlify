import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeft, Search, Filter, MoreVertical, Ban, UserCheck, Mail, Shield, Trash2 } from "lucide-react";
import * as api from "../../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  level: number;
  xp: number;
  streak: number;
  problemsSolved: number;
  joinDate: string;
  lastActive: string;
  status: "active" | "inactive" | "banned";
}

export function UserManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "user" | "admin">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "banned">("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{ success: boolean; message: string } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);

  useEffect(() => {
    // Only fetch if authenticated
    if (api.isAuthenticated()) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getAllUsers();
      setUsers(data.users);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      
      // If unauthorized, redirect to login
      if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
        api.signOut();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteAllUsers = async () => {
    setIsDeleting(true);
    setDeleteResult(null);
    
    try {
      const response = await api.deleteAllUsers();
      setDeleteResult({
        success: true,
        message: `Successfully deleted ${response.deletedCount} non-admin users. ${response.remainingUsers} user(s) remaining.`,
      });
      
      // Refresh user list
      await fetchUsers();
      
      // Close dialog after 3 seconds
      setTimeout(() => {
        setShowDeleteDialog(false);
        setDeleteResult(null);
      }, 3000);
    } catch (error: any) {
      setDeleteResult({
        success: false,
        message: error.message || "Failed to delete users. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    setDeleteResult(null);
    
    try {
      await api.deleteUser(userToDelete.id);
      setDeleteResult({
        success: true,
        message: `Successfully deleted user: ${userToDelete.email}`,
      });
      
      // Refresh user list
      await fetchUsers();
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setShowDeleteUserDialog(false);
        setUserToDelete(null);
        setDeleteResult(null);
      }, 2000);
    } catch (error: any) {
      setDeleteResult({
        success: false,
        message: error.message || "Failed to delete user. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                User Management
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {filteredUsers.length} users found
              </p>
            </div>
          </div>
          
          {/* Delete All Users Button */}
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all hover:opacity-80"
            style={{
              backgroundColor: "var(--color-hard)",
              color: "white",
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete All Users
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255, 71, 87, 0.2)" }}
              >
                <Trash2 className="w-6 h-6" style={{ color: "var(--color-hard)" }} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Delete All Users
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete all non-admin users? This will permanently remove all user accounts, profiles, and progress data except for the admin account (24eg110d55@anurag.edu.in).
            </p>

            {deleteResult && (
              <div
                className="mb-4 p-4 rounded-xl"
                style={{
                  backgroundColor: deleteResult.success
                    ? "rgba(0, 212, 170, 0.2)"
                    : "rgba(255, 71, 87, 0.2)",
                  color: deleteResult.success ? "var(--color-easy)" : "var(--color-hard)",
                }}
              >
                {deleteResult.message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteResult(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  opacity: isDeleting ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllUsers}
                disabled={isDeleting || deleteResult?.success}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: "var(--color-hard)",
                  color: "white",
                  opacity: isDeleting || deleteResult?.success ? 0.5 : 1,
                }}
              >
                {isDeleting ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Dialog */}
      {showDeleteUserDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255, 71, 87, 0.2)" }}
              >
                <Trash2 className="w-6 h-6" style={{ color: "var(--color-hard)" }} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Delete User
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete the user: {userToDelete?.email}? This will permanently remove the user account, profile, and progress data.
            </p>

            {deleteResult && (
              <div
                className="mb-4 p-4 rounded-xl"
                style={{
                  backgroundColor: deleteResult.success
                    ? "rgba(0, 212, 170, 0.2)"
                    : "rgba(255, 71, 87, 0.2)",
                  color: deleteResult.success ? "var(--color-easy)" : "var(--color-hard)",
                }}
              >
                {deleteResult.message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteUserDialog(false);
                  setUserToDelete(null);
                  setDeleteResult(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  opacity: isDeleting ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting || deleteResult?.success}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: "var(--color-hard)",
                  color: "white",
                  opacity: isDeleting || deleteResult?.success ? 0.5 : 1,
                }}
              >
                {isDeleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 rounded-2xl outline-none"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--color-border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            {["all", "user", "admin"].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role as typeof filterRole)}
                className="px-4 py-3 rounded-2xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: filterRole === role ? "var(--color-primary)" : "var(--bg-card)",
                  color: filterRole === role ? "var(--bg-base)" : "var(--text-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {["all", "active", "inactive", "banned"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as typeof filterStatus)}
                className="px-4 py-3 rounded-2xl text-sm font-medium transition-all"
                style={{
                  backgroundColor: filterStatus === status ? "var(--color-secondary)" : "var(--bg-card)",
                  color: filterStatus === status ? "white" : "var(--text-secondary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-12 gap-4 p-5 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="col-span-3 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              User
            </div>
            <div className="col-span-2 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Level / XP
            </div>
            <div className="col-span-2 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Progress
            </div>
            <div className="col-span-2 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Last Active
            </div>
            <div className="col-span-2 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Status
            </div>
            <div className="col-span-1 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Actions
            </div>
          </div>

          {/* Table Body */}
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-12 gap-4 p-5 border-b hover:bg-[var(--bg-elevated)] transition-colors"
              style={{ borderColor: "var(--color-border)" }}
            >
              {/* User */}
              <div className="col-span-3 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{
                    background:
                      user.role === "admin"
                        ? "linear-gradient(135deg, var(--color-xp), var(--color-streak))"
                        : "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
                    color: "var(--bg-base)",
                  }}
                >
                  {user.role === "admin" ? <Shield className="w-5 h-5" /> : user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {user.name}
                  </p>
                  <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Level / XP */}
              <div className="col-span-2 flex flex-col justify-center">
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  Level {user.level}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {user.xp.toLocaleString()} XP
                </p>
              </div>

              {/* Progress */}
              <div className="col-span-2 flex flex-col justify-center">
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {user.problemsSolved} Solved
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {user.streak} day streak
                </p>
              </div>

              {/* Last Active */}
              <div className="col-span-2 flex flex-col justify-center">
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {user.lastActive}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor:
                      user.status === "active"
                        ? "rgba(0, 212, 170, 0.2)"
                        : user.status === "banned"
                        ? "rgba(255, 71, 87, 0.2)"
                        : "rgba(155, 165, 188, 0.2)",
                    color:
                      user.status === "active"
                        ? "var(--color-easy)"
                        : user.status === "banned"
                        ? "var(--color-hard)"
                        : "var(--text-muted)",
                  }}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end">
                {user.role !== "admin" ? (
                  <button
                    onClick={() => {
                      setUserToDelete(user);
                      setShowDeleteUserDialog(true);
                    }}
                    className="p-2 rounded-xl hover:bg-[rgba(255,71,87,0.1)] transition-colors"
                    style={{ color: "var(--color-hard)" }}
                    title="Delete user"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="p-2">
                    <Shield className="w-5 h-5" style={{ color: "var(--color-xp)" }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              No users found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}