"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  RefreshCw,
  MapPin,
  Shield,
  Wallet,
  UserRound,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { hasRole, roleLabel } from "@/lib/permissions";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Order History", href: "/orders", icon: RefreshCw },
  { label: "Billing Address", href: "/billing-address", icon: MapPin },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Profile Update", href: "/profile", icon: UserRound },
];

const recentOrders = [
  {
    id: "#738",
    date: "8 Sep, 2020",
    total: "$135.00",
    items: "5 Products",
    status: "Processing",
  },
  {
    id: "#703",
    date: "24 May, 2020",
    total: "$25.00",
    items: "1 Product",
    status: "on the way",
  },
  {
    id: "#130",
    date: "22 Oct, 2020",
    total: "$250.00",
    items: "4 Products",
    status: "Completed",
  },
  {
    id: "#561",
    date: "1 Feb, 2020",
    total: "$35.00",
    items: "1 Products",
    status: "Completed",
  },
  {
    id: "#536",
    date: "21 Sep, 2020",
    total: "$578.00",
    items: "13 Products",
    status: "Completed",
  },
  {
    id: "#492",
    date: "22 Oct, 2020",
    total: "$345.00",
    items: "7 Products",
    status: "Completed",
  },
];

export default function UserDashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  const role = session?.user.role;
  const admin = hasRole(role, "admin");

  const handleSignOut = async () => {
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="h-fit overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
          <div className="border-b border-neutral-100 p-5">
            <h2 className="text-lg font-bold text-neutral-800">Navigation</h2>
          </div>
          <nav className="py-2">
            {admin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
              >
                <Shield size={18} className="text-neutral-400" />
                Admin Panel
              </Link>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                    item.href === "/dashboard"
                      ? "border-l-4 border-emerald-500 bg-neutral-100/70 text-neutral-900"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      item.href === "/dashboard"
                        ? "text-neutral-900"
                        : "text-neutral-400"
                    }
                  />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
            >
              <LogOut size={18} className="text-neutral-400" />
              Log-out
            </button>
          </nav>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200/80 bg-white p-6 text-center shadow-sm">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-900 text-white">
                <UserRound size={36} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-neutral-900">
                {session?.user.name ?? "Customer"}
              </h3>
              <span
                className={`mt-1.5 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  hasRole(role, "superadmin")
                    ? "bg-purple-100 text-purple-700"
                    : hasRole(role, "admin")
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {roleLabel(role)}
              </span>
              <Link
                href="/profile"
                className="mt-3 text-sm font-semibold text-emerald-500 transition-colors hover:text-emerald-600"
              >
                Edit Profile
              </Link>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  BILLING ADDRESS
                </span>
                <h3 className="mt-2 text-base font-bold text-neutral-900">
                  {session?.user.name ?? "Your name"}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                  No billing address saved yet.
                </p>
                <p className="mt-3 text-xs text-neutral-700">
                  {session?.user.email ?? ""}
                </p>
              </div>
              <Link
                href="/billing-address"
                className="mt-4 inline-block text-sm font-semibold text-emerald-500 transition-colors hover:text-emerald-600"
              >
                Edit Address
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-lg font-bold text-neutral-900">
                Recent Order History
              </h2>
              <Link
                href="/orders"
                className="text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead>
                  <tr className="bg-neutral-100/70 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    <th scope="col" className="px-6 py-3.5">
                      ORDER ID
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      DATE
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      TOTAL
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      STATUS
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/50">
                      <td className="px-6 py-4 font-medium text-neutral-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-neutral-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-neutral-900">
                          {order.total}
                        </span>{" "}
                        <span className="text-neutral-400">
                          ({order.items})
                        </span>
                      </td>
                      <td className="px-6 py-4 text-neutral-600">
                        {order.status}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/orders/${order.id.replace("#", "")}`}
                          className="font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
