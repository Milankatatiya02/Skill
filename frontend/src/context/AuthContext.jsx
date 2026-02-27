import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokens = JSON.parse(localStorage.getItem('tokens') || 'null');
        if (tokens?.access) {
            api.get('/auth/me/')
                .then((res) => {
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                })
                .catch(() => {
                    localStorage.removeItem('tokens');
                    localStorage.removeItem('user');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login/', { email, password });
        localStorage.setItem('tokens', JSON.stringify(res.data.tokens));
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    const signup = async (name, email, password) => {
        const res = await api.post('/auth/signup/', { name, email, password });
        localStorage.setItem('tokens', JSON.stringify(res.data.tokens));
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        setUser(null);
    };

    const refreshUser = async () => {
        const res = await api.get('/auth/me/');
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
