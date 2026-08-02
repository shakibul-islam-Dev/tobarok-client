"use client";

import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navigationLinks, type NavLink } from "@/lib/data";
import { useStore } from "@/components/store/StoreProvider";
import UserMenu from "@/components/shared/UserMenu";
import { useBackClose } from "@/components/shared/useBackClose";

function DesktopItem({ item }: { item: NavLink }) {
  const [open, setOpen] = useState(false);

  const triggerCls =
    "flex items-center gap-1 px-3 py-2 text-sm font-medium tracking-wide transition-colors hover:text-neutral-500";

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {item.columns ? (
        <>
          <button className={`${triggerCls} ${open ? "text-neutral-500" : ""}`}>
            {item.title}
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-1/2 top-full w-screen max-w-3xl -translate-x-1/2 pt-2"
              >
                <div className="grid grid-cols-4 gap-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
                  {item.columns.map((column) => (
                    <div key={column.title}>
                      <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-neutral-500">
                        {column.title}
                      </p>
                      <ul className="space-y-1.5">
                        {column.items.map((sub) => (
                          <li key={sub.title}>
                            <Link
                              href={sub.link}
                              className="text-sm text-neutral-700 transition-colors hover:text-black"
                            >
                              {sub.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : item.submenu ? (
        <>
          <button className={`${triggerCls} ${open ? "text-neutral-500" : ""}`}>
            {item.title}
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                className="absolute left-1/2 top-full w-60 -translate-x-1/2 pt-2"
              >
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.title}
                      href={sub.link}
                      className="block rounded-lg px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link href={item.link || "#"} className={triggerCls}>
          {item.title}
        </Link>
      )}
    </div>
  );
}

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount } = useStore();

  const toggleMenu = () => {
    setIsOpen((v) => !v);
    setOpenSubmenu(null);
  };

  useBackClose(isOpen, { onClose: toggleMenu, lockScroll: true });
  useBackClose(searchOpen, {
    onClose: () => setSearchOpen(false),
    lockScroll: false,
  });

  const toggleMobileSubmenu = (title: string) => {
    setOpenSubmenu((cur) => (cur === title ? null : title));
  };

  return (
    <>
      <div className="bg-neutral-950 text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-[11px] sm:text-xs">
          <p className="truncate font-medium tracking-wide">
            You&apos;re in BD&apos;s Biggest Drop Shoulder Lineup.
          </p>
          <div className="hidden shrink-0 items-center gap-5 text-neutral-300 md:flex">
            <Link
              href="/store-locator"
              className="transition-colors hover:text-white"
            >
              Outlets
            </Link>
            <Link href="/track" className="transition-colors hover:text-white">
              Track Order
            </Link>
            <Link href="/custom" className="transition-colors hover:text-white">
              Custom/Bulk
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleMenu}
              type="button"
              aria-label="Toggle Navigation"
              className="p-2 text-neutral-900 hover:text-neutral-500 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              <ShoppingBag size={28} className="text-neutral-900" />
              <div>
                <h1 className="text-2xl font-extrabold leading-none tracking-tight">
                  Tabarok
                </h1>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Shopping &amp; Earn
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center lg:flex">
            {navigationLinks.map((item) => (
              <DesktopItem key={item.title} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-neutral-900 transition-colors hover:text-neutral-500"
            >
              <Search size={20} />
            </button>
            <UserMenu />
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden p-2 text-neutral-900 transition-colors hover:text-neutral-500 sm:block"
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-2 text-neutral-900 transition-colors hover:text-neutral-500"
            >
              <ShoppingBag size={20} />
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-900 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-neutral-200 bg-white"
            >
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4"
              >
                <Search size={18} className="text-neutral-400" />
                <input
                  type="search"
                  placeholder="Search for t-shirts, polos, hoodies..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-xs font-medium text-neutral-500 hover:text-black"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
                <span className="text-lg font-bold">Menu</span>
                <button
                  onClick={toggleMenu}
                  aria-label="Close Navigation"
                  className="p-2 text-neutral-900 hover:text-neutral-500"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 space-y-1 px-3 py-4">
                {navigationLinks.map((item) => (
                  <div key={item.title}>
                    {item.submenu || item.columns ? (
                      <div>
                        <button
                          onClick={() => toggleMobileSubmenu(item.title)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[15px] font-medium transition-colors hover:bg-neutral-100"
                        >
                          <span>{item.title}</span>
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${
                              openSubmenu === item.title ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openSubmenu === item.title && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 border-l border-neutral-200 pb-2 pl-4">
                                {item.columns
                                  ? item.columns.flatMap((col) => [
                                      <p
                                        key={col.title}
                                        className="mb-1 mt-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400"
                                      >
                                        {col.title}
                                      </p>,
                                      ...col.items.map((sub) => (
                                        <Link
                                          key={`${col.title}-${sub.title}`}
                                          href={sub.link}
                                          onClick={() => setIsOpen(false)}
                                          className="block rounded-lg py-2 text-sm text-neutral-600 transition-colors hover:text-black"
                                        >
                                          {sub.title}
                                        </Link>
                                      )),
                                    ])
                                  : item.submenu?.map((sub) => (
                                      <Link
                                        key={sub.title}
                                        href={sub.link}
                                        onClick={() => setIsOpen(false)}
                                        className="block rounded-lg py-2 text-sm text-neutral-600 transition-colors hover:text-black"
                                      >
                                        {sub.title}
                                      </Link>
                                    ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.link || "#"}
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors hover:bg-neutral-100"
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-200 px-5 py-4">
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium">
                  <Link
                    href="/store-locator"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-neutral-100 px-2 py-2.5"
                  >
                    Outlets
                  </Link>
                  <Link
                    href="/track"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-neutral-100 px-2 py-2.5"
                  >
                    Track Order
                  </Link>
                  <Link
                    href="/custom"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg bg-neutral-100 px-2 py-2.5"
                  >
                    Custom/Bulk
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationBar;
