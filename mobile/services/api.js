import axios from 'axios';

// Usamos tu IP local para que el celular físico pueda conectarse al servidor de la PC
const BASE_URL = 'http://10.116.165.57:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
