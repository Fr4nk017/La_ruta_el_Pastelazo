import { Router } from "express";
import {
    getUserProfile,
    loginUser,
    registerUser,
    updateUserProfile
} from "../controller/userController.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema, updateUserSchema } from "../schemas/userSchemas.js";

const router = Router();

// Rutas públicas (sin autenticación)
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

// Rutas protegidas (requieren autenticación)
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, validate(updateUserSchema), updateUserProfile);

export default router;