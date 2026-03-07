import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
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

// ─── Response interceptor: refresh token on 401 ─────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        // If 401 and not already retried, attempt token refresh
        if (err.response?.status === 401 && !originalRequest._retry) {
            // Don't try to refresh the refresh-token request itself
            if (originalRequest.url?.includes('/auth/token/refresh/')) {
                localStorage.removeItem('tokens');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(err);
            }

            if (isRefreshing) {
                // Queue requests while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const tokens = JSON.parse(localStorage.getItem('tokens') || 'null');
            if (!tokens?.refresh) {
                localStorage.removeItem('tokens');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(err);
            }

            try {
                const { data } = await axios.post('/api/auth/token/refresh/', {
                    refresh: tokens.refresh,
                });
                const newTokens = { ...tokens, access: data.access };
                if (data.refresh) newTokens.refresh = data.refresh;
                localStorage.setItem('tokens', JSON.stringify(newTokens));

                processQueue(null, data.access);
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                return api(originalRequest);
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                localStorage.removeItem('tokens');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default api;
