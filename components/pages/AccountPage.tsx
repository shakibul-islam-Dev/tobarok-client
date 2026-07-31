"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, LogOut, User } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { signIn, signUp, signOut, useSession } from "@/lib/auth-client";

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3a7.17 7.17 0 0 1-10.72-3.78H1.36v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.35 14.31A7.21 7.21 0 0 1 4.91 12c0-.8.14-1.57.44-2.31V6.6H1.36a12 12 0 0 0 0 10.8l3.99-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.83c1.76 0 3.34.6 4.58 1.79l3.43-3.43A11.98 11.98 0 0 0 1.36 6.6l3.99 3.09A7.2 7.2 0 0 1 12 4.83Z"
      />
    </svg>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      if (mode === "login") {
        const { error: resError } = await signIn.email({ email, password });
        if (resError) {
          setError(resError.message ?? "Invalid email or password");
          return;
        }
      } else {
        const name = String(formData.get("name") ?? "");
        const confirm = String(formData.get("confirm") ?? "");
        if (password !== confirm) {
          setError("Passwords do not match");
          return;
        }
        const { error: resError } = await signUp.email({
          name,
          email,
          password,
        });
        if (resError) {
          setError(resError.message ?? "Could not create account");
          return;
        }
      }
      router.push("/account");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    await signIn.social({ provider: "google", callbackURL: "/account" });
  };

  const handleSignOut = async () => {
    await signOut({ fetchOptions: { onSuccess: () => router.refresh() } });
  };

  if (sessionLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <Breadcrumb items={[{ label: "Account" }]} />
        <div className="flex items-center justify-center gap-2 py-24 text-neutral-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <Breadcrumb items={[{ label: "Account" }]} />
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-center text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
            My Account
          </h1>
          <div className="mt-8 rounded-2xl bg-neutral-50 p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-white">
              <User size={28} />
            </div>
            <p className="mt-4 text-lg font-bold text-neutral-900">
              Welcome back, {session.user.name}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{session.user.email}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-xs font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Account" }]} />
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
          My Account
        </h1>

        <div className="mt-6 flex rounded-full border border-neutral-200 p-1">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 rounded-full py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                mode === m
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {m === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-neutral-200 bg-white py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:border-neutral-400"
          >
            <GoogleIcon size={16} />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 py-1">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              or
            </span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Full name"
                  className={`${inputCls} pl-11`}
                />
              </div>
            )}
            <div className="relative">
              <User
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className={`${inputCls} pl-11`}
              />
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                minLength={6}
                className={`${inputCls} pl-11`}
              />
            </div>
            {mode === "register" && (
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  name="confirm"
                  type="password"
                  required
                  placeholder="Confirm password"
                  minLength={6}
                  className={`${inputCls} pl-11`}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
