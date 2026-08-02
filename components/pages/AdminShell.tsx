"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  ClipboardCheck,
  FolderTree,
  LayoutGrid,
  LogOut,
  MapPin,
  Receipt,
  Shield,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import { signOut, useSession } from "@/lib/auth-client";
import { hasRole, roleLabel } from "@/lib/permissions";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  crumbLabel: string;
  children: ReactNode;
}

export default function AdminShell({ crumbLabel, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const role = session?.user.role;
  const isSuper = hasRole(role, "superadmin");

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutGrid },
    { label: "Products", href: "/admin/products", icon: Boxes },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Hero Slides", href: "/admin/hero-slides", icon: SlidersHorizontal },
    { label: "Outlets", href: "/admin/outlets", icon: MapPin },
    {
      label: "Approvals",
      href: "/admin/products/approvals",
      icon: ClipboardCheck,
    },
    { label: "Sales & Orders", href: "/admin/orders", icon: Receipt },
  ];

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
    <>
      <DashboardSidebar
        topBarContent={
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                isSuper ? "bg-purple-600" : "bg-emerald-600"
              )}
            >
              <Shield size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-neutral-900">
                Admin
              </p>
              <p className="truncate text-xs text-neutral-400">
                {roleLabel(role)}
              </p>
            </div>
          </div>
        }
      >
        <div className="flex h-full flex-col overflow-hidden">
          <nav className="min-h-0 flex-1 overflow-y-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors",
                    active
                      ? "border-l-4 border-emerald-500 bg-neutral-100/70 text-neutral-900"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  <Icon
                    size={18}
                    className={active ? "text-neutral-900" : "text-neutral-400"}
                  />
                  {item.label}
                </Link>
              );
            })}
            {isSuper && (
              <Link
                href="/admin/users"
                className={cn(
                  "flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors",
                  pathname === "/admin/users"
                    ? "border-l-4 border-purple-500 bg-purple-50/70 text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <UserCog
                  size={18}
                  className={
                    pathname === "/admin/users"
                      ? "text-purple-600"
                      : "text-neutral-400"
                  }
                />
                Users
              </Link>
            )}
            <div className="mx-5 my-2 border-t border-neutral-100" />
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
      </DashboardSidebar>

      {/* ---- Main content ---- */}
      <div className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin" },
              { label: crumbLabel },
            ]}
          />

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </>
  );
}
