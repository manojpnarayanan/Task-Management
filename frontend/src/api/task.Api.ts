import api from '../api/auth';

export interface Task {
    _id: string;
    title: string;
    description: string;
    status: "Todo" | "In Progress" | "Completed";
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    createdAt: string;
}
export interface TaskStats {
    total: number;
    completed: number;
    overdue: number;
    pending: number;
}


export const taskService= {
    getTask:async ():Promise<Task[]>=>{
        const response=await api.get('task');
        return response.data;
    },
    getStats:async ():Promise<TaskStats>=>{
        const response=await api.get('task/stats');
        return response.data;
    },
    createTask: async (data:Partial<Task>):Promise<Task>=>{
        const response=await api.post("/task",data);
        return response.data;
    },
    updateTask:async(id:string,data:Partial<Task>):Promise<Task>=>{
        const response=await api.put(`/task/${id}`,data);
        return response.data;
    },
    deleteTask: async (id:string):Promise<{message:string}>=>{
        const response=await api.delete(`/task/${id}`);
        return response.data;
    }
}