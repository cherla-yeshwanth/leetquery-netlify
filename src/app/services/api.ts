const SUPABASE_PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_PROJECT_ID || !SUPABASE_ANON_KEY) {
  throw new Error("Missing required environment variables: VITE_SUPABASE_PROJECT_ID and VITE_SUPABASE_ANON_KEY");
}

const API_BASE = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-19914029`;
const DEBUG_API = import.meta.env.DEV;

// Helper to get access token from localStorage
function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

// Helper to make authenticated requests
async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any,
  useAuth: boolean = true
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // Always send anon key for the Supabase Edge Function gateway
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  };

  if (useAuth) {
    const token = getAccessToken();
    if (token) {
      // Send user's access token in a custom header (gateway only checks Authorization)
      headers["X-User-Token"] = token;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const url = `${API_BASE}${endpoint}`;
    if (DEBUG_API) {
      console.log(`API Request: ${method} ${url}`);
    }
    
    const response = await fetch(url, options);
    
    if (DEBUG_API) {
      console.log(`API Response Status: ${response.status} ${response.statusText}`);
    }
    
    // Try to parse JSON response
    let data;
    try {
      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error("Empty response from server");
      }
      
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      throw new Error(`Invalid JSON response from server (${response.status})`);
    }

    if (!response.ok) {
      console.error(`API Error (${response.status}):`, data);
      
      // Handle 401 Unauthorized - don't auto-signOut here, let the caller decide
      if (response.status === 401) {
        console.log("Received 401 Unauthorized");
        throw new Error(data.message || data.error || "Unauthorized");
      }
      
      throw new Error(data.error || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Request Failed for ${method} ${endpoint}:`, error);
    throw error;
  }
}

// ==================== AUTH API ====================

export async function signUp(email: string, password: string, name: string) {
  return apiRequest("/auth/signup", "POST", { email, password, name }, false);
}

export async function signIn(email: string, password: string) {
  // Clear any stale tokens before signing in
  signOut();
  
  const data = await apiRequest("/auth/signin", "POST", { email, password }, false);
  
  // Store access token and user info
  if (data.session && data.session.access_token) {
    localStorage.setItem("accessToken", data.session.access_token);
    localStorage.setItem("userEmail", data.user.email);
    localStorage.setItem("userId", data.user.id);
  } else {
    console.warn("Sign-in response missing session or access_token:", JSON.stringify(data).substring(0, 300));
  }
  
  return data;
}

export function signOut() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ==================== PROFILE API ====================

export async function getProfile() {
  return apiRequest("/profile", "GET");
}

export async function updateProfile(updates: any) {
  return apiRequest("/profile", "PUT", updates);
}

// ==================== PROGRESS API ====================

export async function updateStreak() {
  return apiRequest("/progress/streak", "POST");
}

export async function addXP(xp: number) {
  return apiRequest("/progress/xp", "POST", { xp });
}

export async function completeTopic(topicId: string, difficulty: string, score: number) {
  return apiRequest("/progress/complete-topic", "POST", { topicId, difficulty, score });
}

export async function getProgress() {
  return apiRequest("/progress", "GET");
}

// ==================== LEADERBOARD API ====================

export async function getLeaderboard() {
  return apiRequest("/leaderboard", "GET");
}

// ==================== ADMIN API ====================

export async function getAdminStats() {
  return apiRequest("/admin/stats", "GET");
}

export async function getAllUsers() {
  return apiRequest("/admin/users", "GET");
}

export async function deleteUser(userId: string) {
  return apiRequest(`/admin/users/${userId}`, "DELETE");
}

export async function deleteAllUsers() {
  return apiRequest("/admin/delete-all-users", "DELETE");
}