// Contesto di autenticazione.
// Con il backend attivo usa la sessione a cookie di Spring Security
// (/api/auth/me, POST /auth/login, POST /logout, POST /api/auth/register).
// Se il backend non è raggiungibile entra in "modalità demo": la sessione
// viene tenuta in localStorage e i dati mostrati sono quelli dimostrativi.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  fetchMe,
  isNetworkError,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "./api";
import type { CurrentUserDTO, RegisterRequest } from "./types";

const DEMO_USER_KEY = "siw-demo-user";

interface AuthContextValue {
  user: CurrentUserDTO | null;
  loading: boolean;
  /** true quando il backend non risponde e l'app usa i dati dimostrativi */
  demo: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readDemoUser(): CurrentUserDTO | null {
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY);
    return raw ? (JSON.parse(raw) as CurrentUserDTO) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch((e) => {
        if (!cancelled && isNetworkError(e)) {
          setDemo(true);
          setUser(readDemoUser());
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      if (demo) {
        // In anteprima: l'username "admin" ottiene il ruolo ADMIN.
        const demoUser: CurrentUserDTO = {
          id: 1,
          username,
          name: username,
          surname: "Demo",
          role: username.trim().toLowerCase() === "admin" ? "ADMIN" : "USER",
        };
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
        return;
      }
      await loginRequest(username, password);
      setUser(await fetchMe());
    },
    [demo],
  );

  const logout = useCallback(async () => {
    if (demo) {
      localStorage.removeItem(DEMO_USER_KEY);
      setUser(null);
      return;
    }
    await logoutRequest();
    setUser(null);
  }, [demo]);

  const register = useCallback(
    async (data: RegisterRequest) => {
      if (demo) {
        // In modalità demo la registrazione equivale a un accesso dimostrativo.
        const demoUser: CurrentUserDTO = {
          id: 1,
          username: data.username,
          name: data.name,
          surname: data.surname,
          role: "USER",
        };
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
        return;
      }
      await registerRequest(data);
    },
    [demo],
  );

  return (
    <AuthContext.Provider value={{ user, loading, demo, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro <AuthProvider>");
  return ctx;
}
