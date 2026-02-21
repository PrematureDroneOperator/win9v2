import axios from 'axios';

// Get base URL from env or use default for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: `${API_URL}/api/drivers`,
    credentials: true,
});

// Add a request interceptor to append JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('driverToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
