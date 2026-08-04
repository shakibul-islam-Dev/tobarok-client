"use client";

import {
  AtSign,
  Globe,
  Mail,
  MapPin,
  MessageSquareShare,
  Phone,
  Send,
  Share2,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const shopLinks = [
  { title: "Drop Shoulder", link: "/collections/drop-shoulder" },
  { title: "Solid Basics", link: "/collections/solid" },
  { title: "Polo Perfection", link: "/collections/polo" },
  { title: "Winter Essentials", link: "/collections/winter" },
  { title: "Kiddo", link: "/collections/kiddo" },
  { title: "Accessories", link: "/accessories" },
];

const helpLinks = [
  { title: "Outlets", link: "/store-locator" },
  { title: "Track Order", link: "/track" },
  { title: "Custom / Bulk", link: "/custom" },
  { title: "FAQs", link: "/faq" },
  { title: "Size Chart", link: "/size-chart" },
  { title: "Contact Us", link: "/contact" },
];

const companyLinks = [
  { title: "About Us", link: "/about" },
  { title: "Terms & Conditions", link: "/terms" },
  { title: "Privacy Policy", link: "/privacy" },
  { title: "Return Policy", link: "/returns" },
];

const socials = [
  { icon: Share2, label: "Facebook", href: "#" },
  { icon: AtSign, label: "Instagram", href: "#" },
  { icon: MessageSquareShare, label: "YouTube", href: "#" },
  { icon: Globe, label: "Twitter", href: "#" },
];

const FooterComponent = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14">
        <div className="grid grid-cols-1 gap-10 border-b border-neutral-800 pb-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <ShoppingBag size={32} className="text-white" />
              <div>
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-white">
                  tobarok
                </h1>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Shopping &amp; Earn
                </p>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
              Premium quality t-shirts, polos and streetwear made to fit your
              vibe. Big drops, honest prices and a brand built with pride.
            </p>

            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="shrink-0 text-neutral-500" />
                Uttara, Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-neutral-500" />
                +880 1XXX-XXXXXX
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-neutral-500" />
                hello@tobarok.com
              </li>
            </ul>

            <div className="flex items-center gap-3 pt-1">
              {socials.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 text-neutral-400 transition-colors hover:border-white hover:bg-white hover:text-neutral-900"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm">
              {shopLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.link}
                    className="transition-colors hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Help
            </h3>
            <ul className="space-y-2.5 text-sm">
              {helpLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.link}
                    className="transition-colors hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.link}
                    className="transition-colors hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">
              Newsletter
            </h3>
            <p className="text-sm text-neutral-400">
              Subscribe to get early access to drops and exclusive discount
              offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-900 transition-colors hover:bg-neutral-300"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-6 text-xs text-neutral-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} tobarok. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href="/terms"
              className="transition-colors hover:text-neutral-300"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-neutral-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/returns"
              className="transition-colors hover:text-neutral-300"
            >
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
