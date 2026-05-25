import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveSession } from "../lib/auth/session";
import type { UserSession } from "../lib/auth/types";

export function AuthCallbackPage() {
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    async function completeOAuth() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const oauthError = params.get("error");

      if (oauthError) {
        setError(oauthError);
        return;
      }

      if (!code || !state) {
        setError("Missing authorization code");
        return;
      }

      try {
        const { canvasBaseUrl } = JSON.parse(atob(state)) as {
          canvasBaseUrl: string;
        };
        const redirectUri = `${window.location.origin}/auth/callback`;

        const res = await fetch("/api/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, canvasBaseUrl, redirectUri }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ?? "Token exchange failed",
          );
        }

        const { access_token, user } = (await res.json()) as {
          access_token: string;
          user?: { name: string; short_name: string };
        };

        const session: UserSession = {
          mode: "canvas",
          canvasBaseUrl,
          accessToken: access_token,
          userName: user?.short_name || user?.name,
        };
        saveSession(session);
        window.location.replace("/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign in failed");
      }
    }

    completeOAuth();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => {
            signOut();
            window.location.href = "/";
          }}
          className="rounded-xl bg-k12-blue px-4 py-2 text-white"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-600">Signing you in…</p>
    </div>
  );
}
