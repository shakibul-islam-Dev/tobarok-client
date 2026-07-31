"use client";
import { ShoppingBag, Send } from "lucide-react";
import Link from "next/link";

const FooterComponent = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Info Column (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <ShoppingBag size={36} className="text-indigo-400 shrink-0" />
              <div>
                <h1 className="font-bold text-2xl leading-none text-white tracking-tight">
                  tobarok
                </h1>
                <p className="font-semibold text-xs text-slate-400 mt-1">
                  Shopping <span className="text-indigo-400">&amp;</span> Earn
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your one-stop destination for seamless shopping and rewarding
              daily earnings. Quality products delivered straight to your door.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="#"
                className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors"
                aria-label=""
              ></Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors"
                aria-label=""
              ></Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors"
                aria-label=""
              ></Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors"
                aria-label=""
              ></Link>
            </div>
          </div>

          {/* Helpful Links Column */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold text-base tracking-wider uppercase text-xs">
              Helpful Links
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Shop Products
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/earn"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Earn Program
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-indigo-400 transition-colors"
                >
                  FAQs &amp; Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support Column */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold text-base tracking-wider uppercase text-xs">
              Company
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-indigo-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/complaints"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Submit a Complaint
                </Link>
              </li>
              <li>
                <Link
                  href="/sponsors"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Sponsors &amp; Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold text-base tracking-wider uppercase text-xs">
              Newsletter
            </h2>
            <p className="text-sm text-slate-400">
              Subscribe to receive update alerts and special discount offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} tobarok. All rights reserved.</p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/terms"
              className="hover:text-slate-400 transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/privacy"
              className="hover:text-slate-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="hover:text-slate-400 transition-colors"
            >
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
