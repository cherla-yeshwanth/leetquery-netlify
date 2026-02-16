import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  signOut: () => void;
  refreshProfile: () => Promise<void>;
  updateUserStreak: () => Promise<void>;
  addUserXP: (xp: number) => Promise<void>;
  completeUserTopic: (topicId: string, difficulty: string, score: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if authenticated
  useEffect(() => {
    if (api.isAuthenticated()) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshProfile = async (clearOnFailure: boolean = true) => {
    try {
      setLoading(true);
      const { profile } = await api.getProfile();
      setUser(profile);
    } catch (error: any) {
      console.error("Failed to load profile:", error);
      // If token is invalid, expired, or unauthorized - clear auth and redirect
      if (
        clearOnFailure && (
          error.message?.includes("Unauthorized") || 
          error.message?.includes("401") ||
          error.message?.includes("Invalid JWT") ||
          error.message?.includes("JWT")
        )
      ) {
        console.log("Invalid or expired token detected, clearing authentication");
        api.signOut();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: authUser } = await api.signIn(email, password);
      
      // Check if this is the admin user
      if (email === "24eg110d55@anurag.edu.in" || email === "yeshwanth3979@gmail.com") {
        localStorage.setItem("userRole", "admin");
      }
      
      // Verify we have a token before fetching profile
      if (!api.isAuthenticated()) {
        throw new Error("Sign-in succeeded but no access token was received. Please try again.");
      }
      
      // Don't clear auth on profile failure during sign-in (token is fresh)
      await refreshProfile(false);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await api.signUp(email, password, name);
      // Auto sign in after signup
      await signIn(email, password);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = () => {
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