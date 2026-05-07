import express  from "express";
import { taskController } from "../controllers/taskcontroller";
import { TaskService } from "../services/taskService";
import taskRepository from "../repositories/taskRepository";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { UserRepository } from "../repositories/userRepository";

const router=express.Router();

const taskRepo=new taskRepository();
const taskService=new TaskService(taskRepo);
const taskCtrl=new taskController(taskService);
const userRepo=new UserRepository();
const authMiddleware=new AuthMiddleware(userRepo);

router.use(authMiddleware.protect);

router.get('/stats',taskCtrl.getTaskStats)
router.get("/",taskCtrl.getTask);
router.post('/',taskCtrl.createTask)
router.put('/:id',taskCtrl.updateTask)
router.delete('/:id',taskCtrl.deleteTask)

export default router