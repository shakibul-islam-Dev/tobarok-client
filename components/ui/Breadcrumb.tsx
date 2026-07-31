import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const crumbs = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i === 0 && <Home size={12} className="text-neutral-400" />}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="text-neutral-500 transition-colors hover:text-neutral-900"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={isLast ? "font-semibold text-neutral-900" : "text-neutral-500"}
              >
                {crumb.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight size={12} className="text-neutral-300" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
