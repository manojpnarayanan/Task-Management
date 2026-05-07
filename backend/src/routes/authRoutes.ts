import express from 'express';
import { authController } from '../controllers/authcontroller';
import { AuthService } from '../services/authService';
import { UserRepository } from '../repositories/userRepository';


const router=express.Router();

const userRepo=new UserRepository();
const authService=new AuthService(userRepo);
const authCtrl=new authController(authService);

router.post('/register',authCtrl.register);
router.post('/login',authCtrl.login);


export default router;