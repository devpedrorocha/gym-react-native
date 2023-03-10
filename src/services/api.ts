import { AppError } from '@utils/AppError';
import axios from 'axios';

const api = axios.create({
  baseURL: "http://192.168.100.74:3333",
});

api.interceptors.response.use((response) => response, (error) => {
    if (error.message && error.response.data) {
        return Promise.reject(new AppError(error.response.data.message));
    } else {
        return Promise.reject(new AppError('Erro no servidor. Tente novamente mais tarde.'))
    }
})

export { api }
