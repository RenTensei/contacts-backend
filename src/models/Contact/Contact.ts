import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    favorite: {
      type: Boolean,
      default: false
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  { versionKey: false, timestamps: true }
);

// eslint-disable-next-line import/prefer-default-export
export const Contact = model('Contact', contactSchema);
