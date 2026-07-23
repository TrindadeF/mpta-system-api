import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "../api/client";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mpta_token");
    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest<{ user: User }>("/api/v1/session")
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("mpta_token");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const data = await apiRequest<{ token: string; user: User }>("/api/v1/session", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    localStorage.setItem("mpta_token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("mpta_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
