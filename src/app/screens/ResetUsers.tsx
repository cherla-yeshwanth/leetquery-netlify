import { useState } from "react";

const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const RESET_ADMIN_EMAIL = import.meta.env.VITE_RESET_ADMIN_EMAIL;
const RESET_ADMIN_PASSWORD = import.meta.env.VITE_RESET_ADMIN_PASSWORD;
const RESET_SECRET = import.meta.env.VITE_RESET_SECRET;

export function ResetUsers() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    if (!SUPABASE_PROJECT_ID || !SUPABASE_ANON_KEY || !RESET_ADMIN_EMAIL || !RESET_ADMIN_PASSWORD || !RESET_SECRET) {
      setError("❌ Missing required reset environment variables.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-19914029/admin/reset-all-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            adminEmail: RESET_ADMIN_EMAIL,
            adminPassword: RESET_ADMIN_PASSWORD,
            resetSecret: RESET_SECRET,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Clear all localStorage to remove any old sessions
        localStorage.clear();
        
        setMessage(
          `✅ Success! Reset complete.\\n\\nDeleted ${data.deletedProfileCount} profiles\\n${data.adminCreated ? 'Created new admin' : 'Updated admin password'}\\n\\nEmail: ${data.adminEmail}\\nPassword: ${RESET_ADMIN_PASSWORD}\\n\\n⚠️ All old sessions cleared. Please go to /login to sign in.`
        );
        console.log("Reset successful:", data);
      } else {
        setError(`❌ Error: ${data.error || "Unknown error"}`);
        console.error("Reset failed:", data);
      }
    } catch (err) {
      setError(`❌ Network error: ${err}`);
      console.error("Reset exception:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="max-w-md w-full p-8 rounded-2xl" style={{ backgroundColor: "var(--bg-elevated)" }}>
        <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--text-primary)" }}>
          🔄 Reset All Users
        </h1>

        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "var(--bg-base)" }}>
          <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
            This will:
          </p>
          <ul className="text-sm space-y-1" style={{ color: "var(--text-secondary)" }}>
            <li>• Delete ALL existing users (including admin)</li>
            <li>• Create fresh admin account</li>
            <li className="font-semibold mt-2" style={{ color: "var(--color-primary)" }}>
              Email: {RESET_ADMIN_EMAIL || "(set VITE_RESET_ADMIN_EMAIL)"}
            </li>
            <li className="font-semibold" style={{ color: "var(--color-primary)" }}>
              Password: {RESET_ADMIN_PASSWORD || "(set VITE_RESET_ADMIN_PASSWORD)"}
            </li>
          </ul>
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#1A1A2E",
          }}
        >
          {loading ? "Resetting..." : "Reset All Users & Create Admin"}
        </button>

        {message && (
          <div className="mt-4 p-4 rounded-lg whitespace-pre-line" style={{ backgroundColor: "#00D4AA20", color: "var(--color-primary)" }}>
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "#FF484820", color: "#FF4848" }}>
            {error}
          </div>
        )}

        <p className="text-xs text-center mt-6" style={{ color: "var(--text-muted)" }}>
          After reset, go to /login to sign in with the new admin credentials
        </p>
      </div>
    </div>
  );
}