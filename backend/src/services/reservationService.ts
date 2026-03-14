import { Reservation, IReservation } from "../models/Reservation";
import { Bus } from "../models/Bus";

export async function createReservation(params: {
  userId: string;
  busId: string;
  seats: number;
}): Promise<IReservation> {
  const bus = await Bus.findById(params.busId);
  if (!bus) {
    throw new Error("BUS_NOT_FOUND");
  }
  if (bus.availableSeats < params.seats) {
    throw new Error("NOT_ENOUGH_SEATS");
  }

  bus.availableSeats -= params.seats;
  await bus.save();

  const reservation = new Reservation({
    user: params.userId,
    bus: params.busId,
    seats: params.seats,
  });
  await reservation.save();

  return reservation;
}

export async function listUserReservations(userId: string): Promise<IReservation[]> {
  return Reservation.find({ user: userId })
    .populate("bus")
    .populate({ path: "bus", populate: { path: "city" } })
    .sort({ createdAt: -1 })
    .exec();
}

export async function listBusPassengers(busId: string): Promise<IReservation[]> {
  return Reservation.find({ bus: busId })
    .populate("user")
    .sort({ createdAt: 1 })
    .exec();
}

