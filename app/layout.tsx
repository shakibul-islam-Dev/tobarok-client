import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import HistoryNav from "@/components/ui/HistoryNav";

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
        <main className="w-full flex-1">{children}</main>
        <h1>Hwellow</h1>
        <HistoryNav />
      </body>
    </html>
  );
}
