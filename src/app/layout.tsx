import type { Metadata, Viewport } from "next";
import { Gloock, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/MotionProvider";
import { defaultDescription, defaultTitle, indexable, keywords } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const display = Gloock({
  variable: "--font-display-face",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: defaultTitle, template: `%s` },
  description: defaultDescription,
  applicationName: SITE_NAME,
  keywords,
  category: "food",
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "lt_LT", siteName: SITE_NAME, url: "/", title: defaultTitle, description: defaultDescription },
  twitter: { card: "summary_large_image", title: defaultTitle, description: defaultDescription },
  robots: indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lt" className={`${manrope.variable} ${display.variable}`} data-scroll-behavior="smooth">
      <body>
        {/* Without JavaScript the reveal-on-scroll animations would leave content hidden. */}
        <noscript>
          <style>{`[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#turinys"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 font-bold text-white transition-transform focus:translate-y-0"
        >
          Pereiti prie turinio
        </a>
        <MotionProvider>
          <Header />
          <main id="turinys" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
