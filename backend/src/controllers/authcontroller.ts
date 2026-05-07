import { Request, Response } from 'express';
import { AuthService } from '../services/authService';


export class authController {
    constructor(private authService: AuthService) { }


    register = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.register(req.body);
            const maxAge = Number(process.env.COOKIE_MAX_AGE)
            res.cookie("token",result.token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',
                sameSite:'strict',
                maxAge:maxAge,
            });
            const {token,...userData} =result;
            res.status(201).json(userData);
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
            const maxAge = Number(process.env.COOKIE_MAX_AGE)
            res.cookie("token",result.token,{
                httpOnly:true,
                secure:process.env.NODE_ENV === 'production',
                sameSite:'strict',
                maxAge:maxAge
            })
            const {token,...userData}=result;
            res.json(userData);
        } catch (error) {
            console.error("Login error",error);
            const message = error instanceof Error ? error.message : "Login failed";
            res.status(401).json({message})
        }
    };
    logout=async(req:Request,res:Response)=>{
        res.clearCookie("token");
        res.json({message:"Logged out successfully"});
    }
}

