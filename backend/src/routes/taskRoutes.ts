import express  from "express";
import { getTask,createTask,updateTask,deleteTask, getTaskStats } from "../controllers/taskcontroller"
import { protect } from "../middleware/authMiddleware";

const router=express.Router();

router.get('/stats',protect,getTaskStats)
router.get("/",protect,getTask);
router.post('/',protect,createTask)
router.put('/:id',protect,updateTask)
router.delete('/:id',protect,deleteTask)

export default router