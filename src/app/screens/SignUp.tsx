import { motion } from "motion/react";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

export function SignUp() {
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

        <div className="flex justify-center">
          <ClerkSignUp
            path="/signup"
            routing="path"
            signInUrl="/login"
            fallbackRedirectUrl="/splash"
          />
        </div>
      </motion.div>
    </div>
  );
}