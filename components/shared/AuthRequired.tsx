"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Loader2, ShieldX } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { hasRole, type Role } from "@/lib/permissions";

interface AuthRequiredProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export default function AuthRequired({
  children,
  allowedRoles,
}: AuthRequiredProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-neutral-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-lg font-bold text-neutral-900">Please sign in</p>
        <p className="mt-2 text-sm text-neutral-500">
          You need to be signed in to view this page.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex items-center rounded-full bg-neutral-900 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
        >
          Login / Register
        </Link>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.some((r) => hasRole(session.user.role, r))) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldX size={26} />
        </div>
        <p className="mt-4 text-lg font-bold text-neutral-900">Access Denied</p>
        <p className="mt-2 text-sm text-neutral-500">
          You do not have permission to view this page.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center rounded-full bg-neutral-900 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
