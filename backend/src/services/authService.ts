import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, IUser, UserRole } from "../models/User";
import { env } from "../config/env";

export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<IUser> {
  const existing = await User.findOne({ email: params.email.toLowerCase() });
  if (existing) {
    throw new Error("EMAIL_TAKEN");
  }

  const passwordHash = await bcrypt.hash(params.password, 10);

  const user = new User({
    name: params.name,
    email: params.email.toLowerCase(),
    passwordHash,
    role: params.role ?? "user",
  });

  await user.save();
  return user;
}

export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<{ token: string; user: Pick<IUser, "_id" | "name" | "email" | "role"> }> {
  const user = await User.findOne({ email: params.email.toLowerCase() });
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const ok = await bcrypt.compare(params.password, user.passwordHash);
  if (!ok) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

