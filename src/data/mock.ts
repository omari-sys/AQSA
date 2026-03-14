// Mock data for standalone UI. Replace with API when connecting to BE.
// بلاد الداخل = regions, each has cities, each city has buses

export type BusStatus = "preparing" | "departed" | "on_the_way" | "returned" | "finished";

export interface Region {
  _id: string;
  nameAr: string;
  nameEn: string;
}

export interface City {
  _id: string;
  regionId: string;
  nameAr: string;
  nameEn: string;
}

export interface Bus {
  _id: string;
  city: City;
  region: Region;
  departureTime: string;
  returnTime: string;
  totalSeats: number;
  availableSeats: number;
  driverName: string;
  status: BusStatus;
}

export interface Reservation {
  _id: string;
  bus: Bus;
  seats: number;
  createdAt: string;
}

// بلاد الداخل - مناطق
const REGIONS: Region[] = [
  { _id: "r1", nameAr: "المثلث", nameEn: "Triangle" },
  { _id: "r2", nameAr: "الجليل", nameEn: "Galilee" },
  { _id: "r3", nameAr: "النقب", nameEn: "Negev" },
  { _id: "r4", nameAr: "حيفا", nameEn: "Haifa" },
  { _id: "r5", nameAr: "الناصرة والعفولة", nameEn: "Nazareth & Afula" },
];

const CITIES: City[] = [
  { _id: "c1", regionId: "r1", nameAr: "الطيبة", nameEn: "Tayibe" },
  { _id: "c2", regionId: "r1", nameAr: "باقة الغربية", nameEn: "Baqa al-Gharbiyye" },
  { _id: "c3", regionId: "r1", nameAr: "قلنسوة", nameEn: "Qalansuwa" },
  { _id: "c4", regionId: "r2", nameAr: "سخنين", nameEn: "Sakhnin" },
  { _id: "c5", regionId: "r2", nameAr: "عكا", nameEn: "Acre" },
  { _id: "c6", regionId: "r2", nameAr: "شعفاط", nameEn: "Shuafat" },
  { _id: "c7", regionId: "r3", nameAr: "رهط", nameEn: "Rahat" },
  { _id: "c8", regionId: "r3", nameAr: "عارة", nameEn: "Ar'ara" },
  { _id: "c9", regionId: "r4", nameAr: "حيفا", nameEn: "Haifa" },
  { _id: "c10", regionId: "r5", nameAr: "الناصرة", nameEn: "Nazareth" },
  { _id: "c11", regionId: "r5", nameAr: "العفولة", nameEn: "Afula" },
];

const CITIES_MAP = Object.fromEntries(CITIES.map((c) => [c._id, c]));
const REGIONS_MAP = Object.fromEntries(REGIONS.map((r) => [r._id, r]));

const MOCK_BUSES_RAW: Omit<Bus, "city" | "region">[] = [
  {
    _id: "b1",
    departureTime: "2025-03-20T05:00:00.000Z",
    returnTime: "2025-03-20T17:00:00.000Z",
    totalSeats: 45,
    availableSeats: 45,
    driverName: "أحمد حسن",
    status: "preparing",
  },
  {
    _id: "b2",
    departureTime: "2025-03-20T06:30:00.000Z",
    returnTime: "2025-03-20T18:30:00.000Z",
    totalSeats: 45,
    availableSeats: 45,
    driverName: "عمر خليل",
    status: "preparing",
  },
  {
    _id: "b3",
    departureTime: "2025-03-21T05:00:00.000Z",
    returnTime: "2025-03-21T17:00:00.000Z",
    totalSeats: 50,
    availableSeats: 50,
    driverName: "يوسف محمود",
    status: "preparing",
  },
  {
    _id: "b4",
    departureTime: "2025-03-21T06:00:00.000Z",
    returnTime: "2025-03-21T18:00:00.000Z",
    totalSeats: 45,
    availableSeats: 45,
    driverName: "إبراهيم صالح",
    status: "preparing",
  },
  {
    _id: "b5",
    departureTime: "2025-03-22T05:00:00.000Z",
    returnTime: "2025-03-22T17:00:00.000Z",
    totalSeats: 45,
    availableSeats: 45,
    driverName: "خالد ناصر",
    status: "preparing",
  },
  {
    _id: "b6",
    departureTime: "2025-03-22T06:00:00.000Z",
    returnTime: "2025-03-22T18:00:00.000Z",
    totalSeats: 45,
    availableSeats: 45,
    driverName: "محمد علي",
    status: "preparing",
  },
];

