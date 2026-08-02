"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  children: React.ReactNode;
  topBarContent?: React.ReactNode;
  asideClassName?: string;
}

/**
 * Responsive dashboard sidebar shell.
 *
 * - Large screens (lg+): a fixed full-height sidebar on the left (sits below
 *   the storefront's sticky nav, hence z-30). `topBarContent` is shown as the
 *   header and `children` (the nav) scrolls beneath it.
 * - Tablet & mobile: a floating menu button opens a drawer that slides in from
 *   the right side of the screen.
 */
export default function DashboardSidebar({
  children,
  topBarContent,
  asideClassName,
}: DashboardSidebarProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  // Closing on any anchor navigation keeps the drawer in sync with the route
  // without effect-driven setState.
  const handleNavClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) {
      close();
    }
  };

  return (
    <>
      {/* Fixed sidebar — large screens */}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-30 hidden flex-col overflow-hidden border-r border-neutral-200/80 bg-white shadow-sm lg:flex",
          asideClassName ?? "w-72"
        )}
      >
        <div className="shrink-0 border-b border-neutral-100 p-4">
          {topBarContent}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </aside>

      {/* Floating menu button — tablet & mobile (kept clear of the global
          back/forward control pinned to the bottom-right) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-neutral-700 lg:hidden"
      >
        <Menu size={16} />
        Menu
      </button>

      {/* Right-side drawer — tablet & mobile */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          !open && "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={close}
        />
        <aside
          className={cn(
            "absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3">
            <div className="min-w-0 flex-1">{topBarContent}</div>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="shrink-0 rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <X size={18} />
            </button>
          </div>
          <div
            className="min-h-0 flex-1 overflow-hidden"
            onClick={handleNavClick}
          >
            {children}
          </div>
        </aside>
      </div>
    </>
  );
}

