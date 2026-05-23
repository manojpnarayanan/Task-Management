import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import AuthRequest
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser } from "../models/User";
import { AppError } from "../utils/app-error";
import { HttpStatus } from "../constants/http-status";
import { Messages } from "../constants/messages";
import { IAuthService } from "../interfaces/IAuthService";



// interface JwtPayload {
//     id: string;
// }

export interface AuthRequest extends Request {
    user?: IUser | null;
}

export class AuthMiddleware {
    constructor(private authService: IAuthService) { }

    protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
        let token: string | undefined;

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        else if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw new AppError(Messages.AUTH.UNAUTHORIZED,HttpStatus.UNAUTHORIZED);
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            const user = await this.authService.validateUser(decoded.id);

            if (!user) {
                throw new AppError(Messages.AUTH.USER_NOT_FOUND,HttpStatus.UNAUTHORIZED)
            }

            req.user = user;
            return next();
        } catch (error) {
            next(new AppError(Messages.AUTH.TOKEN_FAILED,HttpStatus.UNAUTHORIZED));
        }
    }
}
