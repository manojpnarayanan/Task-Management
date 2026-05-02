import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Task from "../models/Task";


export const getTask = async (req: AuthRequest, res: Response) => {
    try {
        const tasks = await Task.find({ user: req.user?._id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title || title.trim().length < 3) {
            return res.status(400).json({ message: "Title must be at least 3 characters" });
        }
        if (dueDate && new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({ message: "Due date cannot be in the past" });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            user: req.user?._id,
        })
        const io = req.app.get("io");
        io.to(task.user.toString()).emit("taskCreated", task);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: "Invalid Task" });
    }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, dueDate } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        if (task.user.toString() !== req.user?._id.toString()) {
            return res.status(401).json({ message: "Not authorized" })
        }
        if (!title || title.trim().length < 3) {
            return res.status(400).json({ message: "Title must be at least 3 character" });
        }
        if (dueDate && new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({ message: "Due date cannot be in the past" })
        }


        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedTask) {
            const io = req.app.get("io");
            io.to(updatedTask.user.toString()).emit("taskUpdated", updatedTask)
        }
        res.json(updatedTask)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        if (task.user.toString() !== req.user?._id.toString()) {
            return res.status(401).json({ message: "Not Authorized" })
        }
        await task.deleteOne();
        const io = req.app.get("io")
        io.to(task.user.toString()).emit("taskDeleted", req.params.id)
        res.json({ message: "Task removed" })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

export const getTaskStats = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        const tasks = await Task.find({ user: userId });
        const now = new Date();
        const stats = {
            total: tasks.length,
            completed: tasks.filter(t => t.status === "Completed").length,
            overdue: tasks.filter(t => t.status !== "Completed" && t.dueDate && new Date(t.dueDate) < now).length,
            pending: tasks.filter(t => t.status !== "Completed" && (!t.dueDate || new Date(t.dueDate) >= now)).length
        }
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error })
    }
}