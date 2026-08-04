"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  Loader2,
  MonitorPlay,
  Play,
  ShoppingBag,
  Sparkles,
  Timer,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SmartImage from "@/components/ui/SmartImage";
import { useWalletLedger } from "@/lib/use-ledger";
import {
  createIdempotencyKey,
  formatMoney,
  TransactionError,
  type CreateTransactionInput,
} from "@/lib/transactions";
import {
  AD_COOLDOWN_SECONDS,
  AD_DAILY_LIMIT,
  AD_DURATION_SECONDS,
  adCreatives,
  REWARD_PER_AD,
  type AdCreative,
} from "@/lib/ads";

type AdPhase = "playing" | "claimable";

/** True when both timestamps fall on the same local calendar day. */
function isSameLocalDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export default function EarnPage() {
  const { ledger, balance, addTransaction } = useWalletLedger();

  // Player state.
  const [playerAd, setPlayerAd] = useState<AdCreative | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION_SECONDS);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [persistWarning, setPersistWarning] = useState<string | null>(null);

  // Cooldown between claims.
  const [cooldownLeft, setCooldownLeft] = useState(0);
  // Feedback banner.
  const [lastReward, setLastReward] = useState<number | null>(null);

  // The player is claimable once the countdown reaches zero.
  const phase: AdPhase = playerAd && secondsLeft <= 0 ? "claimable" : "playing";

  // Everything is derived from the ledger, so it survives a reload.
  const { pointsEarned, adsToday, pointsToday } = useMemo(() => {
    const now = new Date().toISOString();
    const ads = ledger.filter((tx) => tx.source === "ad_reward");
    const today = ads.filter((tx) => isSameLocalDay(tx.createdAt, now));
    return {
      pointsEarned: ads.reduce((sum, tx) => sum + tx.amount, 0),
      adsToday: today.length,
      pointsToday: today.reduce((sum, tx) => sum + tx.amount, 0),
    };
  }, [ledger]);

  const dailyLimitReached = adsToday >= AD_DAILY_LIMIT;
  const canWatch = cooldownLeft === 0 && !dailyLimitReached && !playerAd;

  // Countdown for the playing ad.
  useEffect(() => {
    if (!playerAd || secondsLeft <= 0) return;
    const timer = window.setTimeout(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000
    );
    return () => window.clearTimeout(timer);
  }, [playerAd, secondsLeft]);

  // Countdown for the claim cooldown.
  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const timer = window.setTimeout(
      () => setCooldownLeft((s) => s - 1),
      1000
    );
    return () => window.clearTimeout(timer);
  }, [cooldownLeft]);

  const startAd = (ad: AdCreative) => {
    if (!canWatch) return;
    setLastReward(null);
    setClaimError(null);
    setPersistWarning(null);
    setPlayerAd(ad);
    setSecondsLeft(AD_DURATION_SECONDS);
  };

  const closePlayer = () => {
    setPlayerAd(null);
    setSecondsLeft(AD_DURATION_SECONDS);
    setClaiming(false);
    setClaimError(null);
  };

  const claimReward = () => {
    if (!playerAd || phase !== "claimable" || claiming) return;
    setClaiming(true);
    setClaimError(null);

    try {
      const input: CreateTransactionInput = {
        type: "credit",
        source: "ad_reward",
        amount: REWARD_PER_AD,
        description: `Reward for watching "${playerAd.title}"`,
        idempotencyKey: createIdempotencyKey({
          source: "ad_reward",
          amount: REWARD_PER_AD,
          nonce: crypto.randomUUID(),
        }),
      };
      const result = addTransaction(input);
      if (!result.saved) {
        setPersistWarning(
          "Could not save to this device — your points may reset."
        );
      }
      setLastReward(REWARD_PER_AD);
      setCooldownLeft(AD_COOLDOWN_SECONDS);
      closePlayer();
    } catch (err) {
      setClaimError(
        err instanceof TransactionError
          ? err.message
          : "Something went wrong while crediting your points. Please try again."
      );
      setClaiming(false);
    }
  };

  const elapsed = AD_DURATION_SECONDS - secondsLeft;
  const progress = Math.min(1, elapsed / AD_DURATION_SECONDS);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <Breadcrumb items={[{ label: "Watch Ads & Earn" }]} />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 sm:text-4xl">
          Watch Ads &amp; Earn
        </h1>
        <p className="text-sm text-neutral-500">
          Watch short sponsored ads and earn points straight into your wallet.
          1 point = {formatMoney(1)}. Spend them on anything in the store.
        </p>
      </div>

      {lastReward !== null && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} className="shrink-0" />
          You earned {lastReward} points! They&apos;re now in your wallet.
        </div>
      )}
      {persistWarning && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertTriangle size={16} />
          {persistWarning}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            <Wallet size={14} />
            Wallet Balance
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
            {formatMoney(balance)}
          </p>
          <Link
            href="/wallet"
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            View wallet <ArrowRight size={12} />
          </Link>
        </div>

        <div className="rounded-xl bg-neutral-900 p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            <Coins size={14} />
            Points Earned
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-tight">
            {pointsEarned.toLocaleString("en-BD")}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Total from watching ads
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            <Timer size={14} />
            Earned Today
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
            {pointsToday.toLocaleString("en-BD")}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            {adsToday} of {AD_DAILY_LIMIT} ads watched today
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            <Sparkles size={14} />
            Next Reward
          </div>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-900">
            {REWARD_PER_AD} pts
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            per completed ad
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Available ads */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-neutral-900">
              <MonitorPlay size={18} className="text-neutral-400" />
              Available Ads
            </h2>
            {cooldownLeft > 0 && (
              <span className="text-xs font-semibold text-neutral-500">
                Next ad in {cooldownLeft}s
              </span>
            )}
          </div>

          {dailyLimitReached && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <AlertTriangle size={16} className="shrink-0" />
              You&apos;ve reached today&apos;s limit of {AD_DAILY_LIMIT} ads.
              Come back tomorrow for more points.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {adCreatives.map((ad) => (
              <div
                key={ad.id}
                className="group overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm"
              >
                <div className="relative aspect-video overflow-hidden bg-neutral-100">
                  <SmartImage
                    src={ad.image}
                    alt={ad.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    <Coins size={11} />
                    +{REWARD_PER_AD} pts
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-neutral-900">
                    {ad.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                    {ad.tagline}
                  </p>
                  <button
                    type="button"
                    onClick={() => startAd(ad)}
                    disabled={!canWatch}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {dailyLimitReached ? (
                      "Limit Reached"
                    ) : cooldownLeft > 0 ? (
                      `Next ad in ${cooldownLeft}s`
                    ) : (
                      <>
                        <Play size={12} />
                        Watch Ad
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200/80 bg-white p-6 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              How it works
            </span>
            <ol className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-600">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
                  1
                </span>
                Tap Watch Ad and let the sponsor&apos;s video finish playing.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
                  2
                </span>
                Claim your reward — points land in your wallet instantly.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
                  3
                </span>
                Spend your points on any product at checkout.
              </li>
            </ol>
            <p className="mt-4 rounded-lg bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-500">
              Closing the ad before it ends means no reward. Up to{" "}
              {AD_DAILY_LIMIT} ads per day, {REWARD_PER_AD} points each.
            </p>
          </div>

          <div className="rounded-xl bg-neutral-900 p-6 text-white shadow-sm">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              <ShoppingBag size={14} />
              Spend your points
            </span>
            <p className="mt-3 text-sm leading-relaxed text-neutral-300">
              Your points live in your wallet and work just like money. Pick any
              product and choose{" "}
              <strong className="text-white">Wallet balance</strong> at
              checkout.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-200"
              >
                Start Shopping <ArrowRight size={13} />
              </Link>
              <Link
                href="/wallet"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
              >
                View Wallet
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ad player modal */}
      <AnimatePresence>
        {playerAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closePlayer}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <SmartImage
                  src={playerAd.image}
                  alt={playerAd.title}
                  fill
                  sizes="(min-width: 640px) 512px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

                {/* Top bar */}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    Sponsored
                  </span>
                  <button
                    type="button"
                    onClick={closePlayer}
                    aria-label="Close ad"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Copy */}
                <div className="absolute inset-x-0 bottom-12 p-4">
                  <h3 className="text-lg font-extrabold uppercase tracking-tight text-white">
                    {playerAd.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/80">
                    {playerAd.tagline}
                  </p>
                </div>

                {/* Center state */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {phase === "playing" ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-black/50">
                        <span className="text-2xl font-extrabold tabular-nums text-white">
                          {secondsLeft}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                        Ad ends in {secondsLeft}s
                      </span>
                    </div>
                  ) : (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={claimReward}
                      disabled={claiming}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {claiming ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      {claiming ? "Claiming…" : `Claim ${REWARD_PER_AD} pts`}
                    </motion.button>
                  )}
                </div>

                {/* Progress bar */}
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20">
                  <motion.div
                    className="h-full bg-emerald-500"
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ ease: "linear", duration: 0.4 }}
                  />
                </div>
              </div>

              <div className="px-4 py-3">
                {phase === "playing" ? (
                  <p className="text-center text-[11px] text-neutral-400">
                    Closing the ad before it ends means no reward.
                  </p>
                ) : (
                  <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-emerald-400">
                    <CheckCircle2 size={12} />
                    Ad completed — your {REWARD_PER_AD} points are ready.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {claimError && (
        <div className="fixed inset-x-0 bottom-4 z-50 mx-auto flex max-w-md items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-xl">
          <AlertTriangle size={16} className="shrink-0" />
          {claimError}
        </div>
      )}
    </div>
  );
}
