import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: {
        menuItem: mongoose.Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: 'Pending' | 'Preparing' | 'Dispatched' | 'Delivered' | 'Cancelled';
    specialInstructions?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
export default _default;
//# sourceMappingURL=Order.d.ts.map