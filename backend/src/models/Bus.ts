import mongoose, { Schema, Document, Types } from "mongoose";

export type BusStatus = "preparing" | "departed" | "on_the_way" | "returned" | "finished";

export interface IBus extends Document {
  city: Types.ObjectId;
  departureTime: Date;
  returnTime: Date;
  totalSeats: number;
  availableSeats: number;
  driverName: string;
  status: BusStatus;
}

const BusSchema = new Schema<IBus>(
  {
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    departureTime: { type: Date, required: true },
    returnTime: { type: Date, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    driverName: { type: String, required: true },
    status: {
      type: String,
      enum: ["preparing", "departed", "on_the_way", "returned", "finished"],
      default: "preparing",
    },
  },
  { timestamps: true }
);

export const Bus = mongoose.model<IBus>("Bus", BusSchema);

