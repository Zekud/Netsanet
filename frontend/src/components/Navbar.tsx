import { Link, useLocation } from 'react-router-dom';
import { Heart, Scale, FileText, Users, BookOpen, MessageCircle } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: Heart },
        { path: '/legal-advisor', label: 'Legal Advisor', icon: Scale },
        { path: '/appeal-generator', label: 'Appeal Generator', icon: FileText },
        { path: '/support-directory', label: 'Support Directory', icon: Users },
        { path: '/case-stories', label: 'Case Stories', icon: BookOpen },
        { path: '/story-wall', label: 'Story Wall', icon: MessageCircle },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-40">
            <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-20">
                <Link to="/" className="flex items-center gap-3 text-primary-500 text-2xl font-bold">
                    <Heart className="w-8 h-8 text-primary-500" />
                    <span>Netsanet</span>
                </Link>

                <div className="flex gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive
                                        ? 'bg-primary-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary-500'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 