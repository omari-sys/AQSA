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
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function ReservationsPage() {
  const [key, setKey] = useState(0);
  const reservations = useMemo(() => getMockReservations(), [key]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">حجوزاتي</h1>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="text-sm text-emerald-600 hover:underline"
        >
          تحديث
        </button>
      </div>

      <p className="text-stone-600">
        الحجوزات محفوظة في هذا المتصفح (بيانات تجريبية). عند ربط الباك-اند ستُحمّل من السيرفر.
      </p>

      {reservations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 py-12 text-center">
          <p className="text-stone-600">لا توجد حجوزات.</p>
          <Link
            href="/"
            className="mt-3 inline-block font-medium text-emerald-700 hover:underline"
          >
            تصفح الرحلات ←
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {reservations.map((r) => (
            <li
              key={r._id}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-stone-900">
                    {r.bus.city?.nameAr ?? r.bus.city?.nameEn ?? "—"} ({r.bus.region?.nameAr ?? "—"}) — {r.seats} {r.seats === 1 ? "مقعد" : "مقاعد"}
                  </p>
                  <p className="text-sm text-stone-500">
                    {formatDate(r.bus.departureTime)} ·{" "}
                    {formatTime(r.bus.departureTime)} →{" "}
                    {formatTime(r.bus.returnTime)}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    السائق: {r.bus.driverName} · تم الحجز {formatDate(r.createdAt)}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                  مؤكد
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
