import { ITask } from "../models/Task"

export interface ITaskRepository{
    findAllByUserId(userId:string):Promise<ITask[]>;
    create(data:Partial<ITask>):Promise<ITask>;
    findById(id:string):Promise<ITask | null>;
    update(id:string,data:Partial<ITask>):Promise<ITask | null>;
    delete(id:string):Promise<ITask | null>;
    getAllByUserId(userId:string):Promise<ITask[]>;
}