import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useThemeEngine } from "../context/ThemeEngineContext";
import { useAuth } from "../context/AuthContext";

export function Splash() {
  const navigate = useNavigate();
  const { currentTheme } = useThemeEngine();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        // Redirect to home if authenticated, otherwise to login
        if (user) {
          navigate("/home");
        } else {
          navigate("/login");
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [navigate, user, loading]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{
            filter: [
              `drop-shadow(0 0 20px ${currentTheme.colors.primary}80)`,
              `drop-shadow(0 0 40px ${currentTheme.colors.primary}B3)`,
              `drop-shadow(0 0 20px ${currentTheme.colors.primary}80)`,
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-7xl mb-4">{currentTheme.branding.logo}</div>
          <h1
            className="text-5xl md:text-6xl mb-4"
            style={{ color: "var(--color-primary)", fontWeight: 800 }}
          >
            {currentTheme.branding.logoText}
          </h1>
        </motion.div>
        <p className="text-lg italic" style={{ color: "var(--text-muted)" }}>
          {currentTheme.branding.tagline}
        </p>
      </motion.div>

      <motion.div
        className="flex gap-2 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "var(--color-primary)" }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}