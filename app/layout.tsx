import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/shared/Navigation";
import FooterComponent from "@/components/shared/Footer";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tobarok | Shopping & Earn",
  description:
    "A modern e-commerce platform for seamless shopping and earning rewards.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans h-full scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        <NavigationBar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <FooterComponent />
      </body>
    </html>
  );
}
