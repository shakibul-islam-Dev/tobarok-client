"use client";

import { useEffect, useRef } from "react";

interface BackCloseOptions {
  onClose: () => void;
  lockScroll?: boolean;
}

/**
 * Makes an overlay (modal / drawer) behave like native UI:
 *  - locks page scroll while open
 *  - closes on Escape
 *  - closes when the browser Back button is pressed instead of navigating away
 *
 * While the overlay is open a sentinel history entry is pushed so Back returns
 * to the same page and simply dismisses the overlay. The sentinel is popped
 * again when the overlay closes, keeping the history stack balanced.
 */
export function useBackClose(
  open: boolean,
  { onClose, lockScroll = true }: BackCloseOptions
) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    if (lockScroll) {
      document.body.style.overflow = "hidden";
    }

    window.history.pushState({ __overlay: true }, "");

    const handlePopState = () => {
      onCloseRef.current();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;

      // If the sentinel we pushed is still the active entry, step back past it.
      if (window.history.state?.__overlay) {
        window.history.back();
      }
    };
  }, [open, lockScroll]);
}
