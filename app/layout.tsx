import { Cormorant_Garamond, Plus_Jakarta_Sans, Amiri } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  variable: "--font-amiri",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  title: "The Crescent Academy — Nurturing the Complete Child",
  description:
    "The Crescent Academy, Iwo — A faith-driven institution dedicated to academic excellence, moral uprightness, and authentic Islamic values since 2010.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${amiri.variable}`}>
      <body className="antialiased">
        {/* Apply the saved portal theme before paint to avoid a dark→light flash.
            Only affects portal-scoped styles; the public site uses data-theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('ca-portal-theme')||'dark';document.documentElement.setAttribute('data-portal-theme',t);}catch(e){document.documentElement.setAttribute('data-portal-theme','dark');}`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
