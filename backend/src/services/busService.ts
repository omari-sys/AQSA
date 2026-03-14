import { Bus, IBus, BusStatus } from "../models/Bus";
import { Reservation } from "../models/Reservation";

export async function listBuses(filter?: { cityId?: string }): Promise<IBus[]> {
  const query: Record<string, unknown> = {};
  if (filter?.cityId) {
    query.city = filter.cityId;
  }
  return Bus.find(query).populate("city").sort({ departureTime: 1 }).exec();
}

export async function createBus(data: {
  cityId: string;
  departureTime: string;
  returnTime: string;
  totalSeats: number;
  driverName: string;
}): Promise<IBus> {
  const bus = new Bus({
    city: data.cityId,
    departureTime: new Date(data.departureTime),
    returnTime: new Date(data.returnTime),
    totalSeats: data.totalSeats,
    availableSeats: data.totalSeats,
    driverName: data.driverName,
  });
  await bus.save();
  return bus;
}

export async function updateBus(
  busId: string,
  updates: Partial<{
    departureTime: string;
    returnTime: string;
    totalSeats: number;
    driverName: string;
    status: BusStatus;
  }>
): Promise<IBus | null> {
  const bus = await Bus.findById(busId);
  if (!bus) return null;

  if (updates.departureTime) bus.departureTime = new Date(updates.departureTime);
  if (updates.returnTime) bus.returnTime = new Date(updates.returnTime);
  if (updates.driverName) bus.driverName = updates.driverName;
  if (updates.status) bus.status = updates.status;
  if (typeof updates.totalSeats === "number") {
    const diff = updates.totalSeats - bus.totalSeats;
    bus.totalSeats = updates.totalSeats;
    bus.availableSeats += diff;
    if (bus.availableSeats < 0) bus.availableSeats = 0;
  }

  await bus.save();
  return bus;
}

export async function deleteBus(busId: string): Promise<void> {
  await Reservation.deleteMany({ bus: busId }).exec();
  await Bus.findByIdAndDelete(busId).exec();
}

export async function updateBusStatus(busId: string, status: BusStatus): Promise<IBus | null> {
  return Bus.findByIdAndUpdate(busId, { status }, { new: true }).exec();
}

