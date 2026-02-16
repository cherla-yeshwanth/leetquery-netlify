import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useThemeEngine } from "../context/ThemeEngineContext";
import * as api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { currentTheme } = useThemeEngine();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAILS = ["24eg110d55@anurag.edu.in", "yeshwanth3979@gmail.com"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Flow - Always redirect new users to onboarding
        if (!name.trim()) {
          setError("Please enter your name");
          setLoading(false);
          return;
        }
        await signUp(email, password, name);
        navigate("/onboarding");
      } else {
        // Sign In Flow - Smart redirect based on user type
        await signIn(email, password);
        
        // Check if user is admin
        if (ADMIN_EMAILS.includes(email.toLowerCase())) {
          navigate("/admin");
          return;
        }
        
        // Check if user has completed onboarding
        try {
          const result = await api.getProfile();
          const profile = result.profile;
          
          if (profile && profile.onboardingCompleted) {
            // Existing user - go to home
            navigate("/home");
          } else {
            // User hasn't completed onboarding - send them there
            navigate("/onboarding");
          }
        } catch (err: any) {
          console.error("Error fetching profile:", err);
          
          // If session expired, show error and don't navigate
          if (err.message?.includes("Session expired")) {
            setError("Session expired. Please try logging in again.");
            return;
          }
          
          // Default to onboarding if we can't check profile
          navigate("/onboarding");
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div
        className="w-full max-w-md p-8 rounded-3xl"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentTheme.branding.logo}</div>
          <h1
            className="text-3xl mb-2"
            style={{ color: "var(--text-primary)", fontWeight: 700 }}
          >
            {currentTheme.branding.logoText}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {currentTheme.branding.tagline}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: "var(--text-secondary)", fontWeight: 600 }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  border: "1px solid var(--color-border)",
                  color: "var(--text-primary)",
                }}
                placeholder="Enter your name"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: "var(--text-secondary)", fontWeight: 600 }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--color-border)",
                color: "var(--text-primary)",
              }}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: "var(--text-secondary)", fontWeight: 600 }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--color-border)",
                color: "var(--text-primary)",
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div
              className="p-3 rounded-xl text-sm text-center"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "var(--color-hard)",
                border: "1px solid var(--color-hard)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--color-cta)",
              color: "#FFFFFF",
            }}
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-sm transition-all hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}