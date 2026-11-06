import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('senabil_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (localStorage.getItem('senabil_token')) {
        localStorage.removeItem('senabil_token');
        localStorage.removeItem('senabil_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
