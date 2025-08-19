import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../lib/api';

interface User {
    id: number;
    username: string;
    email: string;
    is_admin: boolean;
    is_active: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Set up auth header on shared api client
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post('/auth/login', {
                username,
                password
            });

            const { access_token, user: userData } = response.data;

            setToken(access_token);
            // Set header immediately to avoid race before useEffect runs
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setUser(userData);
            localStorage.setItem('token', access_token);

            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const register = async (username: string, email: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post('/auth/register', {
                username,
                email,
                password
            });

            const { access_token, user: userData } = response.data;

            setToken(access_token);
            // Set header immediately to avoid race before useEffect runs
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setUser(userData);
            localStorage.setItem('token', access_token);

            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin || false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 