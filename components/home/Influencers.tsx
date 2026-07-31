import { influencers } from "@/lib/data";

export default function Influencers() {
  return (
    <section className="overflow-hidden bg-neutral-950 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Seen Wearing
        </p>
        <h2 className="mt-2 text-4xl font-extrabold uppercase tracking-tight sm:text-6xl">
          tobarok
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-neutral-400">
          They trusted tobarok; because they believe in what&apos;s real, bold
          and built with pride. Now it&apos;s your turn to wear yours.
        </p>
      </div>

      <div className="relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-neutral-950 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-neutral-950 to-transparent sm:w-32" />
        <div className="flex w-max animate-marquee gap-3 pr-3">
          {[...influencers, ...influencers].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap rounded-full border border-neutral-800 px-5 py-2.5 text-sm text-neutral-300"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
