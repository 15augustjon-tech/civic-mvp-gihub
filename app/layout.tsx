import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Civic Forum | Politician Transparency Dashboard",
  description: "They work for you. Know your employees. One click = instant dossier on any US Senator.",
  keywords: ["politicians", "transparency", "senators", "stock trades", "campaign finance", "voting records"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050508] text-[#f0f0f5]`}
      >
        {children}
      </body>
    </html>
  );
}
