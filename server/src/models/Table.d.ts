import mongoose, { Document } from 'mongoose';
export interface ITable extends Document {
    tableNumber: string;
    capacity: number;
    isActive: boolean;
}
declare const _default: mongoose.Model<ITable, {}, {}, {}, Document<unknown, {}, ITable, {}, mongoose.DefaultSchemaOptions> & ITable & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITable>;
export default _default;
//# sourceMappingURL=Table.d.ts.map