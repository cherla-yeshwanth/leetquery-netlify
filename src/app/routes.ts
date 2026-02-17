import { createBrowserRouter } from "react-router";
import { Splash } from "./screens/Splash";
import Login from "./screens/Login";
import { SignUp } from "./screens/SignUp";
import { Onboarding } from "./screens/Onboarding";
import { Home } from "./screens/Home";
import { Learn } from "./screens/Learn";
import { ScenarioPath } from "./screens/ScenarioPath";
import { ModuleLesson } from "./screens/ModuleLesson";
import { Problems } from "./screens/Problems";
import { Editor } from "./screens/Editor";
import { Profile } from "./screens/Profile";
import { Leaderboard } from "./screens/Leaderboard";
import { Settings } from "./screens/Settings";
import { PlayAndLearn } from "./screens/PlayAndLearn";
import { Practice } from "./screens/Practice";
import { Guide } from "./screens/Guide";
import { Layout } from "./components/Layout";
import { RootLayout } from "./components/RootLayout";
import { AdminDashboard } from "./screens/admin/AdminDashboard";
import { FeatureFlags } from "./screens/admin/FeatureFlags";
import { UserManagement } from "./screens/admin/UserManagement";
import { Analytics } from "./screens/admin/Analytics";
import { ThemeManager } from "./screens/admin/ThemeManager";
import { ResetUsers } from "./screens/ResetUsers";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: Login,
      },
      {
        path: "/splash",
        Component: Splash,
      },
      {
        path: "/login/*",
        Component: Login,
      },
      {
        path: "/reset-users",
        Component: ResetUsers,
      },
      {
        path: "/signup/*",
        Component: SignUp,
      },
      {
        path: "/onboarding",
        Component: Onboarding,
      },
      {
        path: "/home",
        Component: Home,
      },
      {
        path: "/admin",
        Component: AdminDashboard,
      },
      {
        path: "/admin/feature-flags",
        Component: FeatureFlags,
      },
      {
        path: "/admin/users",
        Component: UserManagement,
      },
      {
        path: "/admin/analytics",
        Component: Analytics,
      },
      {
        path: "/admin/themes",
        Component: ThemeManager,
      },
      {
        path: "/app",
        Component: Layout,
        children: [
          {
            index: true,
            Component: Home,
          },
          {
            path: "learn",
            Component: Learn,
          },
          {
            path: "learn/:scenarioId",
            Component: ScenarioPath,
          },
          {
            path: "learn/:scenarioId/module/:moduleIndex",
            Component: ModuleLesson,
          },
          {
            path: "problems",
            Component: Problems,
          },
          {
            path: "problems/:id",
            Component: Editor,
          },
          {
            path: "profile",
            Component: Profile,
          },
          {
            path: "leaderboard",
            Component: Leaderboard,
          },
          {
            path: "settings",
            Component: Settings,
          },
          {
            path: "playandlearn",
            Component: PlayAndLearn,
          },
          {
            path: "practice",
            Component: Practice,
          },
          {
            path: "guide",
            Component: Guide,
          },
        ],
      },
    ],
  },
]);