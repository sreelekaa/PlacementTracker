import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import ApplicationForm from '../components/ApplicationForm';
import { API_URL } from '../config';

const KanbanBoard = () => {
    const [applications, setApplications] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);

    const statuses = ['Applied', 'Interviewing', 'Offered', 'Rejected'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
            case 'Interviewing': return 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400';
            case 'Offered': return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
            case 'Rejected': return 'border-rose-500/50 bg-rose-500/10 text-rose-400';
            default: return 'border-gray-500/50 bg-gray-500/10 text-gray-400';
        }
    };

    const fetchApps = async () => {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/api/applications`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(data);
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this application?')) {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/applications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchApps();
        }
    };

    const StatusColumn = ({ status }) => {
        const columnApps = applications.filter(app => app.status === status);

        return (
            <div className="flex flex-col gap-4 min-w-[300px] w-full max-w-[350px]">
                <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="font-semibold text-gray-200 flex items-center gap-2">
                        {status} 
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{columnApps.length}</span>
                    </h3>
                </div>

                <div className="flex-1 space-y-4">
                    {columnApps.map(app => (
                        <div key={app._id} className="glass-panel p-4 cursor-pointer hover:-translate-y-1 transition-transform group" onClick={() => { setEditingApp(app); setIsFormOpen(true); }}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-white text-lg">{app.company}</h4>
                                <span className={clsx("text-xs px-2 py-1 border rounded-md shadow-sm", getStatusColor(app.status))}>
                                    {app.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 font-medium">{app.role}</p>
                            {app.appliedDate && (
                                <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-white/10">
                                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    ))}
                    {columnApps.length === 0 && (
                        <div className="border border-dashed border-white/10 rounded-xl h-32 flex items-center justify-center text-gray-500 text-sm">
                            No applications
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Pipeline</h1>
                    <p className="text-gray-400 text-sm">Drag and drop features coming soon. Click a card to edit.</p>
                </div>
                <button onClick={() => { setEditingApp(null); setIsFormOpen(true); }} className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" /> New Application
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 flex gap-6 snap-x">
                {statuses.map(status => (
                    <StatusColumn key={status} status={status} />
                ))}
            </div>

            {isFormOpen && (
                <ApplicationForm 
                    app={editingApp} 
                    onClose={() => setIsFormOpen(false)} 
                    onSuccess={() => { setIsFormOpen(false); fetchApps(); }}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default KanbanBoard;
