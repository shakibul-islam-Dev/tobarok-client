import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/shared/Navigation";
import FooterComponent from "@/components/shared/Footer";
import AdScript from "@/components/ads/AdScript";
import AdBanners from "@/components/ads/AdBanners";
import HistoryNav from "@/components/ui/HistoryNav";
import { StoreProvider } from "@/components/store/StoreProvider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tobarok | Shopping & Earn",
  description:
    "tobarok — premium quality t-shirts and streetwear. Big sale, new drops and most wanted pieces at unbeatable prices.",
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <StoreProvider>
          <NavigationBar />
          <AdBanners position="top" />
          <main className="w-full flex-1">{children}</main>
          <AdBanners position="footer" />
          <FooterComponent />
          <AdScript />
          <HistoryNav />
        </StoreProvider>
      </body>
    </html>
  );
}
