import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'customer' | 'admin';
  phone?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: { type: String },
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
