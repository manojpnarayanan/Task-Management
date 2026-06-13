import { IAuthService, AuthResponse } from "../interfaces/IAuthService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import { HttpStatus } from '../constants/http-status';
import { Messages } from '../constants/messages'
import { AppError } from '../utils/app-error'



export class AuthService implements IAuthService {
    constructor(private userRepo: IUserRepository) { }

    private generateToken(id: string): string {
        return jwt.sign(
            { id },
            process.env.JWT_SECRET!,
            { expiresIn: '3d' }
        )
    }
    async register(data: Partial<IUser>): Promise<AuthResponse> {
        const { name, email, password } = data;
        if (!email) throw new AppError("Email required", HttpStatus.BAD_REQUEST);

        const userExists = await this.userRepo.findByEmail(email)
        if (userExists) {
            throw new AppError(Messages.AUTH.USER_EXISTS, HttpStatus.BAD_REQUEST)
        }
        const user = await this.userRepo.create({ name, email, password } as IUser);

        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            token: this.generateToken(user._id.toString())
        }
    }
    async login(email: string, password: string): Promise<AuthResponse> {
        const user = await this.userRepo.findByEmail(email);

        if (user && await user.comparePassword(password)) {
            return {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                token: this.generateToken(user._id.toString())
            }
        } else {
            throw new AppError(Messages.AUTH.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }
    }
    async validateUser(id: string): Promise<IUser | null> {
        return await this.userRepo.findById(id)
    }
}