import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import {Server} from 'socket.io'
import {createServer} from 'http'
import connectDB from "./models/DBconnect";
import authRoutes from './routes/authRoutes'
import taskRoutes from './routes/taskRoutes'
 

dotenv.config();
const app=express();
const httpServer=createServer(app)
const io= new Server(httpServer,{
    cors:{
        origin:"http://localhost:5174",
        methods:["GET","POST","PUT","DELETE"]
    }
})

app.use(cors());
app.use(express.json());

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

