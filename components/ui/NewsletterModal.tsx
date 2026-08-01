"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { useBackClose } from "@/components/shared/useBackClose";

interface NewsletterModalProps {
  imageSrc?: string;
  onSubscribe?: (email: string) => void;
}

export default function NewsletterModal({
  imageSrc = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800", // Fallback fresh produce image
  onSubscribe,
}: NewsletterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const hideNewsletter = localStorage.getItem("hide_newsletter_popup");
    if (!hideNewsletter) {
      // Small delay to feel smooth on page load
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hide_newsletter_popup", "true");
    }
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (onSubscribe) {
      onSubscribe(email);
    }

    if (dontShowAgain) {
      localStorage.setItem("hide_newsletter_popup", "true");
    }
    setIsOpen(false);
  };

  useBackClose(isOpen, { onClose: handleClose, lockScroll: true });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative flex w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3.5 top-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="grid w-full grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Banner */}
          <div className="relative min-h-[280px] w-full bg-emerald-600 md:min-h-[360px]">
            <SmartImage
              src={imageSrc}
              alt="Fresh Organic Vegetables"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Right Column: Content & Input */}
          <div className="flex flex-col justify-center p-6 text-center md:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Subcribe to Our <br />
              Newsletter
            </h2>

            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              Subscribe to our newsletter and Save your{" "}
              <span className="font-bold text-amber-500">20% money</span> with
              discount code today.
            </p>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-xs focus-within:border-emerald-500">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-95"
                >
                  Subscribe
                </button>
              </div>

              {/* Do not show again checkbox */}
              <label className="inline-flex items-center justify-center gap-2 text-[11px] text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Do not show this window</span>
              </label>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
