"use client";

import { usePathname } from "next/navigation";
import { ads } from "@/lib/ads";
import AdSlot from "./AdSlot";

interface AdBannersProps {
  position: "top" | "footer";
}

export default function AdBanners({ position }: AdBannersProps) {
  const pathname = usePathname();
  if (pathname === "/checkout") return null;

  return (
    <div
      className={
        position === "top"
          ? "border-b border-neutral-100 bg-neutral-50"
          : "bg-neutral-50"
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <AdSlot
          slot={position === "top" ? ads.topBanner : ads.footerBanner}
          className="mx-auto max-w-3xl"
        />
      </div>
    </div>
  );
}
