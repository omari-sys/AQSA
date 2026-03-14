import { Router, Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { requireAuth, AuthRequest } from "../middleware/auth";

export const authRouter = Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = await registerUser({ name, email, password });
    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return res.status(409).json({ message: "Email already in use" });
    }
    return res.status(500).json({ message: "Failed to register user" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }
    const { token, user } = await loginUser({ email, password });
    return res.json({ token, user });
  } catch (error: any) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.status(500).json({ message: "Failed to login" });
  }
});

authRouter.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  return res.json(req.user);
});

