"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getMockBusById,
  addMockReservation,
} from "@/data/mock";

const AQSA_IMAGE = "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function BusDetailPage() {
  const params = useParams();
  const router = useRouter();
  const busId = typeof params.id === "string" ? params.id : "";
  const bus = useMemo(() => getMockBusById(busId), [busId]);
  const [seats, setSeats] = useState(1);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!bus) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <p className="font-medium">الباص غير موجود.</p>
        <Link href="/" className="mt-3 inline-block text-emerald-700 hover:underline font-medium">
          ← العودة للرحلات
        </Link>
      </div>
    );
  }

  const maxSeats = Math.min(bus.availableSeats, 10);
  const handleReserve = () => {
    setError("");
    const name = userName.trim();
    if (!name) {
      setError("يرجى إدخال اسمك.");
      return;
    }
    const res = addMockReservation({
      busId: bus._id,
      seats,
      userName: name,
      userPhone: userPhone.trim() || undefined,
    });
    if (res) {
      setSubmitted(true);
      setTimeout(() => router.push("/reservations"), 1500);
    } else {
      setError("لم نتمكن من الحجز. المقاعد غير كافية.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-10 text-center">
        <div className="text-5xl mb-4">✓</div>
        <p className="text-xl font-bold text-emerald-800">تم تأكيد الحجز!</p>
        <p className="mt-2 text-emerald-700">نتمنى لك زيارة مباركة</p>
        <p className="mt-4 text-sm text-emerald-600">جاري التوجيه إلى حجوزاتي…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline"
      >
        ← العودة للرحلات
      </Link>

      {/* Header with image */}
      <div className="relative overflow-hidden rounded-2xl bg-stone-900 text-white">
        <div className="absolute inset-0">
          <Image
            src={AQSA_IMAGE}
            alt="المسجد الأقصى"
            fill
            className="object-cover opacity-50"
            sizes="(max-width: 768px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/95 via-stone-900/60 to-transparent" />
        </div>
        <div className="relative px-6 py-8">
          <h1 className="text-2xl font-bold">
            رحلة إلى الأقصى
          </h1>
          <p className="mt-1 text-stone-200">
            {bus.city.nameAr} — {bus.region.nameAr}
          </p>
        </div>
      </div>

      {/* Trip details */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">تفاصيل الرحلة</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-stone-50 p-4">
            <dt className="text-xs font-medium text-stone-400 uppercase tracking-wide">التاريخ</dt>
            <dd className="mt-1 font-medium text-stone-800">{formatDate(bus.departureTime)}</dd>
          </div>
          <div className="rounded-xl bg-stone-50 p-4">
            <dt className="text-xs font-medium text-stone-400 uppercase tracking-wide">الانطلاق والعودة</dt>
            <dd className="mt-1 font-medium text-stone-800">
              {formatTime(bus.departureTime)} — {formatTime(bus.returnTime)}
            </dd>
          </div>
          <div className="rounded-xl bg-stone-50 p-4">
            <dt className="text-xs font-medium text-stone-400 uppercase tracking-wide">السائق</dt>
            <dd className="mt-1 font-medium text-stone-800">{bus.driverName}</dd>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4">
            <dt className="text-xs font-medium text-emerald-600 uppercase tracking-wide">المقاعد المتاحة</dt>
            <dd className="mt-1 font-bold text-emerald-700">{bus.availableSeats} من {bus.totalSeats}</dd>
          </div>
        </dl>
      </div>

      {/* Booking form */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">حجز مقاعد</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="مثال: أحمد محمد"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              رقم الهاتف <span className="text-stone-400">(اختياري)</span>
            </label>
            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              عدد المقاعد
            </label>
            <select
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} مقعد
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}
        <button
          type="button"
          onClick={handleReserve}
          disabled={bus.availableSeats < 1 || !userName.trim()}
          className="mt-6 w-full rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
        >
          تأكيد الحجز
        </button>
      </div>
    </div>
  );
}
