// Mock data for standalone UI. Replace with API when connecting to BE.
// بلاد الداخل = regions (countries/areas), each has cities (villages), each city has buses

export type BusStatus = "preparing" | "departed" | "on_the_way" | "returned" | "finished";

export type AdminRole = "super_admin" | "region_admin";

export interface AdminUser {
  _id: string;
  username: string;
  role: AdminRole;
  regionId?: string; // for region_admin
  passwordHash?: string; // mock: plain stored for demo only
}

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

export interface UserLocation {
  regionId: string;
  cityId?: string;
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
  userName: string;
  userPhone?: string;
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
const STORAGE_REGIONS = "aqsa-visit-mock-regions";
const STORAGE_CITIES = "aqsa-visit-mock-cities";
const STORAGE_ADMINS = "aqsa-visit-mock-admins";
const STORAGE_USER_LOCATION = "aqsa-visit-user-location";

function loadBusesFromStorage(): Bus[] {
  if (typeof window === "undefined") return MOCK_BUSES_LIST;
  try {
    const raw = localStorage.getItem(STORAGE_BUSES);
    if (!raw) return MOCK_BUSES_LIST;
    const parsed = JSON.parse(raw) as Bus[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      const citiesMap = getCitiesMap();
      const regionsMap = getRegionsMap();
      MOCK_BUSES_LIST = parsed.map((b) => ({
        ...b,
        city: citiesMap[b.city._id] ?? b.city,
        region: regionsMap[b.region?._id ?? b.city.regionId] ?? b.region,
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

export function addMockReservation(input: {
  busId: string;
  seats: number;
  userName: string;
  userPhone?: string;
}): Reservation | null {
  const buses = getMockBusesAll();
  const bus = buses.find((b) => b._id === input.busId);
  if (!bus) return null;
  const available = getBusAvailableSeats(bus);
  if (available < input.seats) return null;
  const reservation: Reservation = {
    _id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    bus,
    seats: input.seats,
    userName: input.userName.trim(),
    userPhone: input.userPhone?.trim(),
    createdAt: new Date().toISOString(),
  };
  inMemoryReservations = [...getMockReservations(), reservation];
  saveReservationsToStorage(inMemoryReservations);
  return reservation;
}

function loadRegionsFromStorage(): Region[] {
  if (typeof window === "undefined") return REGIONS;
  try {
    const raw = localStorage.getItem(STORAGE_REGIONS);
    if (!raw) return REGIONS;
    const parsed = JSON.parse(raw) as Region[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : REGIONS;
  } catch {
    return REGIONS;
  }
}

function saveRegionsToStorage(regions: Region[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_REGIONS, JSON.stringify(regions));
  } catch {}
}

function loadCitiesFromStorage(): City[] {
  if (typeof window === "undefined") return CITIES;
  try {
    const raw = localStorage.getItem(STORAGE_CITIES);
    if (!raw) return CITIES;
    const parsed = JSON.parse(raw) as City[];
    return Array.isArray(parsed) ? parsed : CITIES;
  } catch {
    return CITIES;
  }
}

function saveCitiesToStorage(cities: City[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_CITIES, JSON.stringify(cities));
  } catch {}
}

export function getMockRegions(): Region[] {
  return loadRegionsFromStorage();
}

export function getMockCities(regionId?: string): City[] {
  const cities = loadCitiesFromStorage();
  if (regionId) return cities.filter((c) => c.regionId === regionId);
  return [...cities];
}

function getCitiesMap(): Record<string, City> {
  const cities = loadCitiesFromStorage();
  return Object.fromEntries(cities.map((c) => [c._id, c]));
}

function getRegionsMap(): Record<string, Region> {
  const regions = loadRegionsFromStorage();
  return Object.fromEntries(regions.map((r) => [r._id, r]));
}

export function addMockRegion(input: { nameAr: string; nameEn: string }): Region {
  const regions = loadRegionsFromStorage();
  const id = `r-${Date.now()}`;
  const region: Region = { _id: id, nameAr: input.nameAr.trim(), nameEn: input.nameEn.trim() };
  regions.push(region);
  saveRegionsToStorage(regions);
  return region;
}

export function updateMockRegion(id: string, input: { nameAr?: string; nameEn?: string }): Region | null {
  const regions = loadRegionsFromStorage();
  const idx = regions.findIndex((r) => r._id === id);
  if (idx < 0) return null;
  if (input.nameAr !== undefined) regions[idx].nameAr = input.nameAr.trim();
  if (input.nameEn !== undefined) regions[idx].nameEn = input.nameEn.trim();
  saveRegionsToStorage(regions);
  return regions[idx];
}

export function deleteMockRegion(id: string): boolean {
  const regions = loadRegionsFromStorage();
  const filtered = regions.filter((r) => r._id !== id);
  if (filtered.length === regions.length) return false;
  saveRegionsToStorage(filtered);
  const cities = loadCitiesFromStorage().filter((c) => c.regionId !== id);
  saveCitiesToStorage(cities);
  return true;
}

export function addMockCity(input: { regionId: string; nameAr: string; nameEn: string }): City {
  const cities = loadCitiesFromStorage();
  const id = `c-${Date.now()}`;
  const city: City = {
    _id: id,
    regionId: input.regionId,
    nameAr: input.nameAr.trim(),
    nameEn: input.nameEn.trim(),
  };
  cities.push(city);
  saveCitiesToStorage(cities);
  return city;
}

export function updateMockCity(id: string, input: { regionId?: string; nameAr?: string; nameEn?: string }): City | null {
  const cities = loadCitiesFromStorage();
  const idx = cities.findIndex((c) => c._id === id);
  if (idx < 0) return null;
  if (input.regionId !== undefined) cities[idx].regionId = input.regionId;
  if (input.nameAr !== undefined) cities[idx].nameAr = input.nameAr.trim();
  if (input.nameEn !== undefined) cities[idx].nameEn = input.nameEn.trim();
  saveCitiesToStorage(cities);
  return cities[idx];
}

export function deleteMockCity(id: string): boolean {
  const cities = loadCitiesFromStorage();
  const filtered = cities.filter((c) => c._id !== id);
  if (filtered.length === cities.length) return false;
  saveCitiesToStorage(filtered);
  return true;
}

// Sub-admins
const DEFAULT_ADMINS: AdminUser[] = [
  { _id: "admin-1", username: "admin", role: "super_admin" },
  { _id: "admin-2", username: "nazareth_admin", role: "region_admin", regionId: "r5", passwordHash: "naz123" },
];

function loadAdminsFromStorage(): AdminUser[] {
  if (typeof window === "undefined") return DEFAULT_ADMINS;
  try {
    const raw = localStorage.getItem(STORAGE_ADMINS);
    if (!raw) return DEFAULT_ADMINS;
    const parsed = JSON.parse(raw) as AdminUser[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ADMINS;
  } catch {
    return DEFAULT_ADMINS;
  }
}

function saveAdminsToStorage(admins: AdminUser[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_ADMINS, JSON.stringify(admins));
  } catch {}
}

export function getMockAdmins(): AdminUser[] {
  return loadAdminsFromStorage();
}

export function addMockAdmin(input: { username: string; password: string; role: AdminRole; regionId?: string }): AdminUser {
  const admins = loadAdminsFromStorage();
  const id = `admin-${Date.now()}`;
  const user: AdminUser = {
    _id: id,
    username: input.username.trim(),
    role: input.role,
    regionId: input.role === "region_admin" ? input.regionId : undefined,
    passwordHash: input.password,
  };
  admins.push(user);
  saveAdminsToStorage(admins);
  return user;
}

export function updateMockAdminPassword(id: string, newPassword: string): boolean {
  const admins = loadAdminsFromStorage();
  const idx = admins.findIndex((a) => a._id === id);
  if (idx < 0) return false;
  admins[idx].passwordHash = newPassword;
  saveAdminsToStorage(admins);
  return true;
}

export function deleteMockAdmin(id: string): boolean {
  const admins = loadAdminsFromStorage();
  const filtered = admins.filter((a) => a._id !== id);
  if (filtered.length === admins.length) return false;
  saveAdminsToStorage(filtered);
  return true;
}

// User location (region/city) persistence
export function getUserLocation(): UserLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_USER_LOCATION);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserLocation;
    if (parsed?.regionId) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function setUserLocation(loc: UserLocation | null) {
  if (typeof window === "undefined") return;
  try {
    if (loc) localStorage.setItem(STORAGE_USER_LOCATION, JSON.stringify(loc));
    else localStorage.removeItem(STORAGE_USER_LOCATION);
  } catch {}
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
  const cities = loadCitiesFromStorage();
  const regionsMap = getRegionsMap();
  const city = cities.find((c) => c._id === input.cityId);
  const region = city ? regionsMap[city.regionId] : undefined;
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
