import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IReservation, {}, {}, {}, Document<unknown, {}, IReservation, {}, mongoose.DefaultSchemaOptions> & IReservation & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IReservation>;
export default _default;
//# sourceMappingURL=Reservation.d.ts.map