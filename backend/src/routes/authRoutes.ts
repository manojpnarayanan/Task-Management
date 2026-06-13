import express from 'express';
import { authController } from '../controllers/authcontroller';
import { AuthService } from '../services/authService';
import { UserRepository } from '../repositories/userRepository';
import { loginSchema, registerSchema } from '../schema/auth.schema';
import { validate } from '../middleware/validation.middleware';

const router = express.Router();

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authCtrl = new authController(authService);

router.post('/register', validate(registerSchema), authCtrl.register);
router.post('/login', validate(loginSchema), authCtrl.login);
router.post('/logout', authCtrl.logout);

export default router;