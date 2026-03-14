import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { authRouter } from "./routes/authRoutes";
import { cityRouter } from "./routes/cityRoutes";
import { busRouter } from "./routes/busRoutes";
import { reservationRouter } from "./routes/reservationRoutes";

async function bootstrap() {
  await connectDatabase();

  const app = express();

  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/cities", cityRouter);
  app.use("/api/buses", busRouter);
  app.use("/api/reservations", reservationRouter);

  app.listen(env.port, () => {
    console.log(`🚍 Aqsa Visit API listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});

