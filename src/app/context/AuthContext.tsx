import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth as useClerkAuth, useClerk, useUser } from "@clerk/clerk-react";
import * as api from "../services/api";

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

  // Register Clerk token provider for backend API requests
  useEffect(() => {
    api.setAuthTokenProvider(async () => {
      if (!isLoaded || !isSignedIn) return null;
      return await getToken();
    });

    return () => api.setAuthTokenProvider(null);
  }, [getToken, isLoaded, isSignedIn]);

  // Load/clear user profile based on Clerk auth state
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setUser(null);
      setLoading(false);
      return;
    }

    refreshProfile();
  }, [isLoaded, isSignedIn]);

  const refreshProfile = async () => {
    if (!isSignedIn) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { profile } = await api.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to load profile:", error);

      // Fallback minimal profile from Clerk if backend profile call is unavailable
      if (clerkUser) {
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