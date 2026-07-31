import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl font-black tracking-tight text-neutral-900">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-neutral-900">
        This page slipped away
      </h1>
      <p className="mt-2 max-w-md text-sm text-neutral-500">
        The link you followed may be broken, or the product you are looking for
        is no longer available.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
      >
        Back to Shop
      </Link>
    </div>
  );
}
