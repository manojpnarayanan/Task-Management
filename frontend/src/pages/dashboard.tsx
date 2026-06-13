import { useEffect, useState } from 'react';
import { Plus, LogOut, } from 'lucide-react';
import AddTaskModal from '../components/AddTaskModal';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import TaskStats from '../components/TaskStats';
import { taskService, } from '../api/task.Api';
import type { Task } from '../api/task.Api';
import { authService } from '../api/auth.Api';
import TaskCard from '../components/TaskCard';


const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [stats, setStats] = useState({ total: 0, completed: 0, overdue: 0, pending: 0 })

    const navigate = useNavigate();

    const fetchTasks = async () => {
        try {

            const task = await taskService.getTask();
            setTasks(task);
        } catch (error) {
            console.error("Error fetching data", error)
        } finally {
            setLoading(false);
        }
    };
    const fetchStats = async () => {
        try {
            const task = await taskService.getStats();
            setStats(task);
        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };
    useEffect(() => {
        const socket = io(import.meta.env.VITE_SOCKET_URL);
        const userId = localStorage.getItem('userId');

        if (userId) {
            socket.emit('join', userId);
        }

        socket.on('taskCreated', (newTask) => {
            setTasks(prev => [newTask, ...prev]);
            fetchStats();
            Swal.fire({
                title: 'New Task Created!',
                text: `Task: ${newTask.title}`,
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#0f172a',
                color: '#fff'
            });
        })
        socket.on("taskUpdated", (updatedTask) => {
            setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
            fetchStats()
        })
        socket.on('taskDeleted', (deletedId) => {
            setTasks(prev => prev.filter(t => t._id !== deletedId));
            fetchStats();
        })
        return () => { socket.disconnect() };
    }, []);

    useEffect(() => {
        const initializeDashboard = async () => {
            await fetchTasks();
            await fetchStats();
        };
        initializeDashboard();
    }, [])

    const toggleStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'Completed' ? "Todo" : "Completed";
        try {

            await taskService.updateTask(id, { status: nextStatus });
            fetchTasks();
            fetchStats();
        } catch (error) {
            console.error("Error updating task", error);
        }
    };

    const deleteTask = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure",
            text: "You wont be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#ef4444',
            confirmButtonText: "Yes Delete it",
            background: "#0f172a",
            color: "#fff"
        })
        if (result.isConfirmed)
            try {
                await taskService.deleteTask(id);
                setTasks(tasks.filter(t => t._id !== id));
                fetchStats();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your task has been removed.',
                    icon: 'success',
                    background: '#0f172a',
                    color: '#fff'
                });
            } catch (error) {
                Swal.fire("Error", "Could not delete task", "error");
                console.error("Error deleting task", error);
            }
    };

    const handleLogout = async () => {
        try {

            await authService.logout()
        } catch (error) {
            console.error("Logout Error", error);
        } finally {
            localStorage.removeItem('userId');
            navigate('/login')
        }
    }


    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">My Tasks</h1>
                    <p className="text-slate-400">Keep track of your productivity.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="text-slate-400 hover:text-red-400 flex items-center gap-2 px-4 py-2 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-sky-500/20 active:scale-95">
                        <Plus className="w-5 h-5" />
                        Add Task
                    </button>
                </div>
            </div>


            {!loading && <TaskStats stats={stats} />}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                </div>
            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={(task) => { setTaskToEdit(task); setIsModalOpen(true); }}
                            onDelete={deleteTask}
                            onToggleStatus={toggleStatus}
                        />
                    ))}
                </div>

            )}
            {tasks.length === 0 && !loading && (
                <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800">
                    <p className="text-slate-500">No tasks found. Click "Add Task" to get started!</p>
                </div>
            )}

            <AddTaskModal
                key={taskToEdit?._id || 'new'}
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setTaskToEdit(null) }}
                onTaskAdded={() => { fetchTasks(); fetchStats(); }}
                taskToEdit={taskToEdit}
            />
        </div>
    );

}
export default Dashboard