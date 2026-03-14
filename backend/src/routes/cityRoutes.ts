import { Router, Request, Response } from "express";
import { listCities, createCity } from "../services/cityService";
import { requireAdmin } from "../middleware/auth";

export const cityRouter = Router();

cityRouter.get("/", async (_req: Request, res: Response) => {
  const cities = await listCities();
  res.json(cities);
});

cityRouter.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const city = await createCity(name);
    res.status(201).json(city);
  } catch {
    res.status(500).json({ message: "Failed to create city" });
  }
});

