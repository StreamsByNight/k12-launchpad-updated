import type { ReactNode, MouseEvent } from "react";
import { ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { openCanvasLink } from "../lib/navigation/openCanvasLink";

type ClickableRowProps = {
  href?: string;
  children: ReactNode;
  className?: string;
  showExternal?: boolean;
};

export function ClickableRow({
  href,
  children,
  className = "",
  showExternal = false,
}: ClickableRowProps) {
  const [opening, setOpening] = useState(false);
  const base = `group flex w-full items-center justify-between gap-2 rounded-xl border border-transparent text-left transition hover:border-k12-sky hover:bg-k12-sky/40 ${className}`;

  const canOpen = Boolean(href && href !== "#");

  async function handleClick(e: MouseEvent) {
    e.preventDefault();
    if (!canOpen || opening) return;

    setOpening(true);
    try {
      await openCanvasLink({ href: href! });
    } finally {
      setOpening(false);
    }
  }

  if (!canOpen) {
    return (
      <div className={base}>
        {children}
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={opening}
      className={`${base} cursor-pointer disabled:opacity-70`}
    >
      {children}
      <span className="flex shrink-0 items-center gap-1 text-k12-blue opacity-60 transition group-hover:opacity-100">
        {opening ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {showExternal && <ExternalLink className="h-3.5 w-3.5" />}
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </>
        )}
      </span>
    </button>
  );
}
