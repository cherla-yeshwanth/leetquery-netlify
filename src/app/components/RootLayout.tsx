import { Outlet } from "react-router";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";

const AUTH_DEBUG = import.meta.env.DEV || import.meta.env.VITE_DEBUG_AUTH === "true";

function authDebug(message: string, data?: unknown) {
  if (!AUTH_DEBUG) return;
  if (data !== undefined) {
    console.log(`[AuthFlow][Router] ${message}`, data);
    return;
  }
  console.log(`[AuthFlow][Router] ${message}`);
}

function RouteGuardController() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isClerkLoaded, isSignedIn, role } = useAuth();

  useEffect(() => {
    if (!isClerkLoaded) {
      authDebug("Route guard waiting for Clerk", { path: location.pathname });
      return;
    }

    const path = location.pathname;
    const onSplash = path === "/splash";
    const onLoginOrSignup = path === "/login" || path.startsWith("/login/") || path === "/signup" || path.startsWith("/signup/");
    const onAdminArea = path === "/admin" || path.startsWith("/admin/");
    const onAppArea = path === "/app" || path.startsWith("/app/") || path === "/home";

    authDebug("Evaluating route", {
      path,
      isSignedIn,
      role,
    });

    if (path === "/") {
      authDebug("Root path hit, redirecting to splash");
      navigate("/splash", { replace: true });
      return;
    }

    if (!isSignedIn && !onSplash && !onLoginOrSignup) {
      authDebug("Anonymous user blocked from protected route", { from: path, to: "/login" });
      navigate("/login", { replace: true });
      return;
    }

    if (isSignedIn && onLoginOrSignup) {
      authDebug("Signed-in user should not stay on auth pages", { from: path, to: "/splash" });
      navigate("/splash", { replace: true });
      return;
    }

    if (isSignedIn && role !== "admin" && onAdminArea) {
      authDebug("Non-admin blocked from admin route", { from: path, to: "/app" });
      navigate("/app", { replace: true });
      return;
    }

    if (isSignedIn && role === "admin" && onAppArea) {
      authDebug("Admin redirected to admin area", { from: path, to: "/admin" });
      navigate("/admin", { replace: true });
      return;
    }
  }, [isClerkLoaded, isSignedIn, role, location.pathname, navigate]);

  return null;
}

export function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuardController />
      <Outlet />
    </AuthProvider>
  );
}
