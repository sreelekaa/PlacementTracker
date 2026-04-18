import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, Briefcase, CheckCircle2, XOctagon } from 'lucide-react';
import { API_URL } from '../config';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f43f5e']; // Applied, Interviewing, Offered, Rejected

const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${API_URL}/api/applications/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const data = [
        { name: 'Applied', value: stats.Applied || 0 },
        { name: 'Interviewing', value: stats.Interviewing || 0 },
        { name: 'Offered', value: stats.Offered || 0 },
        { name: 'Rejected', value: stats.Rejected || 0 },
    ];

    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${colorClass}`}></div>
            <div className="flex justify-between items-start z-10">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${colorClass.replace('bg-', 'text-')}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-gray-400 mb-8">Here's what's happening with your job search today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Applications" value={total} icon={Briefcase} colorClass="bg-blue-500" />
                <StatCard title="In Progress" value={stats.Interviewing || 0} icon={Activity} colorClass="bg-cyan-500" />
                <StatCard title="Offers Received" value={stats.Offered || 0} icon={CheckCircle2} colorClass="bg-emerald-500" />
                <StatCard title="Rejected" value={stats.Rejected || 0} icon={XOctagon} colorClass="bg-rose-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">Application Status Pipeline</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={80} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
