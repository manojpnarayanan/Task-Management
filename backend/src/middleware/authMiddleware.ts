import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser } from "../models/User";


interface JwtPayload {
    id: string;
}

export interface AuthRequest extends Request {
    user?: IUser | null;
}

export class AuthMiddleware {
    constructor(private userRepo: IUserRepository) { }

    protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
        let token: string | undefined;
        if (req.headers.authorization?.startsWith("Bearer")) {
            try {
                token = req.headers.authorization.split(" ")[1];

                const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
                const user = await this.userRepo.findById(decoded.id);
                if (!user) {
                    return res.status(401).json({ message: "User not found" })
                }
                req.user = user;
                return next();
            } catch (error) {
                return res.status(401).json({ message: "Not authorized" })
            }
        }
        if (!token) {
            return res.status(401).json({ message: "Not authorized" })
        }
    }
}