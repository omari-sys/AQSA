"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getMockRegions,
  getMockCities,
  getMockBuses,
  type Bus,
  type Region,
  type City,
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

const AQSA_IMAGE = "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80";

function BusCard({ bus }: { bus: Bus }) {
  return (
    <Link
      href={`/buses/${bus._id}`}
      className="group block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              {bus.region.nameAr}
            </span>
            <span className="font-semibold text-stone-900">{bus.city.nameAr}</span>
          </div>
          <p className="text-sm text-stone-600">
            {formatDate(bus.departureTime)}
          </p>
          <p className="text-sm text-stone-500 mt-0.5">
            {formatTime(bus.departureTime)} ← انطلاق · عودة {formatTime(bus.returnTime)}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            السائق: {bus.driverName}
          </p>
        </div>
        <div className="text-left shrink-0">
          <p className="text-xl font-bold text-emerald-600">
            {bus.availableSeats}
          </p>
          <p className="text-xs text-stone-400">مقعد متاح</p>
          <span className="mt-2 inline-block text-sm font-medium text-emerald-600 group-hover:underline">
            احجز الآن ←
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const regions = useMemo(() => getMockRegions(), []);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const cities = useMemo(
    () => getMockCities(selectedRegionId || undefined),
    [selectedRegionId]
  );
  const buses = useMemo(
    () =>
      getMockBuses({
        regionId: selectedRegionId || undefined,
        cityId: selectedCityId || undefined,
      }),
    [selectedRegionId, selectedCityId]
  );

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-stone-900 text-white">
        <div className="absolute inset-0">
          <Image
            src={AQSA_IMAGE}
            alt="المسجد الأقصى"
            fill
            className="object-cover opacity-60"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
        </div>
        <div className="relative px-6 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight drop-shadow-sm">
            حجز باص لزيارة الأقصى
          </h1>
          <p className="mt-3 text-stone-200 text-lg max-w-xl mx-auto">
            رحلات من بلاد الداخل إلى المسجد الأقصى المبارك. احجز مقعدك بسهولة.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">كيف تحجز؟</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold">١</span>
            <div>
              <p className="font-medium text-stone-800">اختر منطقتك</p>
              <p className="text-sm text-stone-500">ابحث عن الرحلات من مدينتك أو منطقتك</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold">٢</span>
            <div>
              <p className="font-medium text-stone-800">اختر الرحلة</p>
              <p className="text-sm text-stone-500">اضغط على الرحلة المناسبة وأدخل بياناتك</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold">٣</span>
            <div>
              <p className="font-medium text-stone-800">تأكيد الحجز</p>
              <p className="text-sm text-stone-500">احصل على تأكيد فوري واحفظ تفاصيل رحلتك</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">ابحث عن رحلتك</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-600">
              حسب المنطقة (بلاد الداخل)
            </label>
            <select
              value={selectedRegionId}
              onChange={(e) => {
                setSelectedRegionId(e.target.value);
                setSelectedCityId("");
              }}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="">كل المناطق</option>
              {regions.map((r: Region) => (
                <option key={r._id} value={r._id}>
                  {r.nameAr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-600">
              حسب المدينة
            </label>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="">كل المدن</option>
              {cities.map((c: City) => (
                <option key={c._id} value={c._id}>
                  {c.nameAr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Bus list */}
      <section>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">
          الرحلات المتاحة
          {buses.length > 0 && (
            <span className="mr-2 text-sm font-normal text-stone-500">
              ({buses.length} رحلة)
            </span>
          )}
        </h2>
        {buses.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 py-16 text-center">
            <p className="text-stone-500">لا توجد رحلات بهذا التصفية.</p>
            <p className="text-sm text-stone-400 mt-1">جرّب تغيير المنطقة أو المدينة</p>
            <button
              type="button"
              onClick={() => {
                setSelectedRegionId("");
                setSelectedCityId("");
              }}
              className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              عرض كل الرحلات
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {buses.map((bus) => (
              <li key={bus._id}>
                <BusCard bus={bus} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Tips */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
        <h2 className="text-lg font-semibold text-amber-900 mb-3">نصائح للزيارة</h2>
        <ul className="space-y-2 text-sm text-amber-800/90">
          <li>• تواجد في نقطة الانطلاق قبل الموعد بوقت كافٍ</li>
          <li>• احفظ رقم حجزك واسمك للعرض عند الحاجة</li>
          <li>• يُفضّل إحضار وثائق تعريف سارية</li>
        </ul>
      </section>
    </div>
  );
}
