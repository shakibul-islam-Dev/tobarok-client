"use client";

import { Menu, X, ShoppingBag, ChevronDown, Wallet2, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SubMenuItem {
  title: string;
  link: string;
}

interface NavItem {
  title: string;
  link?: string;
  submenu?: SubMenuItem[];
}

const navigationLinks: NavItem[] = [
  { title: "New", link: "/new" },
  { title: "Big Sale", link: "/big-sale" },
  { title: "Most Loved", link: "/most-loved" },
  {
    title: "Comfort Package",
    submenu: [
      { title: "Bedding Set", link: "/comfort/bedding" },
      { title: "Pillows", link: "/comfort/pillows" },
      { title: "Blankets", link: "/comfort/blankets" },
    ],
  },
  {
    title: "Collections",
    submenu: [
      { title: "Summer Special", link: "/collections/summer" },
      { title: "Winter Collection", link: "/collections/winter" },
      { title: "Exclusive", link: "/collections/exclusive" },
    ],
  },
  {
    title: "Elite Series",
    submenu: [
      { title: "Luxury Edition", link: "/elite/luxury" },
      { title: "Premium Cotton", link: "/elite/premium" },
    ],
  },
  { title: "Others", link: "/others" },
];

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setOpenSubmenu(null);
  };

  const toggleMobileSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <nav className="bg-slate-900 text-white w-full border-b border-slate-800 relative z-40">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag size={40} className="text-indigo-400" />
          <div>
            <h1 className="font-bold text-2xl leading-none">tobarok</h1>
            <p className="font-semibold text-xs text-slate-400">
              Shopping <span className="text-indigo-400">&amp;</span> Earn
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 font-medium text-sm lg:text-base">
          {navigationLinks.map((nav, index) => (
            <div key={index} className="relative group py-2">
              {nav.submenu ? (
                <>
                  <button className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                    {nav.title}
                    <ChevronDown
                      size={16}
                      className="group-hover:rotate-180 transition-transform duration-300"
                    />
                  </button>

                  {/* Smooth Desktop Dropdown */}
                  <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
                    <div className="bg-slate-800 border border-slate-700 rounded-md shadow-xl py-2 w-48">
                      {nav.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.link}
                          className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-indigo-400 transition-colors"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={nav.link || "#"}
                  className="hover:text-indigo-400 transition-colors whitespace-nowrap"
                >
                  {nav.title}
                </Link>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <div>
            <Wallet2 />
          </div>
          <div>
            <User />
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            type="button"
            aria-label="Toggle Navigation"
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Backdrop with motion/react */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Right Side Slide-in Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-slate-900 border-l border-slate-800 p-6 z-50 shadow-2xl flex flex-col md:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <span className="font-bold text-xl text-indigo-400">Menu</span>
                <button
                  onClick={toggleMenu}
                  aria-label="Close Navigation"
                  className="p-2 text-slate-400 hover:text-white focus:outline-none"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 py-4 space-y-3">
                {navigationLinks.map((nav, index) => (
                  <div key={index}>
                    {nav.submenu ? (
                      <div>
                        <button
                          onClick={() => toggleMobileSubmenu(nav.title)}
                          className="flex items-center justify-between w-full py-2.5 px-3 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                        >
                          <span>{nav.title}</span>
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-300 ${
                              openSubmenu === nav.title
                                ? "rotate-180 text-indigo-400"
                                : ""
                            }`}
                          />
                        </button>

                        {/* Animated Mobile Submenu Accordion */}
                        <AnimatePresence>
                          {openSubmenu === nav.title && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="pl-4 ml-3 border-l border-slate-700 overflow-hidden"
                            >
                              {nav.submenu.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={subItem.link}
                                  onClick={() => setIsOpen(false)}
                                  className="block py-2 px-3 rounded-md text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                                >
                                  {subItem.title}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={nav.link || "#"}
                        onClick={() => setIsOpen(false)}
                        className="block py-2.5 px-3 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                      >
                        {nav.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavigationBar;
