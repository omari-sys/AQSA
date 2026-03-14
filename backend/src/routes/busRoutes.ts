import { Router, Request, Response } from "express";
import { requireAdmin, AuthRequest, requireAuth } from "../middleware/auth";
import { listBuses, createBus, updateBus, deleteBus, updateBusStatus } from "../services/busService";
import { createReservation, listBusPassengers } from "../services/reservationService";

export const busRouter = Router();

busRouter.get("/", async (req: Request, res: Response) => {
  const cityId = typeof req.query.cityId === "string" ? req.query.cityId : undefined;
  const buses = await listBuses({ cityId });
  res.json(buses);
});

busRouter.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { cityId, departureTime, returnTime, totalSeats, driverName } = req.body;
    const bus = await createBus({
      cityId,
      departureTime,
      returnTime,
      totalSeats: Number(totalSeats),
      driverName,
    });
    res.status(201).json(bus);
  } catch {
    res.status(500).json({ message: "Failed to create bus" });
  }
});

function getBusId(req: Request): string {
  const p = req.params.busId;
  return Array.isArray(p) ? p[0] ?? "" : p ?? "";
}

busRouter.put("/:busId", requireAdmin, async (req: Request, res: Response) => {
  try {
    const bus = await updateBus(getBusId(req), req.body);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch {
    res.status(500).json({ message: "Failed to update bus" });
  }
});

busRouter.delete("/:busId", requireAdmin, async (req: Request, res: Response) => {
  try {
    await deleteBus(getBusId(req));
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Failed to delete bus" });
  }
});

busRouter.patch("/:busId/status", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const bus = await updateBusStatus(getBusId(req), status);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch {
    res.status(500).json({ message: "Failed to update status" });
  }
});

busRouter.post("/:busId/reservations", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const seats = Number(req.body.seats ?? 1);
    const reservation = await createReservation({
      userId: req.user!.id,
      busId: getBusId(req),
      seats,
    });
    res.status(201).json(reservation);
  } catch (error: any) {
    if (error instanceof Error && error.message === "BUS_NOT_FOUND") {
      return res.status(404).json({ message: "Bus not found" });
    }
    if (error instanceof Error && error.message === "NOT_ENOUGH_SEATS") {
      return res.status(400).json({ message: "Not enough seats available" });
    }
    res.status(500).json({ message: "Failed to create reservation" });
  }
});

busRouter.get("/:busId/passengers", requireAdmin, async (req: Request, res: Response) => {
  try {
    const passengers = await listBusPassengers(getBusId(req));
    res.json(passengers);
  } catch {
    res.status(500).json({ message: "Failed to load passengers" });
  }
});

