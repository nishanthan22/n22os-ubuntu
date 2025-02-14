import "./globals.css"; // Import global styles

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "A Next.js app with global styles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}