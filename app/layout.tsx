// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // if you have one

// app/layout.tsx

export const metadata = {
  title: 'Crescent Academy Portal',
  description: 'Academic Management System',
  icons: {
    icon: '/logo.png', // This will replace your Vercel logo
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        <Navbar />
        <main className="pt-0 md:pt-0 flex-grow"> {/* ← no top padding if navbar is fixed */}
          {children}
        </main>
        <Footer /> {/* if you have Footer */}
      </body>
    </html>
  );
}