import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/IAuthService';
import { HttpStatus } from '../constants/http-status';
import { Messages } from '../constants/messages';
import { ApiResponse } from '../utils/api-response';


export class authController {
    constructor(private authService: IAuthService) { }


    register = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.register(req.body);
            const maxAge = Number(process.env.COOKIE_MAX_AGE)
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: maxAge,
            });
            const { token, ...userData } = result;
            ApiResponse.created(res, userData);
        } catch (error: unknown) {
            console.error("Registration error", error);
            const message = error instanceof Error ? error.message : Messages.AUTH.REGISTRATION_FAILED;
            ApiResponse.error(res, message, HttpStatus.BAD_REQUEST);
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            const maxAge = Number(process.env.COOKIE_MAX_AGE)
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: maxAge
            })
            const { token, ...userData } = result;
            ApiResponse.success(res, userData);
        } catch (error) {
            console.error("Login error", error);
            const message = error instanceof Error ? error.message : Messages.AUTH.LOGIN_FAILED;
            ApiResponse.error(res, message, HttpStatus.UNAUTHORIZED);
        }
    };
    logout = async (req: Request, res: Response) => {
        res.clearCookie("token");
        ApiResponse.success(res, null, Messages.AUTH.LOGOUT_SUCCESS);
    }
}

