import { IUserRepository } from '../interfaces/IUserRepository';
import User, { IUser } from '../models/User';
import { BaseRepository } from './baseRepository';


export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }
}