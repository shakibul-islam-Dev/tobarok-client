"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Loader2,
  Shield,
  ShieldCheck,
  Users,
  UserCog,
  ShieldAlert,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { admin, useSession } from "@/lib/auth-client";
import { hasRole, roleLabel } from "@/lib/permissions";

interface Stats {
  total: number;
  users: number;
  admins: number;
  banned: number;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: resError } = await admin.listUsers({
          query: { limit: 100 },
        });
        if (cancelled) return;
        if (resError) {
          setError(resError.message ?? "Could not load users");
          return;
        }
        const users = data?.users ?? [];
        setStats({
          total: data?.total ?? users.length,
          users: users.filter((u) => !hasRole(u.role, "admin")).length,
          admins: users.filter((u) => hasRole(u.role, "admin")).length,
          banned: users.filter((u) => u.banned).length,
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const role = session?.user.role;
  const isSuper = hasRole(role, "superadmin");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Admin Panel" }]} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
            Admin Panel
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Signed in as{" "}
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isSuper
                  ? "bg-purple-100 text-purple-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {roleLabel(role)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: stats?.total,
            icon: Users,
          },
          {
            label: "Regular Users",
            value: stats?.users,
            icon: ShieldAlert,
          },
          {
            label: "Admins",
            value: stats?.admins,
            icon: ShieldCheck,
          },
          {
            label: "Banned",
            value: stats?.banned,
            icon: Shield,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 text-neutral-400">
                <Icon size={18} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              {loading ? (
                <Loader2 size={22} className="mt-3 animate-spin text-neutral-300" />
              ) : (
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">
                  {stat.value ?? "—"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Link
          href="/admin/users"
          className="group rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-colors hover:border-neutral-900"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                User Management
              </h2>
              <p className="text-xs text-neutral-500">
                View, ban or change user roles
              </p>
            </div>
          </div>
        </Link>

        <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
              <UserCog size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Role Hierarchy
              </h2>
              <p className="text-xs text-neutral-500">
                user &lt; admin &lt; superadmin
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              User
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Admin
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-700">
              Super Admin
            </span>
          </div>
          {isSuper && (
            <p className="mt-4 text-xs text-neutral-500">
              As a super admin you can promote users and change roles.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
