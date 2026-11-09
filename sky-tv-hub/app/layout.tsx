import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";
import { Footer } from "@/components/Footer";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sky TV Hub",
  description: "New and upcoming TV in the UK across Sky, NOW, catch-up and streaming.",
};
export const viewport: Viewport = { themeColor: "#070b14" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>
          <div className="flex-1">{children}</div>
        </AppProviders>
        <Footer />
      </body>
    </html>
  );
}
