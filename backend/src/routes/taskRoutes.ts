import express from "express";
import { taskController } from "../controllers/taskcontroller";
import { TaskService } from "../services/taskService";
import taskRepository from "../repositories/taskRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "../services/authService";
import { taskSchema, updateTaskSchema, deleteTaskSchema } from "../schema/task.schema";
import { validate } from "../middleware/validation.middleware";


const router = express.Router();

const taskRepo = new taskRepository();
const taskService = new TaskService(taskRepo);
const taskCtrl = new taskController(taskService);
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);
const authMiddleware = new AuthMiddleware(authService);

router.use(authMiddleware.protect);

router.get('/stats', taskCtrl.getTaskStats)
router.get("/", taskCtrl.getTask);
router.post('/', validate(taskSchema), taskCtrl.createTask)
router.put('/:id', validate(updateTaskSchema), taskCtrl.updateTask)
router.delete('/:id', validate(deleteTaskSchema), taskCtrl.deleteTask)

export default router