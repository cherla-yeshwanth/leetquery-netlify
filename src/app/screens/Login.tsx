import { useEffect } from "react";
import { useNavigate } from "react-router";
import { SignIn } from "@clerk/clerk-react";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useThemeEngine } from "../context/ThemeEngineContext";

export default function Login() {
  const { currentTheme } = useThemeEngine();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useClerkAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/splash", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

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
        <div className="flex justify-center">
          <SignIn
            path="/login"
            routing="path"
            signUpUrl="/signup"
            transferable={true}
            fallbackRedirectUrl="/splash"
            forceRedirectUrl="/splash"
            signUpFallbackRedirectUrl="/splash"
            signUpForceRedirectUrl="/splash"
          />
        </div>
      </div>
    </div>
  );
}