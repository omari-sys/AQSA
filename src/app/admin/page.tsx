"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getMockRegions,
  getMockCities,
  getMockBusesAll,
  getMockAdmins,
  addMockRegion,
  updateMockRegion,
  deleteMockRegion,
  addMockCity,
  updateMockCity,
  deleteMockCity,
  addMockAdmin,
  updateMockAdminPassword,
  deleteMockAdmin,
  addMockBus,
  type Bus,
  type Region,
  type City,
  type AdminUser,
  type AdminRole,
} from "@/data/mock";

const ADMIN_BG =
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAweppKA0MXKLbjZikk5HqyWTeD3M38KD-KnYzc9BD14O8T8NTKnutDF2PvR-Bm-uEGpcRqJCsqJ-B5ww66EzS_SYXXClhxmaRgicFSCTYRWcawiTonHbrzWZRrXVmhZ_rCv9ri43xTA=s1360-w1360-h1020-rw";

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

type TabId = "regions" | "admins" | "buses";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>("regions");
  const [key, setKey] = useState(0);
  const regions = useMemo(() => getMockRegions(), [key]);
  const cities = useMemo(() => getMockCities(), [key]);
  const admins = useMemo(() => getMockAdmins(), [key]);
  const buses = useMemo(() => getMockBusesAll(), [key]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const busesByRegion = useMemo(() => {
    const map: Record<string, Bus[]> = {};
    for (const bus of buses) {
      const rid = bus.region._id;
      if (!map[rid]) map[rid] = [];
      map[rid].push(bus);
    }
    return map;
  }, [buses]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "regions", label: "الدول والقرى" },
    { id: "admins", label: "المستخدمون والصلاحيات" },
    { id: "buses", label: "الباصات والأوقات" },
  ];

  return (
    <div className="relative min-h-[70vh] overflow-hidden rounded-2xl">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={ADMIN_BG}
          alt="الأقصى"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
        <div className="absolute inset-0 bg-stone-900/85" />
      </div>

      <div className="relative px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-white">لوحة الأدمن</h1>
          <Link
            href="/"
            className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveTab(t.id);
                clearMessages();
              }}
              className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/50 bg-red-500/20 p-3 text-sm text-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-400/50 bg-emerald-500/20 p-3 text-sm text-emerald-100">
            {success}
          </div>
        )}

        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          {activeTab === "regions" && (
            <RegionsCitiesTab
              regions={regions}
              cities={cities}
              setKey={setKey}
              setError={setError}
              setSuccess={setSuccess}
            />
          )}
          {activeTab === "admins" && (
            <AdminsTab
              admins={admins}
              regions={regions}
              setKey={setKey}
              setError={setError}
              setSuccess={setSuccess}
            />
          )}
          {activeTab === "buses" && (
            <BusesTab
              buses={buses}
              regions={regions}
              cities={cities}
              setKey={setKey}
              setError={setError}
              setSuccess={setSuccess}
              busesByRegion={busesByRegion}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function RegionsCitiesTab({
  regions,
  cities,
  setKey,
  setError,
  setSuccess,
}: {
  regions: Region[];
  cities: City[];
  setKey: (fn: (k: number) => number) => void;
  setError: (s: string) => void;
  setSuccess: (s: string) => void;
}) {
  const [showRegionForm, setShowRegionForm] = useState(false);
  const [showCityForm, setShowCityForm] = useState(false);
  const [regionNameAr, setRegionNameAr] = useState("");
  const [regionNameEn, setRegionNameEn] = useState("");
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [cityRegionId, setCityRegionId] = useState("");
  const [cityNameAr, setCityNameAr] = useState("");
  const [cityNameEn, setCityNameEn] = useState("");
  const [editingCityId, setEditingCityId] = useState<string | null>(null);

  const handleSaveRegion = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!regionNameAr.trim() || !regionNameEn.trim()) {
      setError("يرجى ملء الاسم بالعربية والإنجليزية.");
      return;
    }
    try {
      if (editingRegionId) {
        updateMockRegion(editingRegionId, { nameAr: regionNameAr.trim(), nameEn: regionNameEn.trim() });
        setSuccess("تم تحديث المنطقة.");
      } else {
        addMockRegion({ nameAr: regionNameAr.trim(), nameEn: regionNameEn.trim() });
        setSuccess("تمت إضافة المنطقة.");
      }
      setKey((k) => k + 1);
      setRegionNameAr("");
      setRegionNameEn("");
      setEditingRegionId(null);
      setShowRegionForm(false);
    } catch {
      setError("فشل في الحفظ.");
    }
  };

  const handleSaveCity = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!cityRegionId || !cityNameAr.trim() || !cityNameEn.trim()) {
      setError("يرجى ملء جميع الحقول.");
      return;
    }
    try {
      if (editingCityId) {
        updateMockCity(editingCityId, {
          regionId: cityRegionId,
          nameAr: cityNameAr.trim(),
          nameEn: cityNameEn.trim(),
        });
        setSuccess("تم تحديث المدينة.");
      } else {
        addMockCity({
          regionId: cityRegionId,
          nameAr: cityNameAr.trim(),
          nameEn: cityNameEn.trim(),
        });
        setSuccess("تمت إضافة المدينة.");
      }
      setKey((k) => k + 1);
      setCityRegionId("");
      setCityNameAr("");
      setCityNameEn("");
      setEditingCityId(null);
      setShowCityForm(false);
    } catch {
      setError("فشل في الحفظ.");
    }
  };

  const handleEditRegion = (r: Region) => {
    setRegionNameAr(r.nameAr);
    setRegionNameEn(r.nameEn);
    setEditingRegionId(r._id);
    setShowRegionForm(true);
  };

  const handleEditCity = (c: City) => {
    setCityRegionId(c.regionId);
    setCityNameAr(c.nameAr);
    setCityNameEn(c.nameEn);
    setEditingCityId(c._id);
    setShowCityForm(true);
  };

  const handleDeleteRegion = (id: string) => {
    if (!confirm("حذف هذه المنطقة سيحذف جميع مدنها. متأكد؟")) return;
    try {
      deleteMockRegion(id);
      setSuccess("تم حذف المنطقة.");
      setKey((k) => k + 1);
    } catch {
      setError("فشل في الحذف.");
    }
  };

  const handleDeleteCity = (id: string) => {
    if (!confirm("حذف هذه المدينة؟")) return;
    try {
      deleteMockCity(id);
      setSuccess("تم حذف المدينة.");
      setKey((k) => k + 1);
    } catch {
      setError("فشل في الحذف.");
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">المناطق (بلاد الداخل)</h2>
          <button
            type="button"
            onClick={() => {
              setShowRegionForm(!showRegionForm);
              setEditingRegionId(null);
              setRegionNameAr("");
              setRegionNameEn("");
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {showRegionForm ? "إلغاء" : "+ إضافة منطقة"}
          </button>
        </div>
        {showRegionForm && (
          <form onSubmit={handleSaveRegion} className="mb-6 flex flex-wrap gap-3 rounded-xl bg-white/10 p-4">
            <input
              type="text"
              value={regionNameAr}
              onChange={(e) => setRegionNameAr(e.target.value)}
              placeholder="الاسم بالعربية"
              required
              className="rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            />
            <input
              type="text"
              value={regionNameEn}
              onChange={(e) => setRegionNameEn(e.target.value)}
              placeholder="الاسم بالإنجليزية"
              required
              className="rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            />
            <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              {editingRegionId ? "تحديث" : "إضافة"}
            </button>
          </form>
        )}
        <ul className="space-y-2">
          {regions.map((r) => (
            <li
              key={r._id}
              className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3 text-white"
            >
              <span>{r.nameAr} ({r.nameEn})</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEditRegion(r)}
                  className="rounded px-2 py-1 text-sm text-amber-300 hover:bg-amber-500/20"
                >
                  تعديل
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRegion(r._id)}
                  className="rounded px-2 py-1 text-sm text-red-300 hover:bg-red-500/20"
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">المدن والقرى</h2>
          <button
            type="button"
            onClick={() => {
              setShowCityForm(!showCityForm);
              setEditingCityId(null);
              setCityRegionId(regions[0]?._id ?? "");
              setCityNameAr("");
              setCityNameEn("");
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {showCityForm ? "إلغاء" : "+ إضافة مدينة"}
          </button>
        </div>
        {showCityForm && (
          <form onSubmit={handleSaveCity} className="mb-6 space-y-3 rounded-xl bg-white/10 p-4">
            <select
              value={cityRegionId}
              onChange={(e) => setCityRegionId(e.target.value)}
              required
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            >
              <option value="">اختر المنطقة</option>
              {regions.map((r) => (
                <option key={r._id} value={r._id}>{r.nameAr}</option>
              ))}
            </select>
            <input
              type="text"
              value={cityNameAr}
              onChange={(e) => setCityNameAr(e.target.value)}
              placeholder="اسم المدينة بالعربية"
              required
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            />
            <input
              type="text"
              value={cityNameEn}
              onChange={(e) => setCityNameEn(e.target.value)}
              placeholder="اسم المدينة بالإنجليزية"
              required
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            />
            <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              {editingCityId ? "تحديث" : "إضافة"}
            </button>
          </form>
        )}
        <ul className="space-y-2">
          {regions.map((r) => (
            <li key={r._id}>
              <p className="mb-2 text-sm font-medium text-emerald-200">{r.nameAr}</p>
              <ul className="space-y-1 pr-4">
                {cities.filter((c) => c.regionId === r._id).map((c) => (
                  <li
                    key={c._id}
                    className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-white/90"
                  >
                    <span>{c.nameAr}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCity(c)}
                        className="text-sm text-amber-300 hover:underline"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCity(c._id)}
                        className="text-sm text-red-300 hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function AdminsTab({
  admins,
  regions,
  setKey,
  setError,
  setSuccess,
}: {
  admins: AdminUser[];
  regions: Region[];
  setKey: (fn: (k: number) => number) => void;
  setError: (s: string) => void;
  setSuccess: (s: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("region_admin");
  const [regionId, setRegionId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [passwordEdits, setPasswordEdits] = useState<Record<string, string>>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!username.trim() || !password.trim()) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور.");
      return;
    }
    if (role === "region_admin" && !regionId) {
      setError("اختر المنطقة لمدير المنطقة.");
      return;
    }
    try {
      if (editingId) {
        updateMockAdminPassword(editingId, password);
        setSuccess("تم تحديث كلمة المرور.");
      } else {
        addMockAdmin({
          username: username.trim(),
          password: password.trim(),
          role,
          regionId: role === "region_admin" ? regionId : undefined,
        });
        setSuccess("تمت إضافة المستخدم.");
      }
      setKey((k) => k + 1);
      setUsername("");
      setPassword("");
      setEditingId(null);
      setShowForm(false);
    } catch {
      setError("فشل في الحفظ.");
    }
  };

  const handleEdit = (a: AdminUser) => {
    setUsername(a.username);
    setPassword("");
    setEditingId(a._id);
    setRole(a.role);
    setRegionId(a.regionId ?? "");
    setShowForm(true);
  };

  const handleChangePassword = (id: string) => {
    const pwd = passwordEdits[id]?.trim();
    if (!pwd) return;
    try {
      updateMockAdminPassword(id, pwd);
      setSuccess("تم تحديث كلمة المرور.");
      setPasswordEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setKey((k) => k + 1);
    } catch {
      setError("فشل في التحديث.");
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("حذف هذا المستخدم؟")) return;
    try {
      deleteMockAdmin(id);
      setSuccess("تم حذف المستخدم.");
      setKey((k) => k + 1);
    } catch {
      setError("فشل في الحذف.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">المدراء والمستخدمون</h2>
        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setUsername("");
            setPassword("");
            setRole("region_admin");
            setRegionId(regions[0]?._id ?? "");
          }}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {showForm ? "إلغاء" : "+ إضافة مستخدم"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="space-y-3 rounded-xl bg-white/10 p-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            required
            disabled={!!editingId}
            className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900 disabled:opacity-70"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={editingId ? "كلمة مرور جديدة (اتركها فارغة للإبقاء)" : "كلمة المرور"}
            className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            disabled={!!editingId}
            className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
          >
            <option value="super_admin">مدير عام (كل الصلاحيات)</option>
            <option value="region_admin">مدير منطقة (الباصات والأوقات لمنطقته فقط)</option>
          </select>
          {role === "region_admin" && (
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              required
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            >
              <option value="">اختر المنطقة</option>
              {regions.map((r) => (
                <option key={r._id} value={r._id}>{r.nameAr}</option>
              ))}
            </select>
          )}
          <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
            {editingId ? "تحديث كلمة المرور" : "إضافة"}
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {admins.map((a) => (
          <li
            key={a._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white/10 px-4 py-3 text-white"
          >
            <div>
              <span className="font-medium">{a.username}</span>
              <span className="mr-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {a.role === "super_admin" ? "مدير عام" : "مدير منطقة"}
              </span>
              {a.regionId && (
                <span className="text-sm text-white/70">
                  — {regions.find((r) => r._id === a.regionId)?.nameAr}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={passwordEdits[a._id] ?? ""}
                onChange={(e) =>
                  setPasswordEdits((prev) => ({ ...prev, [a._id]: e.target.value }))
                }
                placeholder="كلمة مرور جديدة"
                className="w-32 rounded border border-white/30 bg-white/20 px-2 py-1 text-sm text-white placeholder:text-white/60"
              />
              <button
                type="button"
                onClick={() => handleEdit(a)}
                className="rounded px-2 py-1 text-sm text-amber-300 hover:bg-amber-500/20"
              >
                تعديل
              </button>
              <button
                type="button"
                onClick={() => handleChangePassword(a._id)}
                className="rounded px-2 py-1 text-sm text-emerald-300 hover:bg-emerald-500/20"
              >
                تحديث كلمة المرور
              </button>
              <button
                type="button"
                onClick={() => handleDelete(a._id)}
                className="rounded px-2 py-1 text-sm text-red-300 hover:bg-red-500/20"
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BusesTab({
  buses,
  regions,
  cities,
  setKey,
  setError,
  setSuccess,
  busesByRegion,
}: {
  buses: Bus[];
  regions: Region[];
  cities: City[];
  setKey: (fn: (k: number) => number) => void;
  setError: (s: string) => void;
  setSuccess: (s: string) => void;
  busesByRegion: Record<string, Bus[]>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [cityId, setCityId] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("05:00");
  const [returnTime, setReturnTime] = useState("17:00");
  const [totalSeats, setTotalSeats] = useState(45);
  const [driverName, setDriverName] = useState("");

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">الباصات والأوقات</h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {showForm ? "إلغاء" : "+ إضافة باص"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddBus}
          className="grid gap-4 rounded-xl bg-white/10 p-6 sm:grid-cols-2"
        >
          <div>
            <label className="mb-1 block text-sm text-white/90">المدينة</label>
            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              required
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
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
            <label className="mb-1 block text-sm text-white/90">التاريخ</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/90">وقت الانطلاق</label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/90">وقت العودة</label>
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/90">عدد المقاعد</label>
            <input
              type="number"
              min={1}
              max={80}
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/90">اسم السائق</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              required
              placeholder="مثال: أحمد حسن"
              className="w-full rounded-lg border border-white/30 bg-white/90 px-3 py-2 text-stone-900"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700"
            >
              إضافة الباص
            </button>
          </div>
        </form>
      )}

      {buses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/30 bg-white/5 py-8 text-center text-white/70">
          لا توجد باصات. أضف باصاً أولاً.
        </p>
      ) : (
        <div className="space-y-6">
          {regions.map((region) => {
            const regionBuses = busesByRegion[region._id] ?? [];
            if (regionBuses.length === 0) return null;
            return (
              <div key={region._id} className="rounded-xl border border-white/20 bg-white/5 p-4">
                <h3 className="mb-3 text-lg font-medium text-emerald-300">
                  {region.nameAr} ({region.nameEn})
                </h3>
                <ul className="space-y-2">
                  {regionBuses.map((bus) => (
                    <li
                      key={bus._id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white/10 px-4 py-3 text-white"
                    >
                      <div>
                        <p className="font-medium">{bus.city.nameAr}</p>
                        <p className="text-sm text-white/70">
                          {formatDate(bus.departureTime)} · {formatTime(bus.departureTime)} ←→ {formatTime(bus.returnTime)}
                        </p>
                        <p className="text-xs text-white/60">السائق: {bus.driverName}</p>
                      </div>
                      <p className="font-medium text-emerald-300">
                        {bus.availableSeats} / {bus.totalSeats} مقعد
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
