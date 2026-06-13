import React from "react";
import { CheckCircle, Clock, Trash2, Pencil } from "lucide-react";
import type { Task } from "../api/task.Api";


interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, currentStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                        task.status === 'In Progress' ? 'bg-sky-500/10 text-sky-400' :
                            'bg-slate-800 text-slate-400'
                    }`}>
                    {task.status}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-slate-500 hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-sky-400 transition-colors">{task.title}</h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">{task.description}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Clock className="w-4 h-4" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB') : "No due Date"}
                </div>
                <button
                    onClick={() => onToggleStatus(task._id, task.status)}
                    className={`p-2 rounded-lg transition-all active:scale-90 ${task.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                >
                    <CheckCircle className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
export default TaskCard;
