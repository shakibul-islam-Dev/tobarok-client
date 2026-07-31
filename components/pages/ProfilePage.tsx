"use client";

import { useState } from "react";
import { Check, Loader2, User, UserRound } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { updateUser, useSession } from "@/lib/auth-client";

const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user.name ?? "");
  const [image, setImage] = useState(session?.user.image ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Profile Update" }]} />
      <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
        Profile Update
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <UserRound size={18} className="text-neutral-400" />
              <h2 className="text-base font-bold text-neutral-900">
                Personal Information
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <div className="relative">
                <User
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
                  placeholder="Full name"
                  className={`${inputCls} pl-11`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Profile Image URL
                  <span className="ml-1 font-normal normal-case text-neutral-400">
                    (optional)
                  </span>
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    setMessage(null);
                    setError(null);
                  }}
                  placeholder="https://example.com/avatar.jpg"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Email
                </label>
                <input
                  type="email"
                  value={session?.user.email ?? ""}
                  disabled
                  className={`${inputCls} cursor-not-allowed bg-neutral-50 text-neutral-400`}
                />
                <p className="mt-1 text-xs text-neutral-400">
                  Email cannot be changed from here.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {message && (
              <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <Check size={16} />
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Save Changes
            </button>
          </form>
        </div>

        <div className="h-fit rounded-xl border border-neutral-200/80 bg-white p-6 text-center shadow-sm">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt="Profile preview"
              className="mx-auto h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-900 text-white">
              <User size={36} />
            </div>
          )}
          <p className="mt-4 text-lg font-bold text-neutral-900">
            {name || "Your name"}
          </p>
          <p className="text-xs text-neutral-400">
            {session?.user.email ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
}
