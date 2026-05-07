import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Task from "../models/Task";
import { TaskService } from "../services/taskService";



export class taskController{
    constructor(private taskService:TaskService){}

    getTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        const tasks = await this.taskService.getUserTask(req.user?._id.toString());
        res.json(tasks);
    } catch (error:unknown) {
        res.status(500).json({ message: "Server Error", error })
    }
    }

    createTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        const io = req.app.get("io");
        const task=await this.taskService.createTask(req.body,req.user?._id.toString(),io);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: "Invalid Task" });
    }
  }

  updateTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
            const io = req.app.get("io");
            const updatedTask =await this.taskService.updateTask(req.params.id as string,req.body,req.user?._id.toString(),io);
            res.json(updatedTask)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        const taskId=req.params.id;
        if(!taskId){
            return res.status(400).json({message:"Task id is required"})
        }
        const io = req.app.get("io")
        const result=await this.taskService.deleteTask(taskId as string,req.user?._id.toString(),io);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
} 
getTaskStats = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        const stats = await this.taskService.getStats(req.user?._id.toString());
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error })
    }
}
}