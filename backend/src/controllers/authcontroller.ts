import {Request,Response} from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';


const generateToken=(id:string)=>{
    return jwt.sign(
        {id},
    process.env.JWT_SECRET!,
    {expiresIn:"3d"}
    );
};

export const register=async (req:Request,res:Response)=>{
    try{
        const {name,email,password}=req.body;
        console.log(req.body)
        if(!name || !email || !password){
            return res.status(400).json({message:"Pleas fill all fields"})
        }
        console.log("1")
        if(name.trim().length === 0){
            return res.status(400).json({message:"enter a name"})
        }
        console.log("2")
        const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Please provide a valid email Address"})
        }
        console.log("3")
        if(password.length <6){
            return res.status(400).json({message:"Password must contain at least 6 characters long"})
        }

        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }

        console.log("4")
        const user=await User.create({name,email,password});
        console.log("User created",user)
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id.toString())
        })
    }catch(error){
        res.status(500).json({message:"Server error",error})
    }
}
export const login=async(req:Request,res:Response)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(user && await user.comparePassword(password)){
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                token:generateToken(user._id.toString())
            });
        }else{
            res.status(401).json({message:"Invalid email or password"})
        }
    }catch(error){
        res.status(500).json({message:"Server error",error})
    }
};