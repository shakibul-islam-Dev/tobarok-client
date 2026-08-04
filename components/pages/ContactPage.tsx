"use client";

import { useState } from "react";
import { Check, Mail, MapPin, Phone } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const inputCls =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Contact" }]} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Have a question about an order, a product or a partnership? Drop us
            a message and we&apos;ll get back to you within 24 hours.
          </p>
          <ul className="mt-6 space-y-4 text-sm text-neutral-600">
            <li className="flex items-center gap-3">
              <MapPin size={17} className="shrink-0 text-neutral-900" />
              Mirpur, Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-3">
              <Phone size={17} className="shrink-0 text-neutral-900" />
              +880 1XXX-XXXXXX
            </li>
            <li className="flex items-center gap-3">
              <Mail size={17} className="shrink-0 text-neutral-900" />
              hello@tobarok.com
            </li>
          </ul>
          <p className="mt-6 rounded-xl bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-500">
            Support hours: Saturday – Thursday, 10:00 AM – 10:00 PM.
          </p>
        </div>

        <div className="lg:col-span-3">
          {submitted ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-50 p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
                <Check size={24} />
              </span>
              <h2 className="mt-4 text-xl font-bold text-neutral-900">
                Message sent!
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Thanks for reaching out — we&apos;ll reply soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4 rounded-2xl border border-neutral-200 p-6"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input required placeholder="Your name" className={inputCls} />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  className={inputCls}
                />
              </div>
              <input required placeholder="Subject" className={inputCls} />
              <textarea
                required
                rows={5}
                placeholder="Your message..."
                className={inputCls}
              />
              <button
                type="submit"
                className="w-full rounded-full bg-neutral-900 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 sm:w-auto sm:px-10"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
