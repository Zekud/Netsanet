import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, Heart } from 'lucide-react';
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
                    {/* Header */}
                    <div className="text-center mb-8 lg:mb-10">
                        <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-primary-100 mb-4 sm:mb-6">
                            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
                        </div>
                        <h2 className="text-responsive-2xl lg:text-responsive-3xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600 text-responsive-base">
                            Sign in to your Netsanet account
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-responsive-sm">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="space-responsive-md" onSubmit={handleSubmit}>
                        <div className="space-responsive-sm">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className="form-input pr-10"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-responsive-sm">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full"
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner w-4 h-4 border-2"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Sign in
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-gray-600 text-responsive-sm">
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/register" 
                                        className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                                    >
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-white/80 text-responsive-sm">
                        Empowering women through legal support and community
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login; 