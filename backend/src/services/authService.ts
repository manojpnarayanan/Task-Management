import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser } from "../models/User";
import  jwt  from "jsonwebtoken";


export class AuthService{
    constructor(private userRepo:IUserRepository){}

    private generateToken(id:string):string{
        return jwt.sign(
            {id},
            process.env.JWT_SECRET!,
            {expiresIn:'3d'}
        )
    }
    async register(data:Partial<IUser>){
        const {name,email,password}=data;
        if(!name || !email || !password){
            throw new Error("Please fill all fields")
        };
        if(name.trim().length ===0){
            throw new Error("kPlease enter a valid name")
        }
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            throw new Error("Please provide a valid email")
        }
        if(password.length <6){
            throw new Error("Password must be atlest 6 characters long")
        }

        const userExists=await this.userRepo.findByEmail(email)
        if(userExists){
            throw new Error("User already exists")
        }
        const user=await this.userRepo.create({name,email,password});

        return {
            _id:user._id,
            name:user.name,
            email:user.email,
            token:this.generateToken(user._id.toString())
        }
    }
    async login(email:string,password:string){
        const user=await this.userRepo.findByEmail(email);

        if(!email || !password)throw new Error("Email and passwprd are required");

        if(user && await user.comparePassword(password)){
            return{
                _id:user._id,
                name:user.name,
                email:user.email,
                token:this.generateToken(user._id.toString())
            }
        }else{
            throw new Error("Invalid email or password");
        }
    }
}