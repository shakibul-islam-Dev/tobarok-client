"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AtSign,
  BadgeCheck,
  Calendar,
  Check,
  CircleAlert,
  Crown,
  Image as ImageIcon,
  Loader2,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BackButton from "@/components/ui/BackButton";
import ImageUploader from "@/components/ui/ImageUploader";
import { updateUser, useSession } from "@/lib/auth-client";
import { hasRole, roleLabel } from "@/lib/permissions";

const inputCls =
  "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user.name ?? "");
  const [image, setImage] = useState(session?.user.image ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageBroken, setImageBroken] = useState(false);

  const role = session?.user.role;
  const isAdmin = hasRole(role, "admin");
  const isSuper = hasRole(role, "superadmin");
  const createdAt = session?.user.createdAt;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const { error: resError } = await updateUser({
      name: name.trim(),
      image: image.trim() || null,
    });

    setLoading(false);
    if (resError) {
      setError(resError.message ?? "Could not update profile");
      return;
    }
    setMessage("Profile updated successfully");
  };

  const handleReset = () => {
    setName(session?.user.name ?? "");
    setImage(session?.user.image ?? "");
    setMessage(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Update your personal information and profile picture.
          </p>
        </div>
        <BackButton
          fallbackHref="/dashboard"
          label="Back to Dashboard"
          className="hidden items-center gap-1.5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900 sm:inline-flex"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Form ---- */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-center gap-2">
              <UserRound size={18} className="text-neutral-400" />
              <h2 className="text-base font-bold text-neutral-900">
                Personal Information
              </h2>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Changes are saved to your tobarok account.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Full Name
                </label>
                <div className="relative">
                  <UserRound
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setMessage(null);
                      setError(null);
                    }}
                    placeholder="Your full name"
                    className={`${inputCls} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Email Address
                </label>
                <div className="relative">
                  <AtSign
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    type="email"
                    value={session?.user.email ?? ""}
                    disabled
                    className={`${inputCls} cursor-not-allowed bg-neutral-50 pl-11 text-neutral-400`}
                  />
                </div>
                <p className="mt-1.5 text-xs text-neutral-400">
                  Your email is your login and cannot be changed from here.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Profile Picture
                  <span className="ml-1 font-normal normal-case text-neutral-400">
                    (optional)
                  </span>
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <ImageIcon
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => {
                        setImage(e.target.value);
                        setMessage(null);
                        setError(null);
                        setImageBroken(false);
                      }}
                      placeholder="https://example.com/avatar.jpg or /uploads/…"
                      className={`${inputCls} pl-11`}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <ImageUploader
                    value={image}
                    onChange={(value) => {
                      setImage(value);
                      setMessage(null);
                      setError(null);
                      setImageBroken(false);
                    }}
                    label="Upload picture"
                    hint="Choose a photo from your device"
                    hidePreview
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <CircleAlert size={16} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">Update failed</p>
                  <p className="mt-0.5 text-xs">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="shrink-0 text-red-400 transition-colors hover:text-red-600"
                  aria-label="Dismiss"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {message && (
              <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Check size={16} className="shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">{message}</p>
                  <p className="mt-0.5 text-xs">
                    Your changes are now live across tobarok.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMessage(null)}
                  className="shrink-0 text-emerald-400 transition-colors hover:text-emerald-600"
                  aria-label="Dismiss"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-8 py-3 text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* ---- Preview + account info ---- */}
        <div className="space-y-6">
          <div className="flex flex-col items-center rounded-2xl border border-neutral-200/80 bg-white p-6 text-center shadow-sm">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-neutral-100">
              {image && !imageBroken ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                  onError={() => setImageBroken(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-3xl font-extrabold text-white">
                  {getInitials(name || session?.user.name || "U")}
                </div>
              )}
            </div>
            <p className="mt-4 text-lg font-bold text-neutral-900">
              {name.trim() || "Your name"}
            </p>
            <p className="mt-0.5 break-all text-xs text-neutral-400">
              {session?.user.email ?? ""}
            </p>

            <span
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isSuper
                  ? "bg-purple-100 text-purple-700"
                  : isAdmin
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {isSuper ? <Crown size={11} /> : isAdmin ? <Shield size={11} /> : <UserRound size={11} />}
              {roleLabel(role)}
            </span>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
              <BadgeCheck size={15} />
              Account
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-neutral-500">Role</dt>
                <dd className="font-semibold capitalize text-neutral-900">
                  {roleLabel(role)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-500">Email</dt>
                <dd className="max-w-[55%] truncate font-semibold text-neutral-900">
                  {session?.user.email ?? "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-neutral-500">
                  <Calendar size={13} />
                  Member since
                </dt>
                <dd className="font-semibold text-neutral-900">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-5 space-y-2 border-t border-neutral-100 pt-4">
              <Link
                href="/dashboard"
                className="block w-full rounded-full bg-neutral-100 py-2.5 text-center text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/wallet"
                className="block w-full rounded-full border border-neutral-200 py-2.5 text-center text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-900"
              >
                Manage Wallet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
