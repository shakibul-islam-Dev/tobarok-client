"use client";

import { useState } from "react";
import { Lock, User } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitted, setSubmitted] = useState(false);

  const inputCls =
    "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

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
                setSubmitted(false);
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

        {submitted ? (
          <div className="mt-8 rounded-2xl bg-neutral-50 p-8 text-center">
            <p className="text-lg font-bold text-neutral-900">
              {mode === "login" ? "Welcome back!" : "Account created!"}
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              This is a demo — no backend is connected yet. Hook this form up
              to your API to make it real.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mt-8 space-y-4"
          >
            {mode === "register" && (
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
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
              className="w-full rounded-full bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
