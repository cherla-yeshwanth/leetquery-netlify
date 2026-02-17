import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeEngineProvider } from "./context/ThemeEngineContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FeatureFlagsProvider } from "./context/FeatureFlagsContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <ThemeEngineProvider>
      <ThemeProvider>
        <FeatureFlagsProvider>
          <RouterProvider router={router} />
        </FeatureFlagsProvider>
      </ThemeProvider>
    </ThemeEngineProvider>
  );
}