import { IUser } from "../models/User";

export interface AuthResponse {
    _id: string;
    name: string,
    email: string;
    token: string;
}

export interface IAuthService {
    register(data: Partial<IUser>): Promise<AuthResponse>;
    login(email: string, password: string): Promise<AuthResponse>;
    validateUser(id: string): Promise<IUser | null>
}