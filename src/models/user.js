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
    trim: true,
    index: true
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
    default: true,
    index: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
    index: true
  },
  profileImage: {
    type: String,
    required: false,
    default: null
  }
}, {
  timestamps: true
});

// Índices compuestos útiles
userSchema.index({ email: 1, isActive: 1 }); // Para búsquedas de login
userSchema.index({ isActive: 1, isAdmin: 1 }); // Para filtrar usuarios activos/admin
userSchema.index({ firstName: 1, lastName: 1 }); // Para búsquedas por nombre completo
userSchema.index({ createdAt: -1 }); // Para ordenar por fecha de registro

const User = mongoose.model("User", userSchema);

export default User;
