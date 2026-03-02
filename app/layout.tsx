import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import Header from "@/components/Header";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Velocity — Fast. Modern. Expertly Crafted.",
  description:
    "A lightning-fast, meticulously engineered web experience. Built with cutting-edge tech and obsessive attention to detail.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased`}
      >
        {/* <AnalyticsProvider /> */}
        <Header />
        {children}
      </body>
    </html>
  );
}
