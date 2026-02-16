import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeEngineProvider } from "./context/ThemeEngineContext";
import { FeatureFlagsProvider } from "./context/FeatureFlagsContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <ThemeEngineProvider>
      <FeatureFlagsProvider>
        <RouterProvider router={router} />
      </FeatureFlagsProvider>
    </ThemeEngineProvider>
  );
}