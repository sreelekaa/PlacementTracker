import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
        } catch (error) {
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="glass-panel p-8 w-full max-w-md z-10 relative">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-4 border border-white/20">
                        <UserPlus className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create an account</h2>
                    <p className="text-gray-400">Start tracking your job applications today</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            className="input-field" 
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="input-field" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary py-3">Register</button>
                    
                    <p className="text-center text-sm text-gray-400 mt-4">
                        Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
