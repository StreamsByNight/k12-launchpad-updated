import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("K12 Launchpad error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f0f5fc] p-8">
          <h1 className="text-xl font-bold text-slate-900">
            Something went wrong
          </h1>
          <p className="max-w-md text-center text-sm text-slate-600">
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/";
            }}
            className="rounded-xl bg-k12-blue px-4 py-2 text-sm font-semibold text-white"
          >
            Clear session & reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
