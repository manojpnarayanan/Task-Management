import { useState } from "react";
import api from "../api/auth";
import { X,Type,AlignLeft,Calendar,Flag } from "lucide-react";


export interface Task {
    _id: string;
    title: string;
    description: string;
    status: "Todo" | "In Progress" | "Completed";
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    createdAt: string;
}

interface AddTaskModalProps{
    isOpen:boolean;
    onClose:()=>void;
    onTaskAdded:()=>void;
    taskToEdit?:Task | null
}

const AddTaskModal:React.FC<AddTaskModalProps>=({isOpen,onClose,onTaskAdded,taskToEdit})=>{
    const [formData, setFormData] = useState({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || "",
    priority: (taskToEdit?.priority || "Medium") as "Low" | "Medium" | "High",
    dueDate: taskToEdit?.dueDate 
        ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0]
});

    const [error,setError]=useState("");

    // useEffect(() => {
    //     if (taskToEdit) {
    //         setFormData({
    //             title: taskToEdit.title,
    //             description: taskToEdit.description,
    //             priority: taskToEdit.priority,
    //             dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : ""
    //         });
    //     } else {
    //         setFormData({
    //             title: '',
    //             description: "",
    //             priority: "Medium",
    //             dueDate: new Date().toISOString().split('T')[0]
    //         });
    //     }
    // }, [taskToEdit, isOpen]);

    if(!isOpen) return null;
    const handleSubmit=async (e:React.FormEvent)=>{
        e.preventDefault();
        setError("");
        if(formData.title.trim().length<3){
          setError("Title must be atleast 3 cheracters long");
          return;
        }
        if(!taskToEdit){
          const selectedDate=new Date(formData.dueDate);
          const today=new Date();
          today.setHours(0,0,0,0);
          if(selectedDate < today){
            setError("Due date cannot be in the past");
            return;
          }
        }
        const token=localStorage.getItem('token');
        try{
            if (taskToEdit) {
                await api.put(`/task/${taskToEdit._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post('/task', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            onTaskAdded();
            onClose();
            setFormData({
                title:"",
                description:"",
                priority:"Medium",
                dueDate:""
            });
        }catch(error){
            console.error("Error adding task",error)
        }
    }

    return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{taskToEdit?"Edit Task":"Create new Task"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Task Title</label>
            <div className="relative">
              <Type className="absolute left-3 top-3 text-slate-600 w-5 h-5" />
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Description</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-slate-600 w-5 h-5" />
              <textarea
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all h-24"
                placeholder="Add more details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Priority</label>
              <div className="relative">
                <Flag className="absolute left-3 top-3 text-slate-600 w-5 h-5" />
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-sky-500 outline-none appearance-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value  as "Low"| "Medium" | "High"})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Due Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-600 w-5 h-5 pointer-events-none" />
                <input
                  type="date"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all cursor-pointer"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  onClick={(e)=>{
                    const input=e.currentTarget;
                    if(typeof input.showPicker === 'function'){
                        input.showPicker()
                    }
                  }}
                />
              </div>
            </div>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm animate-pulse">
        {error}
    </div>

          )}
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-all mt-4 shadow-lg shadow-sky-500/20 active:scale-95"
          >
            {taskToEdit? 'Update Task' :'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );

}

export default AddTaskModal;
