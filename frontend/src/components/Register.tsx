import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Eye, EyeOff, Heart, Shield, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        const success = await register(username, email, password);

        if (!success) {
            setError('Registration failed. Username or email may already be taken.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Visual Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary-600 via-secondary-700 to-primary-600 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16 xl:px-20 text-white">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Heart className="w-7 h-7" />
                            </div>
                            <h1 className="text-3xl font-bold">Netsanet</h1>
                        </div>
                        
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                            Join Our
                            <span className="block text-yellow-300">Empowered Community</span>
                        </h2>
                        
                        <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
                            Start your journey toward justice and empowerment. Connect with a supportive community, access legal resources, and share your experiences safely.
                        </p>
                        
                        {/* Benefits List */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="text-white/90">Free Legal Guidance & Resources</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="text-white/90">Anonymous Story Sharing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="text-white/90">24/7 Community Support</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="text-white/90">Secure & Confidential Platform</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 xl:px-16 bg-gray-50">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-primary-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Netsanet</h1>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Join Our Community</h2>
                        <p className="text-gray-600">Create your account and start your journey</p>
                    </div>

                    {/* Register Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <UserPlus className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h3>
                            <p className="text-gray-600">Join our supportive community</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        {/* Register Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="Choose a username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <div className="text-center mt-8 pt-6 border-t border-gray-100">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 hover:underline"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <p className="text-gray-500 text-sm">
                            Join our community of empowered women
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register; 