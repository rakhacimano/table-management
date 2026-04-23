import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#f9f9f9] text-grey-950 font-onest">
        {children}
      </body>
    </html>
  );
}
