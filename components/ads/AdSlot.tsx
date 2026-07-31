"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT } from "@/lib/ads";
import { cn } from "@/lib/utils";

type AdFormat = "horizontal" | "rectangle" | "vertical";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slot: string;
  format?: AdFormat;
  className?: string;
}

const minHeight: Record<AdFormat, string> = {
  horizontal: "min-h-[60px] sm:min-h-[90px]",
  rectangle: "min-h-[250px]",
  vertical: "min-h-[250px] lg:min-h-[600px]",
};

export default function AdSlot({
  slot,
  format = "horizontal",
  className,
}: AdSlotProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (!window.adsbygoogle) return;

    try {
      window.adsbygoogle.push({});
    } catch (err) {
      console.error("AdSense failed to load:", err);
    }
  }, []);

  return (
    <div ref={wrapperRef} className={cn("w-full", className)}>
      <span className="mb-1.5 block text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
        Advertisement
      </span>
      <div
        className={cn(
          "flex w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-50",
          minHeight[format]
        )}
      >
        <ins
          className="adsbygoogle block w-full"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
