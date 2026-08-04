"use client";

import {
  LayoutGrid,
  LogIn,
  LogOut,
  MapPin,
  Shield,
  Tv,
  User,
  UserRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { signOut, useSession } from "@/lib/auth-client";
import { hasRole, roleLabel } from "@/lib/permissions";

const signedInItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Billing Address", href: "/billing-address", icon: MapPin },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Watch Ads & Earn", href: "/earn", icon: Tv },
  { label: "Profile Update", href: "/profile", icon: UserRound },
];

export default function UserMenu() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="p-2 text-neutral-900 transition-colors hover:text-neutral-500"
      >
        <User size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 top-full w-56 pt-2"
          >
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
              {session ? (
                <>
                  <div className="border-b border-neutral-100 px-3 py-2.5">
                    <p className="truncate text-sm font-bold text-neutral-900">
                      {session.user.name}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {session.user.email}
                    </p>
                    <span
                      className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        hasRole(session.user.role, "superadmin")
                          ? "bg-purple-100 text-purple-700"
                          : hasRole(session.user.role, "admin")
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {roleLabel(session.user.role)}
                    </span>
                  </div>
                  <div className="py-1">
                    {hasRole(session.user.role, "admin") && (
                      <Link
                        href="/admin/products"
                        onClick={() => setOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
                      >
                        <Shield size={16} className="text-neutral-400" />
                        Manage Store
                      </Link>
                    )}
                    {signedInItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          role="menuitem"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
                        >
                          <Icon size={16} className="text-neutral-400" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-neutral-100 pt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
                >
                  <LogIn size={16} className="text-neutral-400" />
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
