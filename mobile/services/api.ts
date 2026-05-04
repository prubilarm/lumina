import axios from 'axios';
import Constants from 'expo-constants';

// Use the Vercel deployed URL for production, or your machine's IP for local development
// Example: https://Lumina Bank-api.vercel.app/api
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://cajero-automatico-wine.vercel.app/api'; 

const api = axios.create({
    baseURL: API_URL,
});


export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
