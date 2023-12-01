import axios, { AxiosRequestConfig } from 'axios';
import { LocalStorage } from './utils';
import { CreateUserDto, LoginDto } from '@/interfaces/interfaces';


const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
});

// Add an interceptor to set authorization header with user token before requests
apiClient.interceptors.request.use(
  function (config) {
    // Retrieve user token from local storage
    const token = LocalStorage.get('token') as string | null;

    // Make headers optional in AxiosRequestConfig
    config.headers = config.headers || {};

    // Manually set the Authorization header
    config.headers['Authorization'] = token ? `Bearer ${token}` : '';

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const login = async (data: LoginDto) => {
  try {
    const response = await apiClient.post('user/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('usuario', response.data.usuario);

    return response.data;
  } catch (error) {
    throw new Error('Erro durante o login: ' + error);
  }
};

export const registro = async (data: CreateUserDto) => {
  try {
    const response = await apiClient.post('user/register', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Erro durante o registro: ' + error);
  }
};