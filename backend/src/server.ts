import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import {Server} from 'socket.io'
import {createServer} from 'http'
import connectDB from "./models/DBconnect";
import authRoutes from './routes/authRoutes'
import taskRoutes from './routes/taskRoutes'
import cookieParser from "cookie-parser" 

dotenv.config();
const app=express();
const httpServer=createServer(app)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const io= new Server(httpServer,{
    cors:{
        origin:FRONTEND_URL,
        methods:["GET","POST","PUT","DELETE"],
        credentials:true
    }
})

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth',authRoutes);
app.use('/task',taskRoutes)
connectDB();

io.on('connection',(socket)=>{
    console.log('User Connected',socket.id)
    socket.on("join",(userId:string)=>{
        socket.join(userId);
        console.log(`user ${socket.id} joined room`)
    })

    socket.on('disconnect',()=>{
        console.log("user Disconnected",socket.id)
    });
});
app.set('io',io);

app.get("/",(req,res)=>{
    res.send("Task management Api running")
});
const PORT=process.env.PORT

httpServer.listen(PORT,()=>{
    console.log("Server connected successfully")
})

