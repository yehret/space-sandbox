import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// 🔥 Перехоплювач запитів: беремо токен прямо з пам'яті браузера
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехоплювач відповідей
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Якщо токен прострочений або невалідний
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload(); // Простий спосіб скинути стан і "розлогінити" юзера
    }
    return Promise.reject(error);
  },
);
