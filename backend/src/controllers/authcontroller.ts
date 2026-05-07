import { Request, Response } from 'express';
import { AuthService } from '../services/authService';


export class authController {
    constructor(private authService: AuthService) { }


    register = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json(result);
        } catch (error: unknown) {
            console.error("Registration error",error);
            const message = error instanceof Error ? error.message : "Registration failed";
            res.status(400).json({message})
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (error) {
            console.error("Login error",error);
            const message = error instanceof Error ? error.message : "Login failed";
            res.status(401).json({message})
        }
    };
}

