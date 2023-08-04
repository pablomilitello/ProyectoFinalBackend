import mongoose from 'mongoose';

export const ROLE_USER = 'user';
export const ROLE_ADMIN = 'admin';
export const ROLE_PREMIUM = 'premium';

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
  },
  cart: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Carts',
  },
  role: {
    type: String,
    default: ROLE_USER,
  },
  documents: [documentSchema],
  last_connection: {
    type: Date,
  },
});

export const userModel = mongoose.model('Users', usersSchema);
