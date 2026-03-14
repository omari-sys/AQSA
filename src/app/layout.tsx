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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-stone-50 text-stone-900`}
      >
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
            <Link
              href="/"
              className="text-lg font-semibold text-emerald-800 hover:text-emerald-700"
            >
              زيارة الأقصى
            </Link>
            <div className="flex gap-6">
              <Link
                href="/"
                className="text-stone-600 hover:text-stone-900 font-medium"
              >
                الرحلات
              </Link>
              <Link
                href="/reservations"
                className="text-stone-600 hover:text-stone-900 font-medium"
              >
                حجوزاتي
              </Link>
              <Link
                href="/admin"
                className="text-amber-600 hover:text-amber-700 font-medium text-sm"
              >
                لوحة الأدمن
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
