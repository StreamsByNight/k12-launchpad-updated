import { useState } from "react";
import { BookOpen, LogIn, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { signInWithCanvas, signInDemo, oauthReady, defaultCanvasUrl } =
    useAuth();
  const [error, setError] = useState<string | null>(null);

  function handleSignIn() {
    setError(null);
    try {
      signInWithCanvas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-k12-sky via-[#f0f5fc] to-white p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-k12-blue text-white">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">K12 Launchpad</h1>
          <p className="mt-2 text-slate-600">
            Sign in with your Canvas username and password
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50">
          {oauthReady ? (
            <>
              <p className="mb-4 text-center text-sm text-slate-500">
                You&apos;ll sign in at{" "}
                <span className="font-medium text-k12-blue">
                  {defaultCanvasUrl.replace(/^https?:\/\//, "")}
                </span>
                — no access tokens needed.
              </p>
              <button
                type="button"
                onClick={handleSignIn}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-k12-blue py-3.5 text-sm font-semibold text-white transition hover:bg-k12-blue-hover"
              >
                <LogIn className="h-5 w-5" />
                Sign in with Canvas
              </button>
            </>
          ) : (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-medium">Canvas login not configured</p>
              <p className="mt-1 text-amber-800">
                Add your Developer Key to <code>.env.local</code> and restart{" "}
                <code>npm run dev</code>.
              </p>
            </div>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={signInDemo}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            Try demo (no account needed)
          </button>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Run <code className="text-slate-500">npm run dev</code> (starts web +
          API). Uses Canvas single sign-on.
        </p>
      </div>
    </div>
  );
}
