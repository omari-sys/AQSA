"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  getMockRegions,
  getMockCities,
  getMockBusesAll,
  addMockBus,
  type Bus,
} from "@/data/mock";

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

export default function AdminPage() {
  const [key, setKey] = useState(0);
  const buses = useMemo(() => getMockBusesAll(), [key]);
  const regions = useMemo(() => getMockRegions(), []);
  const [showForm, setShowForm] = useState(false);
  const [cityId, setCityId] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("05:00");
  const [returnTime, setReturnTime] = useState("17:00");
  const [totalSeats, setTotalSeats] = useState(45);
  const [driverName, setDriverName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cities = useMemo(() => getMockCities(), []);

  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!cityId || !departureDate || !driverName.trim()) {
      setError("يرجى ملء جميع الحقول.");
      return;
    }
    const dep = `${departureDate}T${departureTime}:00.000Z`;
    const ret = `${departureDate}T${returnTime}:00.000Z`;
    try {
      addMockBus({
        cityId,
        departureTime: dep,
        returnTime: ret,
        totalSeats,
        driverName: driverName.trim(),
      });
      setSuccess("تمت إضافة الباص بنجاح.");
      setKey((k) => k + 1);
      setCityId("");
      setDepartureDate("");
      setDriverName("");
      setShowForm(false);
    } catch {
      setError("فشل في إضافة الباص.");
    }
  };

  const busesByRegion = useMemo(() => {
    const map: Record<string, Bus[]> = {};
    for (const bus of buses) {
      const rid = bus.region._id;
      if (!map[rid]) map[rid] = [];
      map[rid].push(bus);
    }
    return map;
  }, [buses]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-stone-900">لوحة الأدمن</h1>
        <div className="flex gap-3">
          <Link
            href="/"
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            العودة للصفحة الرئيسية
          </Link>
          <button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setSuccess("");
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {showForm ? "إلغاء" : "+ إضافة باص"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleAddBus}
          className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-stone-800">إضافة باص جديد</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                المدينة (بلاد الداخل)
              </label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900"
              >
                <option value="">اختر المدينة</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nameAr} — {regions.find((r) => r._id === c.regionId)?.nameAr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                التاريخ
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                وقت الانطلاق
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                وقت العودة
              </label>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">
                عدد المقاعد
              </label>
              <input
                type="number"
                min={1}
                max={80}
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-stone-700">
                اسم السائق
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
                placeholder="مثال: أحمد حسن"
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-900"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
            >
              إضافة الباص
            </button>
          </div>
        </form>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold text-stone-800">
          الباصات حسب بلاد الداخل
        </h2>
        {buses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 py-8 text-center text-stone-500">
            لا توجد باصات. أضف باصاً أولاً.
          </p>
        ) : (
          <div className="space-y-6">
            {regions.map((region) => {
              const regionBuses = busesByRegion[region._id] ?? [];
              if (regionBuses.length === 0) return null;
              return (
                <div
                  key={region._id}
                  className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <h3 className="mb-3 text-lg font-medium text-emerald-800">
                    {region.nameAr} ({region.nameEn})
                  </h3>
                  <ul className="space-y-2">
                    {regionBuses.map((bus) => (
                      <li
                        key={bus._id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-stone-50 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-stone-900">
                            {bus.city.nameAr}
                          </p>
                          <p className="text-sm text-stone-500">
                            {formatDate(bus.departureTime)} ·{" "}
                            {formatTime(bus.departureTime)} →{" "}
                            {formatTime(bus.returnTime)}
                          </p>
                          <p className="text-xs text-stone-400">
                            السائق: {bus.driverName}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-emerald-700">
                            {bus.availableSeats} / {bus.totalSeats} مقعد
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
