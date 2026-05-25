import { Info, Library, Zap } from "lucide-react";
import { Card } from "./Card";

type QuickLinkCardProps = {
  title: string;
  variant: "library" | "zone";
  href: string;
};

export function QuickLinkCard({ title, variant, href }: QuickLinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full transition hover:scale-[1.02]"
    >
      <Card className="relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden p-4 hover:shadow-md">
        <span
          className="absolute right-3 top-3 rounded-full bg-amber-100 p-1 text-amber-600"
          aria-hidden
        >
          <Info className="h-3.5 w-3.5" />
        </span>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-xl ${
            variant === "zone"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-k12-sky text-k12-blue"
          }`}
        >
          {variant === "zone" ? (
            <Zap className="h-8 w-8" strokeWidth={1.5} />
          ) : (
            <Library className="h-8 w-8" strokeWidth={1.5} />
          )}
        </div>

        <p className="text-sm font-semibold text-slate-800">{title}</p>
      </Card>
    </a>
  );
}
