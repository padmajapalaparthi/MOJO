import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  user: mongoose.Types.ObjectId;
  table: mongoose.Types.ObjectId;
  date: string;
  time: string;
  endTime: string;
  partySize: number;
  guestName: string;
  guestPhone: string;
  guestProof: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    partySize: {
      type: Number,
      required: true,
      min: 1,
    },
    guestName: {
      type: String,
      required: false,
    },
    guestPhone: {
      type: String,
      required: false,
    },
    guestProof: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    specialRequests: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
