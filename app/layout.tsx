// app/layout.tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";   // your existing one
import Footer from "@/components/Footer";   // the one we created
import "./globals.css";                     // your global styles

export const metadata: Metadata = {
  title: "Crescent Academy - Authentic Education",
  description: "Nurturing the complete child through academic excellence and moral uprightness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}