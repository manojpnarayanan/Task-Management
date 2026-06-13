import { ITaskRepository } from "../interfaces/ITaskRepository";
import { ITask } from "../models/Task";
import { Server } from 'socket.io';
import mongoose from "mongoose";

export class TaskService {
    constructor(private taskRepo: ITaskRepository) { }

    async getUserTask(userId: string) {
        return await this.taskRepo.findAllByUserId(userId);
    }
    async createTask(data: Partial<ITask>, userId: string, io: Server) {
        if (!data.title || data.title.trim().length < 3) {
            throw new Error("Title must be atleast 3 character");
        }

        const task = await this.taskRepo.create({
            ...data,
            user: new mongoose.Types.ObjectId(userId)
        });
        io.to(userId).emit("taskCreated", task);
        return task;
    }
    async updateTask(id: string, data: Partial<ITask>, userId: string, io: Server): Promise<ITask | null> {
        const task = await this.taskRepo.findById(id);
        if (!task) throw new Error("Task not found");
        if (task.user.toString() !== userId) throw new Error("Not authorized");

        const updatedTask = await this.taskRepo.update(id, data);
        if (updatedTask) {
            io.to(userId).emit("taskUpdated", updatedTask)
        }
        return updatedTask
    }
    async deleteTask(id: string, userId: string, io: Server): Promise<{ message: string }> {
        const task = await this.taskRepo.findById(id);
        if (!task) throw new Error("Task not found");
        if (task.user.toString() !== userId) throw new Error("Not authorized");
        await this.taskRepo.delete(id);
        io.to(userId).emit("taskDeleted", id);
        return { message: "Task removed" }
    }
    async getStats(userId: string): Promise<{ total: number; completed: number; overdue: number; pending: number }> {
        const tasks = await this.taskRepo.getAllByUserId(userId);
        const now = new Date();
        return {
            total: tasks.length,
            completed: tasks.filter(t => t.status === 'Completed').length,
            overdue: tasks.filter(t => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < now).length,
            pending: tasks.filter(t => t.status !== 'Completed' && (!t.dueDate || new Date(t.dueDate) >= now)).length
        }
    }
}