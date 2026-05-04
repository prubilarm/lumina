import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cajero-automatico-wine.vercel.app/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
