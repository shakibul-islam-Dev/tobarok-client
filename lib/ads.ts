export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-XXXXXXXXXXXXXXXX";

export const ads = {
  topBanner: process.env.NEXT_PUBLIC_AD_SLOT_TOP ?? "1111111111",
  footerBanner: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER ?? "2222222222",
  homeInline: process.env.NEXT_PUBLIC_AD_SLOT_HOME ?? "3333333333",
  shopSidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR ?? "4444444444",
};

// ---------------------------------------------------------------------------
// Watch Ads & Earn — reward config
// ---------------------------------------------------------------------------

/** Points credited to the wallet for each completed ad (1 point = ৳1). */
export const REWARD_PER_AD = 10;
/** How long (seconds) the simulated ad plays before it can be claimed. */
export const AD_DURATION_SECONDS = 12;
/** Cooldown (seconds) between two claimed ads. */
export const AD_COOLDOWN_SECONDS = 30;
/** Max ads that can be claimed per day (resets at local midnight). */
export const AD_DAILY_LIMIT = 20;

export interface AdCreative {
  id: string;
  title: string;
  tagline: string;
  cta: string;
  image: string;
}

/**
 * The "available ads" pool shown on the Watch Ads & Earn page. Each entry
 * simulates a sponsor whose creative plays before the reward is credited.
 */
export const adCreatives: AdCreative[] = [];
