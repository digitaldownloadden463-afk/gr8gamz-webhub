import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "GR8 GAMZ | Free Online Arcade Games",
    template: "%s | GR8 GAMZ"
  },
  description:
    "Play free online arcade games on GR8 GAMZ. Mobile-first games, favourites, player profiles, comments and community features.",
  keywords: [
    "free online games",
    "arcade games",
    "mobile games",
    "browser games",
    "GR8 GAMZ"
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
