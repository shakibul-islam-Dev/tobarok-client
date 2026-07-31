import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import Highlights from "@/components/home/Highlights";
import Inspire from "@/components/home/Inspire";
import ProductCarousel from "@/components/home/ProductCarousel";
import Influencers from "@/components/home/Influencers";
import SeeNewIn from "@/components/home/SeeNewIn";
import AdSlot from "@/components/ads/AdSlot";
import { ads } from "@/lib/ads";
import {
  bestDeal,
  deshiTalk,
  mostWanted,
  newIn,
  vibeProducts,
} from "@/lib/data";

export default function Home() {
  return (
    <div className="w-full">
      <HeroCarousel />

      <CategoryGrid />

      <Highlights />

      <Inspire />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <AdSlot slot={ads.homeInline} />
      </div>

      <ProductCarousel
        title="steal your vibe"
        subtitle="All Best Selling New Solid Ekdom Deshi Kids"
        link={{ label: "Explore More", href: "/shop" }}
        products={vibeProducts}
        align="center"
      />

      <ProductCarousel
        title="Most Wanted"
        link={{ label: "Explore More", href: "/shop" }}
        products={mostWanted}
      />

      <ProductCarousel
        title="New In"
        link={{ label: "Explore More", href: "/shop" }}
        products={newIn}
      />

      <ProductCarousel
        title="Best Deal"
        link={{ label: "Explore More", href: "/shop" }}
        products={bestDeal}
      />

      <ProductCarousel
        title="Deshi Talk"
        link={{ label: "Explore More", href: "/shop" }}
        products={deshiTalk}
      />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <AdSlot slot={ads.homeInline} />
      </div>

      <Influencers />

      <SeeNewIn />
    </div>
  );
}
