import Task, { ITask } from '../models/Task'
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { BaseRepository } from './baseRepository';

export class taskRepository extends BaseRepository<ITask> implements ITaskRepository {
    constructor() {
        super(Task);
    }

    async findAllByUserId(userId: string) {
        return await Task.find({ user: userId }).sort({ createdAt: -1 });
    }
    async getAllByUserId(userId: string) {
        return await Task.find({ user: userId })
    }
}
export default taskRepository