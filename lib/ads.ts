export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-XXXXXXXXXXXXXXXX";

export const ads = {
  topBanner: process.env.NEXT_PUBLIC_AD_SLOT_TOP ?? "1111111111",
  footerBanner: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER ?? "2222222222",
  homeInline: process.env.NEXT_PUBLIC_AD_SLOT_HOME ?? "3333333333",
  shopSidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR ?? "4444444444",
};
