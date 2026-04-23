import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: "Kaspin Table Management — Informasi Ruangan",
  description:
    "Kelola ruangan dan meja restoran Kaspin Djaya dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={onest.variable}>
      <body className="antialiased bg-[#f9f9f9] text-grey-950 font-onest">
        {children}
      </body>
    </html>
  );
}