function buildBuses(): Bus[] {
  return MOCK_BUSES_RAW.map((b, i) => {
    const city = CITIES[i % CITIES.length];
    const region = REGIONS_MAP[city.regionId];
    return {
      ...b,
      city,
      region: region!,
    };
  });
}

let MOCK_BUSES_LIST: Bus[] = buildBuses();

const STORAGE_BUSES = "aqsa-visit-mock-buses";
const STORAGE_RESERVATIONS = "aqsa-visit-mock-reservations";

function loadBusesFromStorage(): Bus[] {
  if (typeof window === "undefined") return MOCK_BUSES_LIST;
  try {
    const raw = localStorage.getItem(STORAGE_BUSES);
    if (!raw) return MOCK_BUSES_LIST;
    const parsed = JSON.parse(raw) as Bus[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      MOCK_BUSES_LIST = parsed.map((b) => ({
        ...b,
        city: CITIES_MAP[b.city._id] ?? b.city,
        region: REGIONS_MAP[b.region?._id ?? b.city.regionId] ?? b.region,
      }));
    }
    return MOCK_BUSES_LIST;
  } catch {
    return MOCK_BUSES_LIST;
  }
}

function saveBusesToStorage(buses: Bus[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_BUSES, JSON.stringify(buses));
  } catch {}
}

function loadReservationsFromStorage(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_RESERVATIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReservationsToStorage(items: Reservation[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_RESERVATIONS, JSON.stringify(items));
  } catch {}
}

let inMemoryReservations: Reservation[] = [];

export function getMockReservations(): Reservation[] {
  if (typeof window !== "undefined") {
    inMemoryReservations = loadReservationsFromStorage();
  }
  return [...inMemoryReservations];
}

function reservedSeatsByBus(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const r of getMockReservations()) {
    map[r.bus._id] = (map[r.bus._id] ?? 0) + r.seats;
  }
  return map;
}

export function getBusAvailableSeats(bus: Bus): number {
  const reserved = reservedSeatsByBus()[bus._id] ?? 0;
  return Math.max(0, bus.totalSeats - reserved);
}

export function addMockReservation(busId: string, seats: number): Reservation | null {
  const buses = getMockBusesAll();
  const bus = buses.find((b) => b._id === busId);
  if (!bus) return null;
  const available = getBusAvailableSeats(bus);
  if (available < seats) return null;
  const reservation: Reservation = {
    _id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    bus,
    seats,
    createdAt: new Date().toISOString(),
  };
  inMemoryReservations = [...getMockReservations(), reservation];
  saveReservationsToStorage(inMemoryReservations);
  return reservation;
}

export function getMockRegions(): Region[] {
  return [...REGIONS];
}

export function getMockCities(regionId?: string): City[] {
  if (regionId) return CITIES.filter((c) => c.regionId === regionId);
  return [...CITIES];
}

export function getMockBusesAll(): Bus[] {
  if (typeof window !== "undefined") {
    MOCK_BUSES_LIST = loadBusesFromStorage();
  }
  return MOCK_BUSES_LIST.map((b) => ({
    ...b,
    availableSeats: getBusAvailableSeats(b),
  }));
}

export function getMockBuses(filters?: {
  regionId?: string;
  cityId?: string;
}): Bus[] {
  let list = getMockBusesAll();
  if (filters?.regionId) {
    list = list.filter((b) => b.region._id === filters.regionId);
  }
  if (filters?.cityId) {
    list = list.filter((b) => b.city._id === filters.cityId);
  }
  return list;
}

export function getMockBusById(busId: string): Bus | undefined {
  const bus = getMockBusesAll().find((b) => b._id === busId);
  return bus ? { ...bus, availableSeats: getBusAvailableSeats(bus) } : undefined;
}

export function addMockBus(input: {
  cityId: string;
  departureTime: string;
  returnTime: string;
  totalSeats: number;
  driverName: string;
}): Bus {
  const city = CITIES.find((c) => c._id === input.cityId);
  const region = city ? REGIONS_MAP[city.regionId] : undefined;
  if (!city || !region) throw new Error("City not found");
  const bus: Bus = {
    _id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    city,
    region,
    departureTime: input.departureTime,
    returnTime: input.returnTime,
    totalSeats: input.totalSeats,
    availableSeats: input.totalSeats,
    driverName: input.driverName,
    status: "preparing",
  };
  if (typeof window !== "undefined") {
    loadBusesFromStorage();
  }
  MOCK_BUSES_LIST = [...MOCK_BUSES_LIST, bus];
  saveBusesToStorage(MOCK_BUSES_LIST);
  return bus;
}
