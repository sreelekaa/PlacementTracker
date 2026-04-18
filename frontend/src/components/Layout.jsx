import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, CodeSquare } from 'lucide-react';
import clsx from 'clsx';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/board', label: 'Pipeline', icon: CodeSquare }, // Fallback icon instead of KanabnSquare
    ];

    return (
        <div className="min-h-screen bg-primary flex">
            {/* Sidebar */}
            <aside className="w-64 glass-panel border-l-0 border-t-0 border-b-0 rounded-none hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-white font-bold text-xl tracking-wider">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            P
                        </div>
                        PlacementTracker
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    isActive 
                                        ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate">{user?.name}</span>
                    </div>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header for mobile */}
                <header className="md:hidden glass-panel border-r-0 border-l-0 border-t-0 rounded-none p-4 flex justify-between items-center z-10 relative">
                    <div className="text-white font-bold text-lg">P.Tracker</div>
                    <button onClick={logout} className="text-gray-400 hover:text-white">
                        <LogOut className="w-6 h-6" />
                    </button>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8 z-10 relative">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
