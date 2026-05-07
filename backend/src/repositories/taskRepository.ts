import Task, {ITask} from '../models/Task'
import { ITaskRepository } from '../interfaces/ITaskRepository';

export class taskRepository implements ITaskRepository{
    async findAllByUserId(userId:string){
        return await Task.find({user:userId}).sort({createdAt:-1});
    }
    async create(data:Partial<ITask>){
        return await Task.create(data)
    }
    async findById(id:string){
        return await Task.findById(id)
    }
    async update(id:string,data:Partial<ITask>){
        return await Task.findByIdAndUpdate(id,data,{new:true})
    }
    async delete(id:string){
        return await Task.findByIdAndDelete(id)
    }
    async getAllByUserId(userId:string){
        return await Task.find({user:userId})
    }
}
export default taskRepository