import { Server } from "socket.io";
import { ITask } from "../models/Task";

export interface TaskStats {
    total: number;
    completed: number;
    overdue: number;
    pending: number;
}


export interface ITaskService {
    getUserTask(userId: string): Promise<ITask[]>;
    createTask(data: Partial<ITask>, userId: string, io: Server): Promise<ITask>;
    updateTask(id: string, data: Partial<ITask>, userId: string, io: Server): Promise<ITask | null>;
    deleteTask(id: string, userId: string, io: Server): Promise<{ message: string }>;
    getStats(userId: string): Promise<TaskStats>
}