import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || "4000",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aqsa_visit",
  jwtSecret: process.env.JWT_SECRET || "change_me_in_production",
};

