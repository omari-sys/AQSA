import { Router, Response } from "express";
import { AuthRequest, requireAuth } from "../middleware/auth";
import { listUserReservations } from "../services/reservationService";

export const reservationRouter = Router();

reservationRouter.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const reservations = await listUserReservations(req.user!.id);
    res.json(reservations);
  } catch {
    res.status(500).json({ message: "Failed to load reservations" });
  }
});

