import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        newConfig.headers.Authorization = `Bearer ${token}`;
      }
    }
    return newConfig;
  },
  (error) => Promise.reject(error),
);

export default api;
