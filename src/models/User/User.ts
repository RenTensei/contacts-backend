import { Schema, model } from 'mongoose';
import type { IUser } from '@/types/user.type';

const userSchema = new Schema<IUser>(
  {
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const UserModel = model('User', userSchema);
