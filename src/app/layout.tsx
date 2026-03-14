import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "زيارة الأقصى — حجز باص للأقصى",
  description: "حجز باصات لزيارة المسجد الأقصى، مقسم حسب بلاد الداخل",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-stone-100/80`}
      >
        <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-white/90 backdrop-blur-md shadow-sm">
          <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-l from-emerald-700 to-teal-700 bg-clip-text text-transparent hover:from-emerald-600 hover:to-teal-600 transition-colors"
            >
              زيارة الأقصى
            </Link>
            <div className="flex gap-1 sm:gap-3">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                الرحلات
              </Link>
              <Link
                href="/reservations"
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                حجوزاتي
              </Link>
              <Link
                href="/admin"
                className="rounded-lg px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 transition-colors"
              >
                لوحة الأدمن
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-10">
          {children}
        </main>
        <footer className="border-t border-stone-200 bg-white/60 py-6 text-center text-sm text-stone-500">
          <p>زيارة الأقصى — نتمنى لكم زيارة مباركة</p>
        </footer>
      </body>
    </html>
  );
}
