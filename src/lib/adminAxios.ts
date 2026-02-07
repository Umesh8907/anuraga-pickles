import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor to add admin auth token
adminApi.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('adminAccessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
adminApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return adminApi(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('adminRefreshToken') : null;

            if (!refreshToken) {
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                // We use axios directly here to avoid the interceptor loop
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('adminAccessToken', accessToken);
                    localStorage.setItem('adminRefreshToken', newRefreshToken);
                }

                adminApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);
                return adminApi(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('adminAccessToken');
                    localStorage.removeItem('adminRefreshToken');
                    window.location.href = '/admin/login'; // Redirect to admin login
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default adminApi;
