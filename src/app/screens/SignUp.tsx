import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, label: "" };
    if (pass.length < 6) return { strength: 33, label: "Weak", color: "var(--color-hard)" };
    if (pass.length < 10) return { strength: 66, label: "Medium", color: "var(--color-medium)" };
    return { strength: 100, label: "Strong", color: "var(--color-easy)" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      navigate("/onboarding");
    } catch (err: any) {
      console.error("Sign up error:", err);
      if (err.message?.includes("already been registered") || err.message?.includes("email_exists")) {
        setError("An account with this email already exists. Please sign in instead.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1
            className="text-5xl mb-2"
            style={{ color: "var(--color-primary)", fontWeight: 800 }}
          >
            LeetQuery
          </h1>
          <p className="text-lg italic" style={{ color: "var(--text-muted)" }}>
            Master SQL, One Query at a Time
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl outline-none transition-all"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--text-primary)",
            }}
            required
            autoFocus
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl outline-none transition-all"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--text-primary)",
            }}
            required
          />

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--color-border)",
                color: "var(--text-primary)",
              }}
              required
            />
            {password && (
              <div className="mt-2">
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-elevated)" }}>
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${passwordStrength.strength}%`,
                      backgroundColor: passwordStrength.color,
                    }}
                  />
                </div>
                <p className="text-sm mt-1" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl outline-none transition-all"
            style={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--text-primary)",
            }}
            required
          />

          <button
            type="submit"
            className="w-full px-6 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]"
            style={{
              backgroundColor: "var(--color-cta)",
              color: "#4A2C1C",
            }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {error && (
          <div className="text-center mt-4">
            <p className="text-sm" style={{ color: "var(--color-hard)" }}>
              {error}
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <p style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}