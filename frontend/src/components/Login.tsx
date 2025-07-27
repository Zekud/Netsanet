import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, Heart, Shield, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const success = await login(username, password);

        if (!success) {
            setError('Invalid username or password');
        }

        setLoading(false);
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left Side - Visual Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-16 left-16 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-16 right-16 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-8 lg:px-12 xl:px-16 text-white">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold">Netsanet</h1>
                        </div>
                        
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                            Welcome Back to Your
                            <span className="block text-yellow-300">Support Network</span>
                        </h2>
                        
                        <p className="text-base lg:text-lg text-white/90 mb-6 leading-relaxed">
                            Continue your journey toward justice and empowerment. Access legal guidance, connect with support organizations, and share your experiences.
                        </p>
                        
                        {/* Feature Highlights */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Shield className="w-3 h-3" />
                                </div>
                                <span className="text-white/90 text-sm">AI-Powered Legal Guidance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Users className="w-3 h-3" />
                                </div>
                                <span className="text-white/90 text-sm">Community Support Network</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Heart className="w-3 h-3" />
                                </div>
                                <span className="text-white/90 text-sm">Safe & Confidential Platform</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50">
                <div className="w-full max-w-sm">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-xl flex items-center justify-center">
                                <Heart className="w-5 h-5 text-primary-600" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Netsanet</h1>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Welcome Back</h2>
                        <p className="text-gray-600 text-sm">Sign in to continue your journey</p>
                    </div>

                    {/* Login Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <LogIn className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Sign In</h3>
                            <p className="text-gray-600 text-sm">Access your account and continue</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-xs flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        {/* Login Form */}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-sm"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Sign In
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="text-center mt-6 pt-4 border-t border-gray-100">
                            <p className="text-gray-600 text-xs">
                                Don't have an account?{' '}
                                <Link 
                                    to="/register" 
                                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 hover:underline"
                                >
                                    Create one now
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-4">
                        <p className="text-gray-500 text-xs">
                            Empowering women through legal support and community
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 