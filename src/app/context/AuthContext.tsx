import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth as useClerkAuth, useClerk, useUser } from "@clerk/clerk-react";
import * as api from "../services/api";

type UserRole = "admin" | "user";

const AUTH_DEBUG = import.meta.env.DEV || import.meta.env.VITE_DEBUG_AUTH === "true";
const CLERK_JWT_TEMPLATE = import.meta.env.VITE_CLERK_JWT_TEMPLATE as string | undefined;
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "24eg110d55@anurag.edu.in,yeshwanth3979@gmail.com")
  .split(",")
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

function getRoleFromEmail(email?: string | null): UserRole {
  if (!email) return "user";
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";
}

function authDebug(message: string, data?: unknown) {
  if (!AUTH_DEBUG) return;
  if (data !== undefined) {
    console.log(`[AuthFlow] ${message}`, data);
    return;
  }
  console.log(`[AuthFlow] ${message}`);
}

interface UserProfile {
  userId: string;
  email: string;
  name: string;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  lastActiveDate: string | null;
  achievements: any[];
  completedTopics: any[];
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isSignedIn: boolean;
  isClerkLoaded: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUserStreak: () => Promise<void>;
  addUserXP: (xp: number) => Promise<void>;
  completeUserTopic: (topicId: string, difficulty: string, score: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const primaryEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || null;
  const role = getRoleFromEmail(primaryEmail);
  const isAdmin = role === "admin";

  // Register Clerk token provider for backend API requests
  useEffect(() => {
    authDebug("Registering API token provider", { isLoaded, isSignedIn });

    api.setAuthTokenProvider(async () => {
      if (!isLoaded || !isSignedIn) return null;

      let token = await getToken();

      if (!token && CLERK_JWT_TEMPLATE) {
        authDebug("Default Clerk token missing, trying template token", {
          template: CLERK_JWT_TEMPLATE,
        });
        token = await getToken({ template: CLERK_JWT_TEMPLATE } as any);
      }

      authDebug("Resolved auth token", {
        hasToken: !!token,
        usingTemplate: !!CLERK_JWT_TEMPLATE,
      });

      return token;
    });

    return () => {
      authDebug("Clearing API token provider");
      api.setAuthTokenProvider(null);
    };
  }, [getToken, isLoaded, isSignedIn]);

  // Load/clear user profile based on Clerk auth state
  useEffect(() => {
    authDebug("Clerk state changed", {
      isLoaded,
      isSignedIn,
      role,
      email: primaryEmail,
    });

    if (!isLoaded) return;

    if (!isSignedIn) {
      authDebug("No active session, clearing user profile");
      setUser(null);
      setLoading(false);
      return;
    }

    authDebug("Active session found, refreshing profile");
    refreshProfile();
  }, [isLoaded, isSignedIn, role, primaryEmail]);

  const refreshProfile = async () => {
    if (!isSignedIn) {
      authDebug("refreshProfile skipped (not signed in)");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      authDebug("Fetching profile from backend");
      setLoading(true);
      const { profile } = await api.getProfile();
      authDebug("Profile loaded", {
        userId: profile?.userId,
        email: profile?.email,
        role,
      });
      setUser(profile);
    } catch (error) {
      console.error("[AuthFlow] Failed to load profile:", error);

      // Fallback minimal profile from Clerk if backend profile call is unavailable
      if (clerkUser) {
        authDebug("Using Clerk fallback profile");
        setUser({
          userId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          name: clerkUser.fullName || clerkUser.username || "User",
          currentStreak: 0,
          longestStreak: 0,
          totalXP: 0,
          level: 1,
          lastActiveDate: null,
          achievements: [],
          completedTopics: [],
          createdAt: new Date().toISOString(),
        });
      }
    } finally {
      authDebug("Profile loading complete");
      setLoading(false);
    }
  };

  const signIn = async (_email: string, _password: string) => {
    throw new Error("Use Clerk Sign In screen at /login");
  };

  const signUp = async (_email: string, _password: string, _name: string) => {
    throw new Error("Use Clerk Sign Up screen at /signup");
  };

  const signOut = async () => {
    authDebug("Signing out user");
    await clerkSignOut();
    api.signOut();
    setUser(null);
  };

  const updateUserStreak = async () => {
    try {
      const { profile } = await api.updateStreak();
      setUser(profile);
    } catch (error) {
      console.error("Failed to update streak:", error);
    }
  };

  const addUserXP = async (xp: number) => {
    try {
      const { profile } = await api.addXP(xp);
      setUser(profile);
    } catch (error) {
      console.error("Failed to add XP:", error);
    }
  };

  const completeUserTopic = async (topicId: string, difficulty: string, score: number) => {
    try {
      const { profile } = await api.completeTopic(topicId, difficulty, score);
      setUser(profile);
      
      // Award XP based on difficulty and score
      const xpMap = { easy: 50, medium: 100, hard: 150 };
      const baseXP = xpMap[difficulty as keyof typeof xpMap] || 50;
      const earnedXP = Math.round((baseXP * score) / 100);
      
      await addUserXP(earnedXP);
      await updateUserStreak();
    } catch (error) {
      console.error("Failed to complete topic:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isSignedIn: !!isSignedIn,
        isClerkLoaded: !!isLoaded,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        updateUserStreak,
        addUserXP,
        completeUserTopic,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}