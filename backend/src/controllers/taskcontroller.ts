import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { TaskService } from "../services/taskService";
import { HttpStatus } from "../constants/http-status";
import { Messages } from "../constants/messages";
import { ApiResponse } from "../utils/api-response";



export class taskController {
    constructor(private taskService: TaskService) { }

    getTask = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) return ApiResponse.error(res, Messages.COMMON.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            const tasks = await this.taskService.getUserTask(req.user?._id.toString());
            ApiResponse.success(res, tasks);
        } catch (error: unknown) {
            ApiResponse.error(res, Messages.COMMON.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    createTask = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) return ApiResponse.error(res, Messages.COMMON.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            const io = req.app.get("io");
            const task = await this.taskService.createTask(req.body, req.user?._id.toString(), io);
            ApiResponse.created(res, task);
        } catch (error) {
            const message = error instanceof Error ? error.message : Messages.TASK.INVALID;
            ApiResponse.error(res, message, HttpStatus.BAD_REQUEST);
        }
    }

    updateTask = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) return ApiResponse.error(res, Messages.COMMON.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            const io = req.app.get("io");
            const updatedTask = await this.taskService.updateTask(req.params.id as string, req.body, req.user?._id.toString(), io);
            ApiResponse.success(res, updatedTask);
        } catch (error) {
            ApiResponse.error(res, Messages.COMMON.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    deleteTask = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) return ApiResponse.error(res, Messages.COMMON.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            const io = req.app.get("io")
            const result = await this.taskService.deleteTask(req.params.id as string, req.user?._id.toString(), io);
            ApiResponse.success(res, result, Messages.TASK.REMOVED);
        } catch (error) {
            ApiResponse.error(res, Messages.COMMON.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getTaskStats = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) return ApiResponse.error(res, Messages.COMMON.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            const stats = await this.taskService.getStats(req.user?._id.toString());
            ApiResponse.success(res, stats);
        } catch (error) {
            ApiResponse.error(res, Messages.TASK.STATS_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}