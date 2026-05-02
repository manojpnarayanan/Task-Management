import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatsProps {
    stats: {
        total: number;
        completed: number;
        overdue: number;
        pending: number;
    };
}

const TaskStats: React.FC<StatsProps> = ({ stats }) => {
    const chartData = [
        { name: 'Completed', value: stats.completed, color: '#10b981' },
        { name: 'Overdue', value: stats.overdue, color: '#f43f5e' },
        { name: 'On Track', value: stats.pending, color: '#0ea5e9' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 items-center">
            <div className="space-y-4">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 text-sm">Completed Tasks</p>
                    <p className="text-3xl font-bold text-emerald-400">{stats.completed}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 text-sm">Overdue (Missed Deadline)</p>
                    <p className="text-3xl font-bold text-rose-400">{stats.overdue}</p>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl h-80 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-white mb-2">Completion Status</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TaskStats;
