"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { heroSlides } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";

const AUTOPLAY_MS = 5500;

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [index, paused, goTo]);

  const slide = heroSlides[index];

  return (
    <section
      className="group relative overflow-hidden bg-neutral-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[480px] w-full sm:h-[540px] lg:h-[620px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <SmartImage
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-end lg:items-center">
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 lg:pb-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="max-w-xl"
              >
                <p className="mb-3 inline-block rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                  {slide.eyebrow}
                </p>
                <h2 className="text-3xl font-extrabold leading-tight text-white text-balance sm:text-5xl">
                  {slide.title}
                </h2>
                <p className="mt-3 text-sm text-neutral-200 sm:text-base">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.link}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-neutral-900 transition-colors hover:bg-neutral-200"
                >
                  {slide.cta}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => goTo(index - 1)}
        className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-opacity group-hover:flex hover:bg-white/40 md:flex"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => goTo(index + 1)}
        className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-opacity group-hover:flex hover:bg-white/40 md:flex"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
