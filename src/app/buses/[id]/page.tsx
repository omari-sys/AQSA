"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  getMockBusById,
  addMockReservation,
} from "@/data/mock";

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
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!bus) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <p className="font-medium">الباص غير موجود.</p>
        <Link href="/" className="mt-2 inline-block text-emerald-700 hover:underline">
          ← العودة للرحلات
        </Link>
      </div>
    );
  }

  const maxSeats = Math.min(bus.availableSeats, 10);
  const handleReserve = () => {
    setError("");
    const res = addMockReservation(bus._id, seats);
    if (res) {
      setSubmitted(true);
      setTimeout(() => router.push("/reservations"), 1500);
    } else {
      setError("لم نتمكن من الحجز. المقاعد غير كافية.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center text-emerald-800">
        <p className="text-lg font-semibold">تم تأكيد الحجز!</p>
        <p className="mt-1">جاري التوجيه إلى حجوزاتي…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-block text-sm font-medium text-emerald-700 hover:underline"
      >
        ← العودة للرحلات
      </Link>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900">
          رحلة إلى الأقصى — {bus.city.nameAr} ({bus.region.nameAr})
        </h1>
        <dl className="mt-4 grid gap-2 text-stone-600 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-stone-400">التاريخ</dt>
            <dd className="font-medium text-stone-800">{formatDate(bus.departureTime)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-stone-400">الانطلاق والعودة</dt>
            <dd className="font-medium text-stone-800">
              {formatTime(bus.departureTime)} → {formatTime(bus.returnTime)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-stone-400">السائق</dt>
            <dd className="font-medium text-stone-800">{bus.driverName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-stone-400">المقاعد المتاحة</dt>
            <dd className="font-medium text-emerald-700">{bus.availableSeats} من {bus.totalSeats}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800">حجز مقاعد</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-stone-700">
            عدد المقاعد:
          </label>
          <select
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleReserve}
            disabled={bus.availableSeats < 1}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            تأكيد الحجز
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
