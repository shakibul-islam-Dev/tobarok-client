import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  link?: { label: string; href: string };
  align?: "left" | "center";
}

export default function SectionHeading({
  title,
  subtitle,
  link,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-7 flex flex-wrap items-end justify-between gap-4 ${
        align === "center" ? "text-center" : ""
      }`}
    >
      <div className={align === "center" ? "mx-auto" : ""}>
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 max-w-xl text-sm text-neutral-500">
            {subtitle}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:text-neutral-500"
        >
          {link.label}
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
