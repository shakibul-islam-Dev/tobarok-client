"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Floating back/forward history controls.
 *
 * Tracks the session's navigation stack so the buttons enable/disable based on
 * real history availability (Back is disabled on the first page visited,
 * Forward is disabled when there is nothing ahead). Works with browser
 * back/forward as well as the in-app router.
 */
export default function HistoryNav() {
  const router = useRouter();
  const pathname = usePathname();

  const stackRef = useRef<string[]>([]);
  const indexRef = useRef(-1);
  const isPopRef = useRef(false);
  const mountedRef = useRef(false);

  const [canBack, setCanBack] = useState(false);
  const [canForward, setCanForward] = useState(false);

  // Seed the stack with the entry page so Back is never offered on it.
  useEffect(() => {
    stackRef.current = [pathname];
    indexRef.current = 0;
    mountedRef.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Detect back/forward (popstate) vs new navigation. The modal/overlay system
  // also calls history.back() without changing the pathname; the timeout clears
  // the flag so such events never corrupt the stack.
  useEffect(() => {
    const handlePopState = () => {
      isPopRef.current = true;
      setTimeout(() => {
        isPopRef.current = false;
      }, 0);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;

    if (isPopRef.current) {
      isPopRef.current = false;
      const stack = stackRef.current;
      const idx = indexRef.current;
      if (idx + 1 < stack.length && stack[idx + 1] === pathname) {
        indexRef.current = idx + 1;
      } else if (idx - 1 >= 0 && stack[idx - 1] === pathname) {
        indexRef.current = idx - 1;
      }
    } else {
      const stack = stackRef.current;
      stackRef.current = stack.slice(0, indexRef.current + 1);
      stackRef.current.push(pathname);
      indexRef.current += 1;
    }

    setCanBack(indexRef.current > 0);
    setCanForward(indexRef.current < stackRef.current.length - 1);
  }, [pathname]);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-neutral-200 bg-white p-1.5 shadow-lg">
      <button
        type="button"
        aria-label="Go back"
        title="Back"
        disabled={!canBack}
        onClick={() => router.back()}
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent"
      >
        <ArrowLeft size={17} />
      </button>
      <span className="h-5 w-px bg-neutral-200" />
      <button
        type="button"
        aria-label="Go forward"
        title="Forward"
        disabled={!canForward}
        onClick={() => router.forward()}
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-900 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-transparent"
      >
        <ArrowRight size={17} />
      </button>
    </div>
  );
}
