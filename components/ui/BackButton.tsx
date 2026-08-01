"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackHref?: string;
  className?: string;
  label?: string;
}

/**
 * Browser-history aware back button. Uses history.back() when there is a
 * previous page, otherwise falls back to the provided link so the user is
 * never left with a dead button (e.g. landing directly on a URL).
 */
export default function BackButton({
  fallbackHref = "/",
  className,
  label = "Back",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <a
      href={fallbackHref}
      onClick={handleClick}
      className={
        className ??
        "inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900"
      }
    >
      <ArrowLeft size={14} />
      {label}
    </a>
  );
}
