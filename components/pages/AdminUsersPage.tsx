"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ban,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { admin, useSession } from "@/lib/auth-client";
import { hasRole, ROLES, roleLabel, type Role } from "@/lib/permissions";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  banned: boolean | null;
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isSuper = hasRole(session?.user.role, "superadmin");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data, error: resError } = await admin.listUsers({
          query: { limit: 100 },
        });
        if (cancelled) return;
        if (resError) {
          setError(resError.message ?? "Could not load users");
        } else {
          setUsers(data?.users ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
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

  const setBusy = (id: string | null, msg?: string) => {
    setBusyId(id);
    setMessage(msg ?? null);
  };

  const handleSetRole = async (userId: string, role: Role) => {
    if (!isSuper) return;
    setBusy(userId);
    const { error: resError } = await admin.setRole({ userId, role });
    setBusy(null);
    if (resError) {
      setError(resError.message ?? "Could not change role");
      return;
    }
    setUsers((cur) =>
      cur.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    setMessage("Role updated successfully");
  };

  const handleBan = async (userId: string) => {
    setBusy(userId);
    const { error: resError } = await admin.banUser({ userId });
    setBusy(null);
    if (resError) {
      setError(resError.message ?? "Could not ban user");
      return;
    }
    setUsers((cur) =>
      cur.map((u) => (u.id === userId ? { ...u, banned: true } : u))
    );
    setMessage("User banned");
  };

  const handleUnban = async (userId: string) => {
    setBusy(userId);
    const { error: resError } = await admin.unbanUser({ userId });
    setBusy(null);
    if (resError) {
      setError(resError.message ?? "Could not unban user");
      return;
    }
    setUsers((cur) =>
      cur.map((u) => (u.id === userId ? { ...u, banned: false } : u))
    );
    setMessage("User unbanned");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Admin Panel", href: "/admin" }, { label: "Users" }]} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
          User Management
        </h1>
        <Link
          href="/admin"
          className="text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Back to Admin
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} />
          {message}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-neutral-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading users…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="bg-neutral-100/70 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  <th scope="col" className="px-6 py-3.5">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-neutral-400">
                      No users found.
                    </td>
                  </tr>
                )}
                {users.map((user) => {
                  const isSelf = user.id === session?.user.id;
                  return (
                    <tr key={user.id} className="hover:bg-neutral-50/50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-neutral-900">
                          {user.name}
                          {isSelf && (
                            <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                              You
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-400">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {isSuper && !isSelf ? (
                          <div className="relative inline-block">
                            <UserCog
                              size={14}
                              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                            />
                            <select
                              value={user.role ?? "user"}
                              disabled={busyId === user.id}
                              onChange={(e) =>
                                handleSetRole(user.id, e.target.value as Role)
                              }
                              className="cursor-pointer rounded-lg border border-neutral-200 bg-white py-1.5 pl-8 pr-8 text-xs font-medium outline-none transition-colors focus:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {roleLabel(r)}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              hasRole(user.role, "superadmin")
                                ? "bg-purple-100 text-purple-700"
                                : hasRole(user.role, "admin")
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {roleLabel(user.role)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            user.banned
                              ? "bg-red-100 text-red-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.banned ? "bg-red-500" : "bg-emerald-500"
                            }`}
                          />
                          {user.banned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isSelf && (
                          <>
                            {user.banned ? (
                              <button
                                type="button"
                                disabled={busyId === user.id}
                                onClick={() => handleUnban(user.id)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {busyId === user.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <ShieldCheck size={12} />
                                )}
                                Unban
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={busyId === user.id}
                                onClick={() => handleBan(user.id)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {busyId === user.id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Ban size={12} />
                                )}
                                Ban
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isSuper ? (
        <p className="mt-4 text-xs text-neutral-400">
          As a super admin you can change any user&apos;s role.
        </p>
      ) : (
        <p className="mt-4 text-xs text-neutral-400">
          Admins can manage users but cannot change roles.
        </p>
      )}
    </div>
  );
}
