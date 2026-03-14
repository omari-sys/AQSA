import mongoose, { Schema, Document } from "mongoose";

export interface ICity extends Document {
  name: string;
}

const CitySchema = new Schema<ICity>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const City = mongoose.model<ICity>("City", CitySchema);

