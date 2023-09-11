import { Schema, model } from 'mongoose';

import type { IUser } from '@/types/user.type';

const userSchema = new Schema<IUser>(
  {
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter'
    },
    token: {
      type: String,
      default: null
    },
    avatarURL: {
      type: String,
      required: true
    },
    verify: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null
    }
  },
  { versionKey: false, timestamps: true }
);

// eslint-disable-next-line import/prefer-default-export
export const UserModel = model('User', userSchema);
