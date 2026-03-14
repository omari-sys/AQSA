import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReservation extends Document {
  user: Types.ObjectId;
  bus: Types.ObjectId;
  seats: number;
}

const ReservationSchema = new Schema<IReservation>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bus: { type: Schema.Types.ObjectId, ref: "Bus", required: true },
    seats: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model<IReservation>("Reservation", ReservationSchema);

