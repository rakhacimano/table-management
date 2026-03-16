import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Table Manager — Venue Table Management",
  description:
    "Manage your restaurant, coworking space, event venue, or meeting room tables with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} antialiased bg-[#0a0a1a] text-white`}
        style={{ fontFamily: "'Google Sans', var(--font-inter), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
