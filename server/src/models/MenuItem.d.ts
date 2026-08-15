import mongoose, { Document } from 'mongoose';
export interface IMenuItem extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    isAvailable: boolean;
    stockQuantity: number;
    dietary?: string[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMenuItem, {}, {}, {}, Document<unknown, {}, IMenuItem, {}, mongoose.DefaultSchemaOptions> & IMenuItem & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMenuItem>;
export default _default;
//# sourceMappingURL=MenuItem.d.ts.map