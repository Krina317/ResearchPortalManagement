import { createContext, useContext, useEffect, useState, useCallback } from "react";

// CRA: REACT_APP_API_URL   |  Vite: swap for import.meta.env.VITE_API_URL
// Leave empty ("") to call /api on the same domain (recommended when hosted, see notes).
const API = process.env.REACT_APP_API_URL || "";

// TEMPORARY: while roles/permissions are being decided, skip the backend and log in as a fixed user.
// Set REACT_APP_MOCK_AUTH=false (or remove it) to use real Google login.
const MOCK = process.env.REACT_APP_MOCK_AUTH === "true";
const MOCK_USER = { name: "Jitendra Bhatia", email: "jitendrabhatia@nirmauni.ac.in" };
const MOCK_KEY = "forge_mock_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    if (MOCK) {
      try {
        const saved = localStorage.getItem(MOCK_KEY);
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
      setLoading(false);
      return;
    }
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Called with the Google ID token ("credential") from the Google button
  const loginWithGoogle = useCallback(async (credential) => {
    const res = await fetch(`${API}/api/auth/google`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Sign-in failed. Please try again.");
    setUser(data.user);
    return data.user;
  }, []);

  const loginMock = useCallback(() => {
    localStorage.setItem(MOCK_KEY, JSON.stringify(MOCK_USER));
    setUser(MOCK_USER);
  }, []);

  const logout = useCallback(async () => {
    if (MOCK) {
      localStorage.removeItem(MOCK_KEY);
      setUser(null);
      return;
    }
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    setUser(null);
    if (window.google?.accounts?.id) window.google.accounts.id.disableAutoSelect();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginMock, logout, MOCK }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);