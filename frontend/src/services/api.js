import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

const api = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT ────────────────────
api.interceptors.request.use((config) => {
    const tokens = JSON.parse(localStorage.getItem('tokens') || 'null');
    if (tokens?.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
});

// ─── Response interceptor: handle 401 ───────────────────
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('tokens');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;
