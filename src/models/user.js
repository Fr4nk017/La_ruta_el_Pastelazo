import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
    minLength: 6
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    minLength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  phone: {
    type: String,
    trim: true,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    required: false,
    default: null
  }
}, {
  timestamps: true
});

// Índice único en email (ya declarado con unique: true arriba)
// Índice único en teléfono
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

export const User = mongoose.model("User", userSchema);

export default User;
