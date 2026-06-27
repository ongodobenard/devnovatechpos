import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('pos_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await authAPI.login(email, password);
        if (res.data.success) {
            // Store user WITH token so axios interceptor can use it
            const userData = { ...res.data.user, token: res.data.token }
            setUser(userData);
            localStorage.setItem('pos_user', JSON.stringify(userData));
            return userData;
        }
        throw new Error(res.data.error || 'Login failed');
    };

    const logout = async () => {
        try { await authAPI.logout() } catch(e) {}
        setUser(null);
        localStorage.removeItem('pos_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}