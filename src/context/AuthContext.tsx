import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  getSession,
  normalizeCanvasUrl,
  saveSession,
} from "../lib/auth/session";
import {
  DEFAULT_CANVAS_URL,
  isOAuthReady,
  OAUTH_CLIENT_ID,
} from "../lib/auth/config";
import type { AuthMode, UserSession } from "../lib/auth/types";

type AuthContextValue = {
  session: UserSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  signInWithCanvas: (canvasUrl?: string) => void;
  signInDemo: () => void;
  signOut: () => void;
  oauthReady: boolean;
  defaultCanvasUrl: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(getSession());
    setLoading(false);
  }, []);

  const signInWithCanvas = useCallback((canvasUrl?: string) => {
    if (!OAUTH_CLIENT_ID) {
      throw new Error(
        "Canvas login is not set up yet. Ask your administrator to configure OAuth.",
      );
    }

    const raw = canvasUrl?.trim() || DEFAULT_CANVAS_URL;
    if (!raw) {
      throw new Error("Canvas URL is not configured for this site.");
    }

    const canvasBaseUrl = normalizeCanvasUrl(raw);
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = btoa(JSON.stringify({ canvasBaseUrl }));

    const authUrl = new URL(`${canvasBaseUrl}/login/oauth2/auth`);
    authUrl.searchParams.set("client_id", OAUTH_CLIENT_ID);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", state);

    window.location.href = authUrl.toString();
  }, []);

  const signInDemo = useCallback(() => {
    const newSession: UserSession = {
      mode: "demo",
      canvasBaseUrl: "",
      accessToken: "",
      userName: "Student",
    };
    saveSession(newSession);
    setSession(newSession);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: session !== null,
        loading,
        signInWithCanvas,
        signInDemo,
        signOut,
        oauthReady: isOAuthReady(),
        defaultCanvasUrl: DEFAULT_CANVAS_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export type { AuthMode };
