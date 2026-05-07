import { IUserRepository } from '../interfaces/IUserRepository';
import User from '../models/User';
import user,{IUser} from '../models/User';


export class UserRepository implements IUserRepository{
    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({email});
    }
    async create(userData: Partial<IUser>): Promise<IUser> {
        return await User.create(userData)
    }
    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id)
    }
}