import { ITask } from "../models/Task"
import { IBaseRepository } from "./IBaseRepository";

export interface ITaskRepository extends IBaseRepository<ITask> {
    findAllByUserId(userId: string): Promise<ITask[]>;
    getAllByUserId(userId: string): Promise<ITask[]>;
}