import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Trash2 } from 'lucide-react';
import { API_URL } from '../config';

const ApplicationForm = ({ app, onClose, onSuccess, onDelete }) => {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        status: 'Applied',
        link: '',
        notes: '',
        reminderDate: ''
    });

    useEffect(() => {
        if (app) {
            setFormData({
                company: app.company || '',
                role: app.role || '',
                status: app.status || 'Applied',
                link: app.link || '',
                notes: app.notes || '',
                reminderDate: app.reminderDate ? app.reminderDate.split('T')[0] : ''
            });
        }
    }, [app]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (app) {
                await axios.put(`${API_URL}/api/applications/${app._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/api/applications`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving application', error);
            alert('Failed to save application');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-md max-h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">{app ? 'Edit Application' : 'New Application'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                    <form id="app-form" onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                            <input 
                                type="text" 
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="e.g. Google"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                            <input 
                                type="text" 
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="e.g. Frontend Engineer"
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select 
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input-field appearance-none bg-black"
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offered">Offered</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Link to Job Posting</label>
                            <input 
                                type="url" 
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Reminder Date <span className="text-gray-500 text-xs">(optional)</span></label>
                            <input 
                                type="date" 
                                name="reminderDate"
                                value={formData.reminderDate}
                                onChange={handleChange}
                                className="input-field [color-scheme:dark]" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                            <textarea 
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="input-field min-h-[100px] resize-y" 
                                placeholder="Interview details, contact info..."
                            ></textarea>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-white/10 flex justify-between items-center bg-secondary/50 rounded-b-xl">
                    {app ? (
                        <button 
                            type="button" 
                            onClick={() => onDelete(app._id)}
                            className="text-rose-500 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    ) : <div></div>}
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" form="app-form" className="btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
