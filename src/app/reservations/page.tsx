"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getMockReservations } from "@/data/mock";

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

export default function ReservationsPage() {
  const [key, setKey] = useState(0);
  const reservations = useMemo(() => getMockReservations(), [key]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">حجوزاتي</h1>
          <p className="mt-1 text-stone-600">جميع حجوزاتك للرحلات إلى الأقصى</p>
        </div>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          تحديث
        </button>
      </div>

      <p className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm text-stone-600">
        الحجوزات محفوظة في هذا المتصفح. عند ربط الباك-اند ستُحمّل من السيرفر.
      </p>

      {reservations.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white py-16 text-center">
          <p className="text-stone-600 text-lg">لا توجد حجوزات.</p>
          <p className="mt-1 text-stone-500 text-sm">احجز رحلتك الأولى إلى الأقصى</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            تصفح الرحلات
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => (
            <li
              key={r._id}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-bold text-stone-900 text-lg">
                      {r.userName ?? "ضيف"}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                      مؤكد
                    </span>
                  </div>
                  <p className="font-medium text-stone-800">
                    {r.bus.city?.nameAr ?? r.bus.city?.nameEn ?? "—"} ({r.bus.region?.nameAr ?? "—"})
                  </p>
                  <p className="text-stone-600 mt-0.5">
                    {r.seats} {r.seats === 1 ? "مقعد" : "مقاعد"}
                  </p>
                  <p className="text-sm text-stone-500 mt-2">
                    {formatDate(r.bus.departureTime)} · {formatTime(r.bus.departureTime)} — {formatTime(r.bus.returnTime)}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    السائق: {r.bus.driverName} · تم الحجز {formatDate(r.createdAt)}
                  </p>
                  {r.userPhone && (
                    <p className="text-xs text-stone-500 mt-1">
                      هاتف: {r.userPhone}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
