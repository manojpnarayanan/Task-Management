import { IUser } from "../models/User";


export interface IUserRepository{
    findByEmail(email:string):Promise<IUser | null>;
    create(userData:Partial<IUser>):Promise<IUser>;
    findById(id:string):Promise<IUser | null>
}