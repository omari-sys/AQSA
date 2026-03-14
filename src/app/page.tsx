"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

function BusCard({ bus }: { bus: Bus }) {
  return (
    <Link
      href={`/buses/${bus._id}`}
      className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-stone-900">{bus.city.nameAr} — {bus.region.nameAr}</p>
          <p className="text-sm text-stone-500">
            {formatDate(bus.departureTime)} · {formatTime(bus.departureTime)} →{" "}
            {formatTime(bus.returnTime)}
          </p>
          <p className="mt-1 text-sm text-stone-600">
            السائق: {bus.driverName}
          </p>
        </div>
        <div className="text-left">
          <p className="text-lg font-semibold text-emerald-700">
            {bus.availableSeats} مقعد متاح
          </p>
          <p className="text-xs text-stone-400">
            من {bus.totalSeats}
          </p>
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
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
          حجز باص لزيارة الأقصى
        </h1>
        <p className="mt-2 text-stone-600">
          اختر منطقتك أو مدينتك من بلاد الداخل وابحث عن الباصات المتاحة
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            حسب المنطقة (بلاد الداخل)
          </label>
          <select
            value={selectedRegionId}
            onChange={(e) => {
              setSelectedRegionId(e.target.value);
              setSelectedCityId("");
            }}
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">كل المناطق</option>
            {regions.map((r: Region) => (
              <option key={r._id} value={r._id}>
                {r.nameAr} ({r.nameEn})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            حسب المدينة
          </label>
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">كل المدن</option>
            {cities.map((c: City) => (
              <option key={c._id} value={c._id}>
                {c.nameAr}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-stone-800">
          الرحلات المتاحة
        </h2>
        {buses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 py-12 text-center text-stone-500">
            لا توجد باصات. جرّب منطقة أو مدينة أخرى.
          </p>
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
    </div>
  );
}
